import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Select,
  Text3D,
  Center,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3 } from "three";
import { MathUtils } from "three";
import { Model } from "./object";

let direction = new THREE.Vector3(0, 0, 0);
let cameraPosition = new THREE.Vector3(0, 0, 0);
const letterSize = 833 / 1000;
extend({ TextGeometry });

const UpdateCam = ({ dest, moving }) => {
  const [finished, setFinished] = useState(false);
  let dx = 5;
  let destx = dest.x + dx;
  let desty = dest.y + dx;
  let destz = dest.z + dx;
  const vec = new THREE.Vector3();
  useEffect(() => {
    if (moving === true) {
      setFinished(true);
    }
  }, [moving]);
  useEffect(() => {
    setFinished(false);
  }, [dest]);
  useFrame((state, event) => {
    if (dest && !finished) {
      state.camera.position.lerp(vec.set(destx, desty, destz), 0.01);

      if (
        Math.abs(state.camera.position.x - dest.x - dx) < 0.5 &&
        Math.abs(state.camera.position.y - dest.y - dx) < 0.5 &&
        Math.abs(state.camera.position.z - dest.z - dx) < 0.5
      ) {
        setFinished(true);
      }
    }
    if (dest) {
      //state.camera.position.lerp(vec.set(destx, desty, destz), 0.01);
      direction.x = MathUtils.lerp(direction.x, dest.x, 0.05); //linear interpolation
      direction.y = MathUtils.lerp(direction.y, dest.y, 0.05);
      direction.z = MathUtils.lerp(direction.z, dest.z, 0.05);
      state.camera.lookAt(direction);
    }
  });
  return <mesh></mesh>; //R3F hooks can only be called in Canvas component
};

export function Connnection({ from, to, color, type }) {
  const connection = useRef();
  const [opacity, setOpacity] = useState(1);
  const len = Math.sqrt(
    Math.pow(from[0] - to[0], 2) +
      Math.pow(from[1] - to[1], 2) +
      Math.pow(from[2] - to[2], 2)
  );

  const position = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];

  useEffect(() => {
    connection.current.lookAt(new Vector3(...to));
    connection.current.rotateX(Math.PI / 2);
  });

  return (
    <mesh position={position} ref={connection}>
      <cylinderGeometry
        args={
          type && type === "mark" ? [0.1, 0.1, len, 32] : [0.01, 0.01, len, 32]
        }
      />
      <meshStandardMaterial opacity="1" color={color} />
    </mesh>
  );
}

function TextUpdate({ dest, textRef }) {
  const [angle, setAngle] = useState(0);
  useFrame((state) => {
    setAngle(angle + 0.01);
    // Calculate the new x and y position
    let y = dest.y + 2 * Math.cos(angle);
    let z = dest.z + 2 * Math.sin(angle);
    // Update the position of the mesh
    if (textRef) {
      textRef.current.position.set(dest.x, y, z);
      textRef.current.lookAt(state.camera.position);
    }
  });
}

function Find(id, data) {
  let query = id;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === query) {
      return data[i];
    }
  }
  return null;
}

export default function Main({ current, updateCurrent, data, centerN }) {
  const [selected, setSelected] = useState([]);
  const textRef = useRef();
  const [dest, setDest] = useState(new Vector3(0, 0, 0));

  const [moving, setMoving] = useState(false);
  useEffect(() => {
    if (selected[0] && selected[0].name) {
      updateCurrent(selected[0].name);
    }
  }, [selected]);

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.position.x = dest.x;
      textRef.current.position.y = dest.y;
      textRef.current.position.z = dest.z;
    }
  }, [dest]);

  useEffect(() => {
    setDest(new Vector3(...current.position));
  }, [current]);

  return (
    <div className="h-screen">
      <Suspense
        fallback={
          <div className="h-screen w-screen flex justify-center items-center">
            Loading...
          </div>
        }
      >
        <Canvas
          camera={{ position: [14, 3, 0] }}
          onMouseDown={() => {
            setMoving(true);
          }}
          onMouseUp={() => {
            setMoving(false);
          }}
          onDrag={() => {
            setMoving(true);
          }}
          onDragEnd={() => {
            setMoving(false);
          }}
          onTouchStart={() => {
            setMoving(true);
          }}
          onTouchEnd={() => {
            setMoving(false);
          }}
          // onScroll={() => {
          //   setMoving(true);
          // }}
        >
          <ambientLight />
          <Stars depth={200} count={10000} radius={100} />

          <OrbitControls target={centerN} />

          <Environment preset="sunset" />
          <pointLight position={[30, 30, 30]} />
          {current.to
            ? current.to.map((con) => {
                let to = Find(con, data);
                if (to)
                  return (
                    <Connnection
                      color={"red"}
                      key={to.position + "Shine"}
                      to={to.position}
                      from={current.position}
                      type={"mark"}
                    />
                  );
              })
            : ""}
          <Select box onChange={setSelected}>
            {data.map((box) => {
              let res = box.to.map((connection) => {
                let to = Find(connection, data);
                if (to)
                  return (
                    <Connnection
                      color={box.color}
                      key={box.id + connection + "s"}
                      to={to.position}
                      from={box.position}
                    />
                  );
              });

              return (
                <>
                  <Model
                    colori={box.color}
                    key={box.id}
                    position={box.position}
                    name={box.id}
                    size={box.size ? box.size : 1}
                  />
                  {...res}
                </>
              );
            })}
          </Select>

          <UpdateCam dest={dest} moving={moving} />
          <TextUpdate dest={dest} textRef={textRef} />
          <Center position={dest} ref={textRef}>
            <Text3D
              curveSegments={16}
              bevelEnabled
              bevelSize={0.04}
              bevelThickness={0.1}
              height={0.1}
              lineHeight={0.5}
              // letterSpacing={-0.06}
              size={0.4}
              font="/Cousine_Bold.json"
            >
              {current.id}
              <meshNormalMaterial />
            </Text3D>
          </Center>
        </Canvas>
      </Suspense>
    </div>
  );
}

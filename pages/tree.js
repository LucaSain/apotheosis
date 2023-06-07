import Main from "../components/three/main";
import Drawer from "../components/drawer";
import Legend from "../components/legend";
import { useState, useRef } from "react";
import { Vector3 } from "three";
import { useEffect } from "react";
import { data, order } from "../utils/data"
let scale = 40;



export function Find(id, data) {
  let query = id;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === query) {
      return data[i];
    }
  }
  return data[0];
}



export default function Tree() {
  const searchRef = useRef();
  const [epoque, setEpoque] = useState("Antichitate");
  const [searchData, setSearchData] = useState([]);
  const [prev, setPrev] = useState("Heraclit");
  const [next, setNext] = useState("Aristotel");
  const [open, setOpen] = useState(false);

  const updateOpen = (arg) => {
    setOpen(arg);
  };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          updateOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(searchRef);

  const [current, setCurrent] = useState({
    id: "Aristotel",
    current: "Phenomenology",
    color: "white",
    image: "/aristotel.png",
    position: [-0.2090384083444175, -3.534668242616069, 1.860758812548865].map(
      (x) => x * scale
    ),
    to: [
      "Zenon Din Citium",
      "Platon",
      "Epicur",
      "Al-Kindi",
      "Al-Farabi",
      "Avicenna",
      "Anselm",
      "Abelard",
      "Averroes",
      "Maimonide",
      "Roger Bacon",
      "Toma d'Aquino",
      "William din Ockham",
      "Duns Scotus",
      "Machiavelli",
      "Suarez",
      "Hobbes",
      "Descartes",
      "Locke",
      "Montesquieu",
      "Hegel",
      "Mill",
      "Heidegger",
      "Feng",
      "Davidson",
      "Strawson",
      "Anscombe",
      "Wiggins",
    ],
    quote: "Experienta este sursa cunoasterii, iar logica este structura ei.",
    time: -384,
  });

  const updateCurrent = (cur) => {
    setCurrent(Find(cur, data));
  };

  const [visible, setVisible] = useState();

  const updateVisibility = (val) => {
    setVisible(val);
  };

  useEffect(() => {
    if (current.time < 480) {
      setEpoque("Antichitate");
    } else if (current.time < 1561) {
      setEpoque("Epoca Medivala");
    } else if (current.time < 1770) {
      setEpoque("Epoca Moderna Timpurie");
    } else if (current.time < 1859) {
      setEpoque("Secolul al XIX-lea");
    } else {
      setEpoque("Secolul al XX-lea");
    }
    if (order.indexOf(current.id) === 0) {
      setPrev(order[order.length - 1]);
    } else setPrev(order[order.indexOf(current.id) - 1]);
    if (order.indexOf(current.id) === order.length - 1) {
      setNext(order[0]);
    } else setNext(order[order.indexOf(current.id) + 1]);
  }, [current]);

  let centerx = 0;
  let centery = 0;
  let centerz = 0;
  let datalen = data.length;
  for (let i of data) {
    centerx += i.position[0];
    centery += i.position[1];
    centerz += i.position[2];
  }
  let centerN = new Vector3(
    centerx / datalen,
    centery / datalen,
    centerz / datalen
  );

  const search = (arg) => {
    if (arg === "") return;
    let aux = [];
    for (let i = 0; i < order.length; i++) {
      if (order[i].includes(arg) && aux.length < 6) {
        aux.push(order[i]);
      }
    }
    setSearchData(aux);
  };

  return (
    <div className="relative z-0">
      {visible ? (
        <Legend current={current} epoque={epoque} updateOpen={updateOpen} />
      ) : (
        ""
      )}
      <Drawer
        current={current}
        updateCurrent={updateCurrent}
        prev={prev}
        next={next}
        epoque={epoque}
        updateVisibility={updateVisibility}
        visible={visible}
      >
        <Main
          updateCurrent={updateCurrent}
          current={current}
          data={data}
          centerN={centerN}
        />
      </Drawer>

      {open ? (
        <div className="absolute z-[90] top-0 flex h-screen w-screen justify-center items-center backdrop-blur-md">
          <div className="flex flex-col" ref={searchRef}>
            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Type here"
                className="relative z-[91] input input-bordered input-secondary w-full max-w-xs"
                onChange={(e) => {
                  search(e.target.value);
                }}
              />
              <button className="btn bg-base-300  ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bdbdbd"
                  viewBox="0 0 30 30"
                  width="30px"
                  height="30px"
                >
                  <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
                </svg>
              </button>
            </div>
            <div className=" flex flex-col text-3xl">
              {searchData.map((x) => {
                return (
                  <div
                    onClick={() => {
                      setCurrent(Find(x, data));
                      updateOpen(false);
                    }}
                    className="rounded-xl bg-base-300 flex justify-center items-center mt-1"
                  >
                    {x}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

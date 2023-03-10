import Two from "two.js";
import { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import { data } from "../../pages/tree";

export default function TwoTimeLine({ pos }) {
  let two = new Two({
    autostart: true,
    fullscreen: false,
    height: window.innerHeight,
    width: window.innerWidth,
  });
  let group = two.makeGroup();

  const ratio = 0.74;
  const centerX = two.width / 2;
  const centerY = two.height / 2;
  const padding = 5;
  const offsetY = 0;
  const styles = {
    family: "proxima-nova, sans-serif",
    size: 20,
    leading: 50,
    weight: 900,
  };
  const styles2 = {
    family: "proxima-nova, sans-serif",
    size: 20,
    leading: 50,
    weight: 200,
  };

  const addCard = (src, type = 1, x, name) => {
    const texture = new Two.Texture(src, () => {
      const imageHeight = (texture.image.height = two.height / 4);
      const imageWidth = (two.height / 4) * ratio;
      let lin, shape, text;
      if (type === 1) {
        //connection
        lin = two
          .makeRectangle(x, centerY + centerY / 4, 10, two.height / 4)
          .noStroke();

        //img
        shape = two.makeRoundedRectangle(
          x,
          centerY + centerY / 2,
          imageWidth,
          imageHeight,
          10
        );
        shape.fill = texture;
        shape.stroke = "white";
        shape.linewidth = 10;

        text = two.makeText(
          name,
          x,
          centerY + centerY / 2 + imageHeight / 2 + 20,
          styles
        );
      } else {
        //connection
        lin = two
          .makeRectangle(x, centerY / 2 + centerY / 4, 10, two.height / 4)
          .noStroke();

        //img
        shape = two.makeRoundedRectangle(
          x,
          centerY / 2,
          imageWidth,
          imageHeight,
          10
        );

        shape.fill = texture;
        shape.stroke = "white";
        shape.linewidth = 10;

        text = two.makeText(
          name,
          x,
          centerY / 2 - imageHeight / 2 - 20,
          styles
        );
      }
      text.fill = "white";
      group.add(lin);
      group.add(shape);
      group.add(text);
      two.update();
      shape._renderer.elem.addEventListener(
        "click",
        () => {
          window.location.href = "http://localhost:3000/" + name;
        },
        false
      );
      two.update();
    });
  };

  let twoRef = useRef();
  useEffect(() => {
    two.appendTo(twoRef.current);
    two.update();

    for (let i = 500; i < 15000; i += 500) {
      let rect = two.makeRectangle(i, two.height / 2, 1, 100);
      let text = two.makeText(-700 + i / 10, i, centerY + 70, styles2);
      text.fill = "white";
      group.add(rect);
      group.add(text);
      rect.noStroke();
    }

    const timeline = two.makeRectangle(centerX, centerY, 15000, 10);
    group.add(timeline);

    timeline.fill = "#f4c821";
    timeline.noStroke();
    timeline.translation.x += 15000 / 2 - two.width / 2 + 10;

    const leftBound = -two.width / 2;
    const rightBound = two.width / 2;
    const topBound = -two.height / 2;
    const bottomBound = two.height / 2;
    console.log(pos);
    twoRef.current.dest = pos ? pos : 0;

    let cnt = 1;
    //Here
    data.map((person) => {
      console.log(cnt);
      addCard(
        "/philosopher" + person.image,
        cnt % 2,
        person.time < 0
          ? 7000 + (person.time / 50) * 500
          : 7000 + (person.time / 50) * 500,
        person.id
      );
      cnt++;
    });

    two
      .bind("update", (frameCount) => {
        group.translation.x = MathUtils.lerp(
          group.translation.x,
          twoRef.current.dest,
          0.05
        );
      })
      .play();

    two.update();
  }, []);

  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e) => {
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) {
      return;
    }
    let dx = (e.clientX - centerX) / 40;
    twoRef.current.dest += dx;
  };

  const handleMouseUp = (e) => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div className="z-0 relative flex justify-center items-center  h-screen w-screen">
      <div className="fixed z-50 ">
        <div className="mt-96">
          <button
            className="btn"
            onClick={() => {
              if (twoRef.current.dest < 0) twoRef.current.dest += 100;
            }}
          >
            prev
          </button>
          <button
            className="btn ml-2"
            onClick={() => {
              twoRef.current.dest -= 100;
            }}
          >
            next
          </button>
        </div>
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="relative z-40"
        ref={twoRef}
      ></div>
    </div>
  );
}

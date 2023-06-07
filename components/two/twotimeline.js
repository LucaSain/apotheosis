import Two from "two.js";
import { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import { data } from "../../utils/data";

export default function TwoTimeLine({ pos }) {
  let twoRef = useRef();
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
          window.location.href = "https://apotheosis-sandy.vercel.app/" + name;
        },
        false
      );
      shape._renderer.elem.addEventListener(
        "touch",
        () => {
          window.location.href = "https://apotheosis-sandy.vercel.app/" + name;
        },
        false
      );
      two.update();
    });
  };

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

    timeline.fill = "#f4c821";
    timeline.noStroke();
    timeline.translation.x += 15000 / 2 - two.width / 2;

    for (let i = 500; i < 30000; i += 500) {
      let rect = two.makeRectangle(
        i + 15000 - two.width / 2,
        two.height / 2,
        1,
        100
      );
      let text = two.makeText(
        750 + i / 10 > 1550 ? i / 50 + 1100 + 300 - 10 : 750 + i / 10,
        i + 15000 - two.width / 2,
        centerY + 70,
        styles2
      );
      text.fill = "white";
      group.add(rect);
      group.add(text);
      rect.noStroke();
    }

    const leftBound = -two.width / 2;
    const rightBound = two.width / 2;
    const topBound = -two.height / 2;
    const bottomBound = two.height / 2;

    twoRef.current.dest = pos
      ? pos <= 1550
        ? -(7000 + pos * 10)
        : -(-55000 + pos * 50)
      : 0;

    twoRef.current.dest -= -720;

    let cnt = 1;
    //Here
    data.map((person) => {
      addCard(
        "/philosopher" + person.image,
        cnt % 2,
        person.time <= 1550
          ? 7000 + person.time * 10
          : -55000 + person.time * 50, //1550 - 400 + i / 20
        person.id
      );
      cnt++;
    });

    two.update();

    two
      .bind("update", (frameCount) => {
        if (twoRef.current)
          group.translation.x = MathUtils.lerp(
            group.translation.x,
            twoRef.current.dest,
            0.05
          );
      })
      .play();

    two.update();
  }, []);
  const [cnt, setCnt] = useState(100);

  return (
    <div className="z-0 relative flex justify-center items-center  h-screen w-screen">
      <div className="relative z-40" ref={twoRef}></div>
      <div className="fixed z-50 ">
        <div className="mt-96 flex flex-col">
          <div className="flex justify-center items-center">
            <button
              className="btn"
              onClick={() => {
                if (twoRef.current.dest < 0) twoRef.current.dest += cnt;
              }}
            >
              prev
            </button>
            <button
              className="btn ml-2"
              onClick={() => {
                twoRef.current.dest -= cnt;
              }}
            >
              next
            </button>
          </div>
          <div>
            <input
              type="range"
              min="-700"
              max="1930"
              className="range mt-2 w-96"
              onChange={(e) => {
                twoRef.current.dest = e.target.value
                  ? e.target.value <= 1550
                    ? -(7000 + e.target.value * 10)
                    : -(-55000 + e.target.value * 50)
                  : 0;

                twoRef.current.dest -= -720;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

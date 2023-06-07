import Two from "two.js";
import { useEffect, useRef } from "react";

export default function TwoWrapper() {
  let two = new Two({
    autostart: true,
    fullscreen: false,
    height: window.innerHeight,
    width: window.innerWidth,
  });
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  let twoRef = useRef();
  useEffect(() => {
    two.appendTo(twoRef.current);
    two.update();

    const margin = 2;

    const stars = [];

    const numberOfStars = 200;

    const leftBound = -two.width / 2 + margin;
    const rightBound = two.width / 2 - margin;
    const topBound = -two.height / 2 + margin;
    const bottomBound = two.height / 2 - margin;

    for (let i = 0; i < numberOfStars; i++) {
      stars.push(
        two.makeCircle(
          getRandomArbitrary(leftBound, rightBound),
          getRandomArbitrary(leftBound, rightBound),
          //getRandomArbitrary(topBound, bottomBound),
          getRandomArbitrary(1.5, 3.3)
        )
      );
    }

    stars.forEach((star) => {
      star.fill = "#f4c821";
      star.stroke = "#f93b01";
      star.linewidth = 2;
      star.speed = getRandomArbitrary(0.5, 5.3);
    });

    const group = two.makeGroup(...stars);

    group.translation.set(two.width / 2, two.height / 2);
    let def_angle = 0.001;

    two.bind("update", (frameCount) => {
      stars.forEach((star) => {
        const x1 = star.translation.x;
        const y1 = star.translation.y;
        let angle = def_angle * star.speed;
        star.translation.x = x1 * Math.cos(angle) - y1 * Math.sin(angle); // + star.speed;
        star.translation.y = x1 * Math.sin(angle) + y1 * Math.cos(angle); // + star.speed;

      });
    });
  }, []);

  return <div ref={twoRef}></div>;
}

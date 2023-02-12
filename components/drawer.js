import { data } from "autoprefixer";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Drawer({
  children,
  current,
  updateCurrent,
  updateVisibility,
  next,
  prev,
  epoque,
  visible,
}) {
  const [open, setOpen] = useState(false);
  const checkbox = useRef();
  useEffect(() => {
    setOpen(true);
    checkbox.current.checked = true;
    updateVisibility(false);
  }, [current]);

  return (
    <div className="drawer">
      <input
        ref={checkbox}
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => {
          updateVisibility(!e.target.checked);
        }}
      />
      <div className="drawer-content">
        {children}
        <label
          htmlFor="my-drawer"
          className="top-4 left-2 absolute btn bg-base-300 drawer-button rounded-full "
        >
          <img className="h-10 hover:overlay" src="/apotheosis.png" />
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 bg-base-100 text-base-content h-full flex flex-col ">
          {visible === false ? (
            <div
              onClick={() => {
                updateVisibility(true);
                checkbox.current.checked = false;
              }}
              className="sm:invisible w-12 h-4 absolute btn rounded-full z-[9999] top-2 right-2"
            >
              x
            </div>
          ) : (
            ""
          )}
          <div className="flex-initial h-max w-full">
            <div className="w-full flex flex-row items-center h-full justify-center ">
              <h1 className="text-3xl h-24 flex-1 w-full">{current.id}</h1>

              <div className="h-20 mask mask-squircle flex items-center w-24">
                <img src={"/philosopher" + current.image} />
              </div>
            </div>
          </div>
          <div className="divider"></div>

          <div className="italic text-base">{current.quote}</div>
          <div className="divider"></div>
          <div>
            {current.to && current.to[0] ? (
              <h1 className="text-3xl">A influențat pe:</h1>
            ) : (
              ""
            )}

            <div className="overflow-y-scroll max-h-40">
              {current.to
                ? current.to.map((influence) => {
                    return <p key={influence + "s"}>{influence}</p>;
                  })
                : ""}
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="divider"></div>
          <div className="flex-none">
            <div className="flex-col w-full justify-start items-start">
              <h1 className="text-3xl">În timp: {epoque}</h1>
              <br />
              <div className="w-full">
                <a href={"/timeline?pos=" + current.time}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={
                      epoque === "Antichitate"
                        ? 10
                        : epoque === "Epoca Medivala"
                        ? 25
                        : epoque === "Epoca Moderna Timpurie"
                        ? 50
                        : epoque === "Secolul al XIX-lea"
                        ? 75
                        : 90
                    }
                    className="range"
                    readOnly
                  />
                </a>
                <div className="w-full flex justify-between text-xs px-2">
                  <span>
                    |
                    {epoque === "Antichitate"
                      ? current.time < 0
                        ? current.time * -1 + " î.Hr"
                        : current.time
                      : ""}
                  </span>
                  <span>
                    |{epoque === "Epoca Medivala" ? current.time : ""}
                  </span>
                  <span>
                    |{epoque === "Epoca Moderna Timpurie" ? current.time : ""}
                  </span>
                  <span>
                    |{epoque === "Secolul al XIX-lea" ? current.time : ""}
                  </span>
                  <span>
                    |{epoque === "Secolul al XX-lea" ? current.time : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row mt-10 w-full justify-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  updateCurrent(prev);
                }}
              >
                Prev
              </button>
              <Link href={current.id}>
                <button className="btn btn-secondary">Mai mult</button>
              </Link>
              <button
                onClick={() => {
                  updateCurrent(next);
                }}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

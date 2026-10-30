import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { data } from "../utils/data";
import { asset } from "../utils/asset";

// Piecewise time scale: [start year, px per year]. Dense periods get more room.
const SEGMENTS = [
  [-700, 2.2, 100],
  [0, 1.4, 100],
  [1000, 3, 50],
  [1550, 9, 25],
  [1800, 20, 10],
  [1900, 34, 10],
  [1970, 0, 0],
];
const MIN_YEAR = SEGMENTS[0][0];
const MAX_YEAR = SEGMENTS[SEGMENTS.length - 1][0];

const ERAS = [
  { name: "Antichitate", from: MIN_YEAR, to: 480 },
  { name: "Epoca Medievală", from: 480, to: 1561 },
  { name: "Epoca Modernă Timpurie", from: 1561, to: 1770 },
  { name: "Secolul al XIX-lea", from: 1770, to: 1859 },
  { name: "Secolul al XX-lea", from: 1859, to: MAX_YEAR },
];

const CARD_W = 104;
const CARD_H = 100;
const CARD_GAP = 10;
const LANES = 4; // up, down, up (outer), down (outer)

function yearToX(year) {
  let px = 0;
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    const [from, rate] = SEGMENTS[i];
    const to = SEGMENTS[i + 1][0];
    if (year <= to) return px + (Math.max(year, from) - from) * rate;
    px += (to - from) * rate;
  }
  return px;
}

function xToYear(x) {
  let px = 0;
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    const [from, rate] = SEGMENTS[i];
    const to = SEGMENTS[i + 1][0];
    const len = (to - from) * rate;
    if (x <= px + len) return from + (x - px) / rate;
    px += len;
  }
  return MAX_YEAR;
}

const TOTAL_W = yearToX(MAX_YEAR);

export const formatYear = (year) =>
  year < 0 ? `${-Math.round(year)} î.Hr.` : `${Math.round(year)}`;

const eraOf = (year) =>
  ERAS.find((e) => year < e.to) || ERAS[ERAS.length - 1];

// Sort by time and greedily assign each philosopher to the first lane with
// room, so cards never overlap. If every lane is full the card is nudged right.
function layout() {
  const ends = Array(LANES).fill(-Infinity);
  return [...data]
    .sort((a, b) => a.time - b.time)
    .map((p) => {
      const x = yearToX(p.time);
      let lane = ends.findIndex((end) => end + CARD_GAP <= x - CARD_W / 2);
      let cx = x;
      if (lane === -1) {
        lane = ends.indexOf(Math.min(...ends));
        cx = ends[lane] + CARD_GAP + CARD_W / 2;
      }
      ends[lane] = cx + CARD_W / 2;
      return { ...p, x, cx, lane };
    });
}

function ticks() {
  const out = [];
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    const [from, , step] = SEGMENTS[i];
    const to = SEGMENTS[i + 1][0];
    for (let y = Math.ceil(from / step) * step; y < to; y += step) out.push(y);
  }
  return out;
}

export default function Timeline({ pos }) {
  const scrollRef = useRef();
  const drag = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 700, measured: false });
  const [center, setCenter] = useState(MIN_YEAR);
  const [selected, setSelected] = useState(null);

  const people = useMemo(layout, []);
  const yearTicks = useMemo(ticks, []);
  const byId = useMemo(
    () => Object.fromEntries(people.map((p) => [p.id, p])),
    [people]
  );

  const pad = size.w / 2;
  const axisY = size.h / 2;
  const inner = 36;
  const outer = Math.max(
    inner + 40,
    Math.min(inner + CARD_H + 22, axisY - CARD_H - 12)
  );
  const laneOffset = (lane) => {
    const side = lane % 2 === 0 ? -1 : 1;
    const dist = lane < 2 ? inner : outer;
    return { side, dist };
  };

  const scrollToYear = useCallback(
    (year, smooth = true) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({
        left: yearToX(year) + pad - el.clientWidth / 2,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [pad]
  );

  const select = useCallback(
    (person) => {
      setSelected(person ? person.id : null);
      if (person) scrollToYear(person.time);
    },
    [scrollToYear]
  );

  // Track container size so the layout fits any viewport.
  useEffect(() => {
    const el = scrollRef.current;
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight, measured: true })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Initial position: ?pos=<year> or the first philosopher.
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current || !size.measured) return;
    initialised.current = true;
    const year = Number(pos);
    scrollToYear(
      Number.isFinite(year) && pos !== undefined ? year : people[0].time + 150,
      false
    );
  }, [pos, size.measured, scrollToYear, people]);

  // Vertical wheel scrolls horizontally.
  useEffect(() => {
    const el = scrollRef.current;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const neighbour = useCallback(
    (dir) => {
      const ref = selected ? byId[selected].time : center;
      const list = dir > 0 ? people : [...people].reverse();
      const idx = selected ? list.findIndex((p) => p.id === selected) : -1;
      return idx >= 0
        ? list[idx + 1]
        : list.find((p) => (dir > 0 ? p.time > ref : p.time < ref));
    },
    [selected, center, people, byId]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const p = neighbour(e.key === "ArrowRight" ? 1 : -1);
        if (p) select(p);
      } else if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [neighbour, select]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const x = el.scrollLeft + el.clientWidth / 2 - pad;
    setCenter(xToYear(Math.min(Math.max(x, 0), TOTAL_W)));
  };

  // Click-and-drag panning (mouse only; touch already scrolls natively).
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = {
      x: e.clientX,
      left: scrollRef.current.scrollLeft,
      moved: false,
    };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    if (d.moved) scrollRef.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const wasDrag = () => drag.current && drag.current.moved;

  const current = selected ? byId[selected] : null;
  const influenced = new Set(current ? current.to : []);
  const influencedBy = current
    ? people.filter((p) => p.to.includes(current.id)).map((p) => p.id)
    : [];
  const related = new Set([...influenced, ...influencedBy]);
  const activeEra = eraOf(center);

  return (
    <div className="fixed inset-0 top-16 flex flex-col bg-base-100 select-none">
      {/* Era navigation */}
      <div className="flex-none flex items-center gap-2 px-3 py-2 overflow-x-auto bg-base-300/60 border-b border-base-300">
        {ERAS.map((era) => (
          <button
            key={era.name}
            className={
              "btn btn-sm whitespace-nowrap normal-case " +
              (era === activeEra ? "btn-secondary" : "btn-ghost")
            }
            onClick={() => scrollToYear(Math.max(era.from, people[0].time) + 20)}
          >
            {era.name}
          </button>
        ))}
        <div className="flex-1" />
        <div className="font-mono text-secondary text-lg whitespace-nowrap px-2">
          {formatYear(center)}
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClick={() => !wasDrag() && setSelected(null)}
        className="relative flex-1 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="relative h-full"
          style={{ width: TOTAL_W + 2 * pad }}
        >
          {/* Era bands */}
          {ERAS.map((era, i) => (
            <div
              key={era.name}
              className={
                "absolute top-0 bottom-0 border-l border-base-content/10 " +
                (i % 2 ? "bg-base-content/[0.03]" : "")
              }
              style={{
                left: pad + yearToX(era.from),
                width: yearToX(era.to) - yearToX(era.from),
              }}
            >
              <div className="sticky left-0 inline-block px-4 pt-3 text-xs uppercase tracking-widest text-base-content/40">
                {era.name}
              </div>
            </div>
          ))}

          {/* Axis, ticks and stems */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={TOTAL_W + 2 * pad}
            height={size.h}
          >
            <defs>
              <linearGradient id="axis" x1="0" x2="1">
                <stop offset="0%" stopColor="#f4c821" />
                <stop offset="100%" stopColor="#f93b01" />
              </linearGradient>
            </defs>
            <rect
              x={pad}
              y={axisY - 2}
              width={TOTAL_W}
              height={4}
              rx={2}
              fill="url(#axis)"
            />
            {yearTicks.map((y) => (
              <g key={y} transform={`translate(${pad + yearToX(y)},${axisY})`}>
                <line y1={-6} y2={6} stroke="#f4c821" strokeOpacity={0.5} />
              </g>
            ))}
            {people.map((p) => {
              const { side, dist } = laneOffset(p.lane);
              const dim = current && p.id !== current.id && !related.has(p.id);
              return (
                <g key={p.id} opacity={dim ? 0.15 : 1}>
                  <line
                    x1={pad + p.x}
                    y1={axisY}
                    x2={pad + p.cx}
                    y2={axisY + side * dist}
                    stroke={
                      current && p.id === current.id
                        ? "#f4c821"
                        : related.has(p.id)
                          ? "#f93b01"
                          : "rgba(255,255,255,0.35)"
                    }
                    strokeWidth={current && p.id === current.id ? 2 : 1}
                  />
                  <circle
                    cx={pad + p.x}
                    cy={axisY}
                    r={4}
                    fill="#1c1917"
                    stroke="#f4c821"
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </svg>

          {/* Year labels (DOM so they use the page font) */}
          {yearTicks.map((y) => (
            <div
              key={y}
              className="absolute -translate-x-1/2 text-[11px] font-mono text-base-content/40 pointer-events-none"
              style={{ left: pad + yearToX(y), top: axisY + 8 }}
            >
              {formatYear(y)}
            </div>
          ))}

          {/* Philosopher cards */}
          {people.map((p) => {
            const { side, dist } = laneOffset(p.lane);
            const isCurrent = current && p.id === current.id;
            const isRelated = related.has(p.id);
            const dim = current && !isCurrent && !isRelated;
            return (
              <button
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!wasDrag()) select(isCurrent ? null : p);
                }}
                title={`${p.id} · ${formatYear(p.time)}`}
                className={
                  "group absolute flex flex-col items-center gap-1 transition-all duration-300 " +
                  (dim ? "opacity-25 " : "") +
                  (isCurrent ? "z-20 " : "z-10 hover:z-20 ")
                }
                style={{
                  left: pad + p.cx - CARD_W / 2,
                  top: side < 0 ? axisY - dist - CARD_H : axisY + dist,
                  width: CARD_W,
                  height: CARD_H,
                  flexDirection: side < 0 ? "column" : "column-reverse",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  className={
                    "text-xs leading-tight text-center font-semibold max-h-[2.5em] overflow-hidden " +
                    (isCurrent ? "text-secondary" : "text-base-content")
                  }
                >
                  {p.id}
                </span>
                <img
                  src={asset("/philosopher" + p.image)}
                  alt={p.id}
                  draggable={false}
                  loading="lazy"
                  className={
                    "h-16 w-16 rounded-full object-cover bg-base-300 border-2 transition-transform duration-200 group-hover:scale-110 " +
                    (isCurrent
                      ? "border-secondary scale-110 shadow-[0_0_24px_#f4c82166]"
                      : isRelated
                        ? "border-accent"
                        : "border-base-content/30 group-hover:border-secondary")
                  }
                />
              </button>
            );
          })}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none fixed left-0 top-16 bottom-0 w-12 bg-gradient-to-r from-base-100 to-transparent" />
        <div className="pointer-events-none fixed right-0 top-16 bottom-0 w-12 bg-gradient-to-l from-base-100 to-transparent" />
      </div>

      {/* Controls */}
      <div className="flex-none flex items-center gap-3 px-3 py-3 bg-base-300/60 border-t border-base-300">
        <button
          className="btn btn-sm btn-circle"
          aria-label="Anterior"
          onClick={() => {
            const p = neighbour(-1);
            if (p) select(p);
          }}
        >
          ‹
        </button>
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={Math.round(center)}
          onChange={(e) => scrollToYear(Number(e.target.value), false)}
          className="range range-secondary range-xs flex-1"
          aria-label="An"
        />
        <button
          className="btn btn-sm btn-circle"
          aria-label="Următor"
          onClick={() => {
            const p = neighbour(1);
            if (p) select(p);
          }}
        >
          ›
        </button>
      </div>

      {/* Detail panel */}
      {current && (
        <div
          className={
            "fixed z-40 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-secondary/40 bg-base-300/95 backdrop-blur shadow-2xl p-4 " +
            // keep the panel on the opposite side of the axis from the card
            (laneOffset(current.lane).side > 0 ? "top-32" : "bottom-20")
          }
        >
          <div className="flex gap-4">
            <img
              src={asset("/philosopher" + current.image)}
              alt={current.id}
              className="h-20 w-20 flex-none rounded-full object-cover border-2 border-secondary"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-secondary">
                    {current.id}
                  </h2>
                  <div className="text-sm text-base-content/60">
                    {formatYear(current.time)} · {eraOf(current.time).name}
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-xs btn-circle"
                  aria-label="Închide"
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </div>
              {current.quote && (
                <p className="mt-2 text-sm italic text-base-content/80 max-h-24 overflow-y-auto">
                  „{current.quote}”
                </p>
              )}
            </div>
          </div>
          {[
            ["A influențat", current.to],
            ["Influențat de", influencedBy],
          ].map(([label, list]) =>
            list.length ? (
              <div key={label} className="mt-3">
                <div className="text-xs uppercase tracking-wider text-base-content/50 mb-1">
                  {label}
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {list
                    .filter((id) => byId[id])
                    .map((id) => (
                      <button
                        key={id}
                        className="badge badge-outline hover:badge-accent cursor-pointer"
                        onClick={() => select(byId[id])}
                      >
                        {id}
                      </button>
                    ))}
                </div>
              </div>
            ) : null
          )}
          <div className="mt-4 flex justify-end">
            <Link
              href={{ pathname: "/tree", query: { id: current.id } }}
              className="btn btn-secondary btn-sm"
            >
              Vezi în mindmap
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

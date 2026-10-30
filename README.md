# Apotheosis

## About

A 3D mindmap showcasing the relations between philosophers, plus an interactive timeline.

Currently only in Romanian.

## Navigate to:
	/tree for the 3D mindmap (/tree?id=<philosopher> to focus one).
	/timeline for the timeline (/timeline?pos=<year> to jump to a year).

## Built with:

+ FE: React and Next (static export)
+ UI: Tailwindcss and DaisyUI.
+ 2D Graphics (homescreen): Two.JS
+ 3D: ThreeJS, React-Three-Fiber and React-Three-Drei.

All data lives in `utils/data.js`; no backend or env vars are needed.

## Development

    npm install
    npm run dev

## Deployment

Pushes to `static` are built with `next build` (static export to `out/`) and
deployed to GitHub Pages by `.github/workflows/deploy.yml`. The workflow sets
`NEXT_PUBLIC_BASE_PATH` so the site works under `/<repo>/`.

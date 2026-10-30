// Prefix files from /public with the basePath (needed on GitHub Pages,
// where the site is served from /<repo>/). next/link handles this itself.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (path) => basePath + path;

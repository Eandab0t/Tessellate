# Tessellate

Tessellate is a browser-based tool for designing seamless repeating patterns. Arrange built-in motifs or upload your own images, tune the layout, and export a tile as SVG or PNG.

## Run locally

**Requirements:** Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Pattern generation runs entirely in your browser; no API key or server is required.

## Create a pattern

1. Keep the starter motifs, add presets, or upload SVG, PNG, JPEG, WebP, or GIF files (up to 8 MB each).
2. Choose a grid, organic scatter, or sequence layout and adjust its size, spacing, color, and randomness.
3. Preview the tile and its repeats, then export a single SVG tile, a multi-tile SVG, a PNG, or the settings as JSON.

The seed makes generated layouts reproducible. Uploaded images are processed locally in your browser.

## Development

```sh
npm run lint
npm run build
npm run preview
```

# Tessellate

Tessellate is a browser-based pattern studio for turning small illustrations, icons, and other motifs into seamless repeating designs. Start with the included motifs or upload your own artwork, arrange it into a tile, and adjust the result while viewing how it repeats. Export the finished tile for use as a website background, in a design project, or anywhere you need a repeating pattern.

## What you can do

- **Build a motif library:** Start with the included sparkle, flower, and leaf motifs, add more presets, or upload SVG, PNG, JPEG, WebP, and GIF files (up to 8 MB each).
- **Choose a layout style:** Make a regular grid, scatter motifs organically, or cycle through your assets in a sequence. Grid variations include half-drop, half-slide, diagonal, and alternating-flip layouts.
- **Tune the composition:** Set tile dimensions and aspect ratio, motif density and spacing, background color, and motif scale, rotation, and opacity. Use fixed values or vary them across the pattern; grid jitter and alignment controls help refine structured layouts.
- **Make the edges repeat:** Motifs that cross a tile boundary are wrapped to the opposite edge, including corners, so the exported tile can repeat without gaps at its seams.
- **Preview before exporting:** Inspect a single tile or a 2×2, 3×3, or 4×4 repeat, and zoom in or out to check the overall composition.
- **Export your work:** Download a single-tile SVG, a repeated-grid SVG, a high-resolution PNG tile, or a JSON file containing the current settings.

The pattern seed makes generated layouts reproducible: keep the same seed and settings to get the same arrangement. The app runs entirely in your browser; uploaded images stay on your device and are embedded in the export. No account, API key, or server is required.

## Run locally

**Requirements:** Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite to use the studio.

## Development

```sh
npm run lint
npm run build
npm run preview
```

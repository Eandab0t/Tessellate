<div align="center">

# Tessellate

### Make seamless patterns. Keep it simple.

Choose motifs, tune the look, preview the repeat, and export a tile — all in your browser.

[**⬇ Download Tessellate**](./package/Tessellate.html)

**That’s the whole app:** download the single HTML file above and open it in a modern browser.
No installer, server, or internet connection required.

</div>

---

## Create a pattern

1. **Pick motifs** — use the built-in artwork or add your own SVG, PNG, JPG, WebP, or GIF images
   (up to 8 MB each).
2. **Make it yours** — choose a preset or adjust the layout, tile size, and motif appearance.
3. **Check the repeat** — preview the pattern before exporting.
4. **Take it with you** — export a seamless SVG tile, a repeated SVG, or a PNG.

Settings can also be saved to or loaded from JSON. Your uploaded images stay in your browser and
are embedded in exports.

## Build from source

Requires Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To regenerate `package/Tessellate.html`:

```sh
npm run build
```

Run `npm run lint` for a TypeScript check.

# Tessellate

**Tessellate** is a single-file, offline pattern studio. Turn motifs into seamless repeating tiles — export SVG or PNG, no install, no server, no internet required.

Double-click **`Tessellate.html`** and start designing.

## Get it

**[Download `Tessellate.html` (282 KB, standalone)](https://github.com/Eandab0t/Tessellate/raw/main/package/Tessellate.html)**

Save it anywhere — a USB stick, your desktop, a network drive — and open it in any modern browser. Everything runs client-side; uploaded images never leave your machine.

## What it does

| | |
|---|---|
| **Motif library** | 8 built-in motifs, plus drag-and-drop or browse uploads (SVG · PNG · JPG · WebP · GIF, up to 25 MB each). Large icons auto-scale to 512 px. |
| **Layouts** | Grid, scatter, and cycle modes. Grid variations: align, half-drop, half-slide, diagonal, alternating flip. |
| **Variation** | Scale, rotation, opacity — fixed or randomly ranged. Density, stagger offset, slack/jitter, collision avoidance, seamless edge wrap. |
| **Canvas** | Tile sizes up to 3840×3840, locked aspect ratios (1:1, 16:9, 4:3, 3:2, 2:1), background colour, tile boundary overlay, reproducible seeds. |
| **Preview** | Scrollable dotted studio, 1×1 → 4×4 repeat, 25% → 300% zoom, live bounds readout. |
| **Export** | Single SVG tile, repeated-grid SVG, high-resolution PNG (2.5× scale), settings as JSON — and load JSON back in to resume. |

## Dark card design

The UI is built around the **EanTessellate brand** — black studio, bright red accents, card-based panels, dotted-grid canvas. Inspired by modern host-control panels.

## Build it yourself

```sh
git clone https://github.com/Eandab0t/Tessellate.git
cd Tessellate
npm install
npm run build   # -> package/Tessellate.html (single self-contained file)
npm run lint    # TypeScript check
```

The pattern engine lives in `src/utils/patternMath.ts`; everything else was rebuilt around it.

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<p align="center"><b>Tessellate</b> · seamless patterns, offline</p>

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatternAsset, PatternSettings, PlacedInstance } from '../types';

export function createPrng(seed: number) {
  let h = seed;
  return function () {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

function circlesOverlap(
  x1: number, y1: number, r1: number,
  x2: number, y2: number, r2: number,
  spacingFactor: number = 1.0
): boolean {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distSq = dx * dx + dy * dy;
  const minDist = (r1 + r2) * spacingFactor;
  return distSq < minDist * minDist;
}

const CLONE_SHIFTS = [
  { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
  { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
  { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
  { dx: -1, dy: 1 }, { dx: 1, dy: 1 },
];

export function generateClonesForInstance(
  instance: PlacedInstance,
  asset: PatternAsset,
  tileWidth: number,
  tileHeight: number
): PlacedInstance[] {
  const clones: PlacedInstance[] = [];
  const radius = Math.max(asset.width, asset.height) * 0.5 * instance.scale;

  for (const s of CLONE_SHIFTS) {
    const cx = instance.x + s.dx * tileWidth;
    const cy = instance.y + s.dy * tileHeight;

    const closestX = Math.max(0, Math.min(cx, tileWidth));
    const closestY = Math.max(0, Math.min(cy, tileHeight));
    const distX = cx - closestX;
    const distY = cy - closestY;

    if (distX * distX + distY * distY < radius * radius) {
      clones.push({
        id: `${instance.id}-c-${s.dx}-${s.dy}`,
        assetId: instance.assetId,
        x: cx,
        y: cy,
        scale: instance.scale,
        rotation: instance.rotation,
        opacity: instance.opacity,
        isClone: true,
        parentInstanceId: instance.id,
        offsetX: s.dx * tileWidth,
        offsetY: s.dy * tileHeight,
      });
    }
  }
  return clones;
}

function applyGridOffset(
  gridType: string,
  col: number,
  row: number,
  cellW: number,
  cellH: number,
  offsetPct: number
): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;
  if (gridType === 'half_drop' && col % 2 === 1) {
    dy = (offsetPct / 100) * cellH;
  } else if (gridType === 'half_slide' && row % 2 === 1) {
    dx = (offsetPct / 100) * cellW;
  } else if (gridType === 'diagonal') {
    if (row % 2 === 1) dx += 0.5 * cellW;
    if (col % 2 === 1) dy += 0.5 * cellH;
  } else if (gridType === 'alternate_flip') {
    if (row % 2 === 1) dx += 0.5 * cellW;
  }
  return { dx, dy };
}

function applyJitter(prng: () => number, jitterPct: number, cellW: number, cellH: number): { jx: number; jy: number } {
  if (jitterPct <= 0) return { jx: 0, jy: 0 };
  const maxJitX = cellW * 0.45 * (jitterPct / 100);
  const maxJitY = cellH * 0.45 * (jitterPct / 100);
  return {
    jx: (prng() * 2 - 1) * maxJitX,
    jy: (prng() * 2 - 1) * maxJitY,
  };
}

function wrap(val: number, max: number): number {
  return ((val % max) + max) % max;
}

export function calculatePatternLayout(
  assets: PatternAsset[],
  settings: PatternSettings
): PlacedInstance[] {
  if (assets.length === 0) return [];

  const prng = createPrng(settings.seed);
  const primaryInstances: PlacedInstance[] = [];

  // Build asset map for O(1) lookups
  const assetMap = new Map<string, PatternAsset>();
  for (const a of assets) assetMap.set(a.id, a);

  const getScale = () =>
    settings.scaleMode === 'fixed'
      ? settings.fixedScale
      : settings.minScale + prng() * (settings.maxScale - settings.minScale);

  const getRotation = () =>
    settings.rotationMode === 'fixed'
      ? settings.fixedRotation
      : settings.minRotation + prng() * (settings.maxRotation - settings.minRotation);

  const getOpacity = () =>
    settings.opacityMode === 'fixed'
      ? settings.fixedOpacity
      : settings.minOpacity + prng() * (settings.maxOpacity - settings.minOpacity);

  // Shared helpers for grid-based placement
  const placeInGrid = (
    cols: number,
    rows: number,
    assetCount: number,
    pickAsset: (r: number, c: number, idx: number) => number
  ) => {
    const cellW = settings.tileWidth / cols;
    const cellH = settings.tileHeight / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const assetIndex = pickAsset(r, c, idx);
        const asset = assets[assetIndex];
        if (!asset) continue;

        let cx = (c + 0.5) * cellW;
        let cy = (r + 0.5) * cellH;

        const off = applyGridOffset(settings.gridType, c, r, cellW, cellH, settings.gridOffset);
        cx += off.dx;
        cy += off.dy;

        const jit = applyJitter(prng, settings.gridJitter, cellW, cellH);
        cx = wrap(cx + jit.jx, settings.tileWidth);
        cy = wrap(cy + jit.jy, settings.tileHeight);

        let rotation = getRotation();
        const flipOn = settings.gridFlipAlternating || settings.gridType === 'alternate_flip';
        if (flipOn && (r + c) % 2 === 1) {
          rotation = (rotation + 180) % 360;
        }

        primaryInstances.push({
          id: `inst-${r}-${c}`,
          assetId: asset.id,
          x: cx,
          y: cy,
          scale: getScale(),
          rotation,
          opacity: getOpacity(),
          isClone: false,
        });
      }
    }
  };

  if (settings.mode === 'grid' || settings.mode === 'sequence') {
    const cols = settings.gridCols;
    const rows = settings.gridRows;

    placeInGrid(cols, rows, assets.length, (r, c, idx) => {
      if (settings.mode === 'sequence') {
        return idx % assets.length;
      }
      return Math.floor(prng() * assets.length);
    });
  } else {
    // Organic mode: stratified placement for even coverage
    const baseCount = 20;
    const count = Math.max(5, Math.round(baseCount * settings.density));

    // Instead of pure random, use grid stratification
    const gridDim = Math.ceil(Math.sqrt(count));
    const cellW = settings.tileWidth / gridDim;
    const cellH = settings.tileHeight / gridDim;

    for (let i = 0; i < count; i++) {
      const assetIndex = Math.floor(prng() * assets.length);
      const asset = assets[assetIndex];
      if (!asset) continue;

      const scale = getScale();
      let rotation = getRotation();
      const opacity = getOpacity();

      let x: number;
      let y: number;

      if (settings.positioning === 'grid_snap') {
        const snapCols = Math.max(3, settings.gridCols);
        const snapRows = Math.max(3, settings.gridRows);
        const sc = settings.tileWidth / snapCols;
        const sh = settings.tileHeight / snapRows;
        const colX = i % snapCols;
        const rowY = Math.floor(i / snapCols) % snapRows;

        let cx = (colX + 0.5) * sc;
        let cy = (rowY + 0.5) * sh;

        const off = applyGridOffset(settings.gridType, colX, rowY, sc, sh, settings.gridOffset);
        cx += off.dx;
        cy += off.dy;

        const jit = settings.gridJitter > 0
          ? applyJitter(prng, settings.gridJitter, sc, sh)
          : { jx: (prng() - 0.5) * 8, jy: (prng() - 0.5) * 8 };

        x = wrap(cx + jit.jx, settings.tileWidth);
        y = wrap(cy + jit.jy, settings.tileHeight);
      } else {
        // Stratified: place within a grid cell for even distribution
        const cellIndex = i % (gridDim * gridDim);
        const gx = cellIndex % gridDim;
        const gy = Math.floor(cellIndex / gridDim);

        x = wrap((gx + prng()) * cellW, settings.tileWidth);
        y = wrap((gy + prng()) * cellH, settings.tileHeight);
      }

      primaryInstances.push({
        id: `inst-org-${i}`,
        assetId: asset.id,
        x,
        y,
        scale,
        rotation,
        opacity,
        isClone: false,
      });
    }

    // Toroidal collision relaxation (lighter: 25 iter, early exit on stasis)
    if (settings.collisionAvoidance && primaryInstances.length > 1) {
      const maxIter = 25;
      for (let step = 0; step < maxIter; step++) {
        const forces = new Float64Array(primaryInstances.length * 2);
        let maxMovement = 0;

        for (let i = 0; i < primaryInstances.length; i++) {
          const instA = primaryInstances[i];
          const assetA = assetMap.get(instA.assetId);
          if (!assetA) continue;

          const rA = Math.max(assetA.width, assetA.height) * 0.5 * instA.scale;
          const i2 = i * 2;

          for (let j = i + 1; j < primaryInstances.length; j++) {
            const instB = primaryInstances[j];
            const assetB = assetMap.get(instB.assetId);
            if (!assetB) continue;

            const rB = Math.max(assetB.width, assetB.height) * 0.5 * instB.scale;

            let dx = instB.x - instA.x;
            if (dx > settings.tileWidth * 0.5) dx -= settings.tileWidth;
            else if (dx < -settings.tileWidth * 0.5) dx += settings.tileWidth;

            let dy = instB.y - instA.y;
            if (dy > settings.tileHeight * 0.5) dy -= settings.tileHeight;
            else if (dy < -settings.tileHeight * 0.5) dy += settings.tileHeight;

            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq) || 0.1;
            const targetDist = (rA + rB) * settings.collisionThreshold;

            if (dist < targetDist) {
              const overlap = targetDist - dist;
              const cooling = (maxIter - step) / maxIter;
              const forceMag = (overlap / targetDist) * 0.5 * cooling;

              const fx = (dx / dist) * forceMag;
              const fy = (dy / dist) * forceMag;

              forces[i2] -= fx;
              forces[i2 + 1] -= fy;
              const j2 = j * 2;
              forces[j2] += fx;
              forces[j2 + 1] += fy;
            }
          }
        }

        const cooling = (maxIter - step) / maxIter;
        const noiseLevel = 1.2 * cooling;
        const snap = 0.001; // early exit threshold

        for (let i = 0; i < primaryInstances.length; i++) {
          const inst = primaryInstances[i];
          const i2 = i * 2;
          const fx = forces[i2] + (prng() - 0.5) * noiseLevel;
          const fy = forces[i2 + 1] + (prng() - 0.5) * noiseLevel;
          inst.x = wrap(inst.x + fx, settings.tileWidth);
          inst.y = wrap(inst.y + fy, settings.tileHeight);
          if (Math.abs(fx) > snap || Math.abs(fy) > snap) maxMovement = 1;
        }

        if (maxMovement === 0) break; // early exit if stable
      }
    }
  }

  // Generate seamless clones
  let finalLayout = [...primaryInstances];
  if (settings.seamlessCorrection) {
    for (const instance of primaryInstances) {
      const asset = assetMap.get(instance.assetId);
      if (!asset) continue;
      const clones = generateClonesForInstance(instance, asset, settings.tileWidth, settings.tileHeight);
      for (const c of clones) finalLayout.push(c);
    }
  }

  return finalLayout;
}

export function buildSvgString(
  assets: PatternAsset[],
  instances: PlacedInstance[],
  settings: PatternSettings,
  gridMultiplier: number = 1
): string {
  const W = settings.tileWidth;
  const H = settings.tileHeight;
  const viewW = W * gridMultiplier;
  const viewH = H * gridMultiplier;

  let svg = `<?xml version="1.0" encoding="utf-8"?>\n`;
  svg += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 ${viewW} ${viewH}">\n`;
  svg += `  <style>\n`;
  svg += `    .pattern-bg { fill: ${settings.backgroundColor || '#ffffff'}; }\n`;
  if (settings.showTileBorder) {
    svg += `    .tile-border { stroke: #e2e8f0; stroke-width: 1; fill: none; stroke-dasharray: 4 4; }\n`;
  }
  svg += `  </style>\n`;

  svg += `  <defs>\n`;
  svg += `    <clipPath id="tile-clip">\n`;
  svg += `      <rect x="0" y="0" width="${W}" height="${H}" />\n`;
  svg += `    </clipPath>\n`;

  for (const asset of assets) {
    const halfW = asset.width / 2;
    const halfH = asset.height / 2;
    svg += `    <g id="asset-${asset.id}">\n`;
    svg += `      <image href="${asset.dataUrl}" x="${-halfW}" y="${-halfH}" width="${asset.width}" height="${asset.height}" />\n`;
    svg += `    </g>\n`;
  }

  svg += `    <g id="single-tile">\n`;
  svg += `      <rect width="${W}" height="${H}" class="pattern-bg" />\n`;
  svg += `      <g clip-path="url(#tile-clip)">\n`;

  for (const inst of instances) {
    const opacityAttr = inst.opacity < 1.0 ? ` opacity="${inst.opacity.toFixed(2)}"` : '';
    svg += `        <use href="#asset-${inst.assetId}" transform="translate(${inst.x.toFixed(1)}, ${inst.y.toFixed(1)}) rotate(${inst.rotation.toFixed(1)}) scale(${inst.scale.toFixed(3)})"${opacityAttr} />\n`;
  }

  svg += `      </g>\n`;
  if (settings.showTileBorder) {
    svg += `      <rect width="${W}" height="${H}" class="tile-border" />\n`;
  }
  svg += `    </g>\n`;
  svg += `  </defs>\n`;

  svg += `  <rect width="${viewW}" height="${viewH}" fill="${settings.backgroundColor || '#ffffff'}" />\n`;

  for (let gy = 0; gy < gridMultiplier; gy++) {
    for (let gx = 0; gx < gridMultiplier; gx++) {
      svg += `  <use href="#single-tile" x="${gx * W}" y="${gy * H}" />\n`;
    }
  }

  svg += `</svg>`;
  return svg;
}

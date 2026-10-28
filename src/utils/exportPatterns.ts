// src/utils/exportPatterns.ts
import { PatternAsset, PatternSettings, PlacedInstance } from '../types';

export interface ExportResult {
  success: boolean;
  message?: string;
}

interface BuildSvgArgs {
  svgBuilder: (
    assets: PatternAsset[],
    instances: PlacedInstance[],
    settings: PatternSettings,
    multiplier: number,
  ) => string;
  assets: PatternAsset[];
  instances: PlacedInstance[];
  settings: PatternSettings;
  multiplier?: number;
}

const MAX_PNG_DIMENSION = 8192;
const PNG_SCALE = 2.5;

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode SVG image.'));
    img.src = src;
  });
}

function svgBlob(svg: string): Blob {
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

export async function downloadSvgTile({
  svgBuilder,
  assets,
  instances,
  settings,
}: BuildSvgArgs): Promise<ExportResult> {
  try {
    const svg = svgBuilder(assets, instances, settings, 1);
    downloadBlob(svgBlob(svg), `seamless-pattern-tile-${settings.seed}.svg`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to download SVG tile.',
    };
  }
}

export async function downloadFullSvg({
  svgBuilder,
  assets,
  instances,
  settings,
  multiplier,
}: BuildSvgArgs): Promise<ExportResult> {
  const m = Math.max(1, Math.floor(multiplier ?? 4));
  try {
    const svg = svgBuilder(assets, instances, settings, m);
    downloadBlob(svgBlob(svg), `seamless-pattern-${m}x${m}-${settings.seed}.svg`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to download grid SVG.',
    };
  }
}

export async function downloadPngTile({
  svgBuilder,
  assets,
  instances,
  settings,
}: BuildSvgArgs): Promise<ExportResult> {
  const width = Math.round(settings.tileWidth * PNG_SCALE);
  const height = Math.round(settings.tileHeight * PNG_SCALE);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { success: false, message: 'Invalid PNG export dimensions.' };
  }
  if (width > MAX_PNG_DIMENSION || height > MAX_PNG_DIMENSION) {
    return {
      success: false,
      message: `PNG export exceeds the ${MAX_PNG_DIMENSION}px limit (${width}×${height}).`,
    };
  }
  let svgUrl: string | null = null;
  try {
    const svg = svgBuilder(assets, instances, settings, 1);
    svgUrl = URL.createObjectURL(svgBlob(svg));
    const img = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode PNG.'))),
        'image/png',
      );
    });
    downloadBlob(blob, `seamless-tile-${settings.seed}.png`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to render PNG.',
    };
  } finally {
    if (svgUrl) URL.revokeObjectURL(svgUrl);
  }
}

export async function downloadJsonSettings(settings: PatternSettings): Promise<ExportResult> {
  try {
    const json = JSON.stringify(settings, null, 2);
    downloadBlob(
      new Blob([json], { type: 'application/json' }),
      `pattern-settings-seed-${settings.seed}.json`,
    );
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to export settings JSON.',
    };
  }
}
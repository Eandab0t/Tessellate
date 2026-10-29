import { PatternAsset, PatternSettings, PlacedInstance } from '../types';
import { buildSvgString } from './patternMath';

export interface ExportResult {
  success: boolean;
  message?: string;
}

const PNG_SCALE = 2.5;
const MAX_PNG_DIMENSION = 8192;

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The pattern could not be rasterised.'));
    image.src = src;
  });
}

function svgBuilder(
  assets: PatternAsset[],
  instances: PlacedInstance[],
  settings: PatternSettings,
  multiplier: number,
): string {
  return buildSvgString(assets, instances, settings, multiplier);
}

function downloadSvg(
  assets: PatternAsset[],
  instances: PlacedInstance[],
  settings: PatternSettings,
  multiplier: number,
  filename: string,
): ExportResult {
  try {
    const svg = svgBuilder(assets, instances, settings, multiplier);
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'The SVG could not be written.',
    };
  }
}

export function downloadSvgTile(
  assets: PatternAsset[],
  instances: PlacedInstance[],
  settings: PatternSettings,
): ExportResult {
  return downloadSvg(assets, instances, settings, 1, `tessellate-tile-${settings.seed}.svg`);
}

export function downloadFullSvg(
  assets: PatternAsset[],
  instances: PlacedInstance[],
  settings: PatternSettings,
  multiplier: number,
): ExportResult {
  const repeat = Math.max(1, Math.floor(multiplier));
  return downloadSvg(
    assets,
    instances,
    settings,
    repeat,
    `tessellate-${repeat}x${repeat}-${settings.seed}.svg`,
  );
}

export async function downloadPng(
  assets: PatternAsset[],
  instances: PlacedInstance[],
  settings: PatternSettings,
): Promise<ExportResult> {
  const width = Math.round(settings.tileWidth * PNG_SCALE);
  const height = Math.round(settings.tileHeight * PNG_SCALE);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { success: false, message: 'The tile size is not valid.' };
  }
  if (width > MAX_PNG_DIMENSION || height > MAX_PNG_DIMENSION) {
    return {
      success: false,
      message: `PNG is limited to ${MAX_PNG_DIMENSION}px (this tile would be ${width}×${height}).`,
    };
  }

  let svgUrl: string | null = null;
  try {
    const svg = svgBuilder(assets, instances, settings, 1);
    svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const image = await loadImage(svgUrl);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser cannot render a canvas.');
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('The PNG could not be encoded.'))),
        'image/png',
      );
    });

    downloadBlob(blob, `tessellate-tile-${settings.seed}.png`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'The PNG could not be rendered.',
    };
  } finally {
    if (svgUrl) URL.revokeObjectURL(svgUrl);
  }
}

export function downloadSettingsJson(settings: PatternSettings): ExportResult {
  try {
    const json = JSON.stringify(settings, null, 2);
    downloadBlob(
      new Blob([json], { type: 'application/json' }),
      `tessellate-settings-${settings.seed}.json`,
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'The settings could not be written.',
    };
  }
}

export async function readSettingsJson(file: File): Promise<PatternSettings> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('That file does not contain pattern settings.');
  }
  return parsed as PatternSettings;
}

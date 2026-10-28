/**
 * Pattern export utilities. Moved here to reduce PatternPreview boilerplate.
 */

import { PatternSettings } from '../types';

/** Trigger a notification via BroadcastChannel (simple decoupled approach) */
function notifyExport(message: string): void {
  try {
    const channel = new BroadcastChannel('export-notifications');
    channel.postMessage({ type: 'export-success', message });
    channel.close();
  } catch {
    // Silent fail - not critical for export functionality
  }
}

/** Download a blob as a file */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface BuildSvgArgs {
  svgBuilder: (assets: any[], instances: any[], settings: PatternSettings, multiplier: number) => string;
  assets: any[];
  instances: any[];
  settings: PatternSettings;
  multiplier?: number;
}

/** Download SVG tile */
export async function downloadSvgTile({ svgBuilder, assets, instances, settings }: BuildSvgArgs): Promise<{ success: boolean; message?: string }> {
  try {
    const singleTileSvg = svgBuilder(assets, instances, settings, 1);
    const blob = new Blob([singleTileSvg], { type: 'image/svg+xml;charset=utf-8' });
    notifyExport('Downloaded SVG tile!');
    downloadBlob(blob, seamless-pattern-tile-.svg);
    return { success: true };
  } catch (err) {
    return { success: false, message: 'Failed to download SVG tile.' };
  }
}

/** Download full grid SVG */
export async function downloadFullSvg({ svgBuilder, assets, instances, settings }: BuildSvgArgs): Promise<{ success: boolean; message?: string }> {
  try {
    const svgString = svgBuilder(assets, instances, settings, 4);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    notifyExport('Downloaded full SVG grid!');
    downloadBlob(blob, seamless-pattern-.svg);
    return { success: true };
  } catch (err) {
    return { success: false, message: 'Failed to download grid SVG.' };
  }
}

/** Download PNG raster tile */
export async function downloadPngTile({ svgBuilder, assets, instances, settings }: BuildSvgArgs): Promise<{ success: boolean; message?: string }> {
  try {
    const tileSvg = svgBuilder(assets, instances, settings, 1);
    const scaleFactor = 2.5;
    const canvasW = Math.round(settings.tileWidth * scaleFactor);
    const canvasH = Math.round(settings.tileHeight * scaleFactor);

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    const svgBlob = new Blob([tileSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        URL.revokeObjectURL(url);

        try {
          const pngDataUrl = canvas.toDataURL('image/png');
          const blob = new Blob([pngDataUrl], { type: 'image/png' });
          // Convert dataURL back to file blob for download
          const link = document.createElement('a');
          link.href = pngDataUrl;
          link.download = seamless-tile-.png;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          notifyExport('Downloaded high-res PNG tile!');
          resolve({ success: true });
        } catch {
          resolve({ success: false, message: 'Browser security rules block saving canvas.' });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ success: false, message: 'Error rendering PNG. Check if your images contain unsafe URLs.' });
      };

      img.src = url;
    });
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error creating PNG.' };
  }
}

/** Download settings JSON */
export async function downloadJsonSettings(settings: PatternSettings): Promise<{ success: boolean; message?: string }> {
  try {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    notifyExport('Downloaded settings JSON!');
    downloadBlob(blob, pattern-settings-seed-.json);
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to export settings JSON.' };
  }
}
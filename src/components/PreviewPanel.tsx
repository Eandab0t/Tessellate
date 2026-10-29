import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PatternAsset, PatternSettings, PlacedInstance } from '../types';
import { buildSvgString, generatePattern } from '../utils/patternMath';
import {
  downloadFullSvg,
  downloadPng,
  downloadSettingsJson,
  downloadSvgTile,
  readSettingsJson,
} from '../utils/exportPatterns';
import {
  AlertCircle,
  Check,
  Download,
  Eye,
  FileJson,
  FolderOpen,
  Grid,
  Image as ImageIcon,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface PreviewPanelProps {
  assets: PatternAsset[];
  settings: PatternSettings;
  onLoadSettings: (settings: PatternSettings) => void;
}

interface Notice {
  ok: boolean;
  text: string;
}

const REPEATS = [1, 2, 3, 4] as const;

export default function PreviewPanel({ assets, settings, onLoadSettings }: PreviewPanelProps) {
  const [repeat, setRepeat] = useState<number>(3);
  const [zoom, setZoom] = useState(100);
  const [exportingPng, setExportingPng] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsInput = useRef<HTMLInputElement>(null);

  const { instances, layoutError } = useMemo<{
    instances: PlacedInstance[];
    layoutError: string | null;
  }>(() => {
    if (assets.length === 0) return { instances: [], layoutError: null };
    try {
      return { instances: generatePattern(assets, settings), layoutError: null };
    } catch (cause) {
      return {
        instances: [],
        layoutError:
          cause instanceof Error ? cause.message : 'The layout could not be generated.',
      };
    }
  }, [assets, settings]);

  const svg = useMemo(() => {
    if (instances.length === 0) return '';
    return buildSvgString(assets, instances, settings, repeat);
  }, [assets, instances, settings, repeat]);

  const previewSvg = useMemo(() => svg.replace(/^<\?xml[^>]*\?>\s*/, ''), [svg]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const flash = (ok: boolean, text: string) => {
    setNotice({ ok, text });
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 4000);
  };

  const report = (result: { success: boolean; message?: string }, success: string) => {
    if (result.success) flash(true, success);
    else flash(false, result.message ?? 'The export failed.');
  };

  const handleSvgTile = () => {
    report(downloadSvgTile(assets, instances, settings), 'Single SVG tile downloaded.');
  };

  const handleFullSvg = () => {
    report(
      downloadFullSvg(assets, instances, settings, repeat),
      `${repeat}×${repeat} SVG grid downloaded.`,
    );
  };

  const handlePng = async () => {
    setExportingPng(true);
    try {
      const result = await downloadPng(assets, instances, settings);
      report(result, 'High-resolution PNG tile downloaded.');
    } finally {
      setExportingPng(false);
    }
  };

  const handleSaveJson = () => {
    report(downloadSettingsJson(settings), 'Settings exported as JSON.');
  };

  const handleLoadJson = async (file: File) => {
    try {
      const loaded = await readSettingsJson(file);
      onLoadSettings(loaded);
      flash(true, 'Settings loaded from JSON.');
    } catch (cause) {
      flash(false, cause instanceof Error ? cause.message : 'That file could not be loaded.');
    }
  };

  const tileW = settings.tileWidth * repeat;
  const tileH = settings.tileHeight * repeat;
  const scale = zoom / 100;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg border border-line bg-ink p-2 text-accent">
              <Eye className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                Preview
              </h2>
              <p className="mt-0.5 font-mono text-[10px] text-muted">
                Check the repeat before exporting
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg border border-line bg-ink p-0.5">
              <span className="px-1.5 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
                Repeat
              </span>
              {REPEATS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRepeat(value)}
                  className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold transition ${
                    repeat === value ? 'bg-accent text-black' : 'text-muted hover:text-white'
                  }`}
                >
                  {value}×{value}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-lg border border-line bg-ink p-0.5">
              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(25, value - 25))}
                className="rounded p-1 text-zinc-400 transition hover:bg-line hover:text-white"
                title="Zoom out"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <span className="inline-block min-w-10 px-1 text-center font-mono text-[10px] font-bold text-accent">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(300, value + 25))}
                className="rounded p-1 text-zinc-400 transition hover:bg-line hover:text-white"
                title="Zoom in"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-3">
          <div className="relative">
            <div className="h-[420px] overflow-auto rounded-lg border border-line bg-ink p-5 sm:h-[520px]">
              {previewSvg ? (
                <div
                  className="mx-auto shrink-0"
                  style={{ width: tileW * scale, height: tileH * scale }}
                >
                  <div
                    style={{
                      width: tileW,
                      height: tileH,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                    }}
                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-zinc-500">
                  <ImageIcon className="h-8 w-8 text-zinc-600" />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wide">
                    {layoutError ? 'Layout error' : 'Add a motif to begin'}
                  </p>
                  <p className="max-w-xs text-[11px] text-zinc-500">
                    {layoutError ??
                      'Pick a built-in motif or drop an image, and the repeating tile appears here.'}
                  </p>
                </div>
              )}
            </div>

            {previewSvg ? (
              <div className="pointer-events-none absolute left-3 top-3 space-y-0.5 rounded border border-line bg-panel/90 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 backdrop-blur">
                <div>
                  Bounds{' '}
                  <span className="font-semibold text-accent">
                    {tileW} × {tileH}px
                  </span>
                </div>
                <div>
                  Tile <span className="text-zinc-200">{settings.tileWidth} × {settings.tileHeight}px</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {svg ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            Export
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <button
              type="button"
              onClick={handleSvgTile}
              className="flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-black transition hover:bg-accent-2"
              title="One vector tile, ready to repeat as a CSS background"
            >
              <Download className="h-4 w-4" />
              SVG tile
            </button>
            <button
              type="button"
              onClick={handleFullSvg}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-zinc-300 transition hover:border-accent/50 hover:text-white"
              title="The full repeated grid as one vector file"
            >
              <Grid className="h-4 w-4 text-accent" />
              Grid SVG
            </button>
            <button
              type="button"
              onClick={handlePng}
              disabled={exportingPng}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-zinc-300 transition hover:border-accent/50 hover:text-white disabled:opacity-40"
              title="Rasterise the tile to a high-resolution PNG"
            >
              {exportingPng ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin text-zinc-500" />
                  PNG…
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 text-emerald-400" />
                  PNG
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSaveJson}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-zinc-300 transition hover:border-accent/50 hover:text-white"
              title="Save the current settings"
            >
              <FileJson className="h-4 w-4 text-accent/80" />
              Save JSON
            </button>
            <button
              type="button"
              onClick={() => settingsInput.current?.click()}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-zinc-300 transition hover:border-accent/50 hover:text-white"
              title="Load settings from a JSON file"
            >
              <FolderOpen className="h-4 w-4 text-accent/80" />
              Load JSON
            </button>
            <input
              ref={settingsInput}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleLoadJson(file);
                event.target.value = '';
              }}
            />
          </div>
        </div>
      ) : null}

      {notice ? (
        <div
          className={`flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-wide ${
            notice.ok
              ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300'
              : 'border-rose-500/25 bg-rose-500/5 text-rose-300'
          }`}
        >
          {notice.ok ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}

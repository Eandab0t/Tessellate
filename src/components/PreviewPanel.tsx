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
  onTune: () => void;
}

interface Notice {
  ok: boolean;
  text: string;
}

const REPEATS = [1, 2, 3, 4] as const;

export default function PreviewPanel({ assets, settings, onLoadSettings, onTune }: PreviewPanelProps) {
  const [repeat, setRepeat] = useState<number>(3);
  const [zoom, setZoom] = useState(75);
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
    <>
      {/* Canvas: black studio with dotted grid, pattern artboard centered */}
      <div className="absolute inset-0 overflow-auto bg-[radial-gradient(#1a1a1a_1px,transparent_1.2px)] [background-size:22px_22px]">
        {previewSvg ? (
          <div className="flex min-h-full min-w-full p-8 lg:p-12">
            <div className="m-auto shrink-0" style={{ width: tileW * scale, height: tileH * scale }}>
              <div
                className="overflow-hidden rounded-2xl shadow-pop ring-1 ring-black/40 bg-black"
                style={{
                  width: tileW,
                  height: tileH,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-3xl border border-line bg-card p-8 text-center shadow-card">
              <span
                className={`mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl ${
                  layoutError ? 'bg-red-900/20 text-red-400' : 'bg-accent-soft text-accent'
                }`}
              >
                <ImageIcon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight text-text">
                {layoutError ? 'Layout error' : 'Start with a motif'}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {layoutError ??
                  'Pick a built-in motif or drop in an image, and the repeating tile appears here.'}
              </p>
              {layoutError ? null : (
                <button
                  type="button"
                  onClick={onTune}
                  className="mt-5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-black shadow-chip transition hover:bg-accent-2"
                >
                  Open the motif library
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating info chip top-left */}
      {previewSvg ? (
        <div className="pointer-events-none absolute left-4 top-4 z-20 hidden rounded-xl border border-line bg-card/80 px-3.5 py-2 text-[11px] font-medium text-muted shadow-card backdrop-blur sm:block">
          Canvas{' '}
          <span className="font-bold text-text">{tileW} × {tileH}</span>{' '}
          <span className="mx-1.5 text-line-2">·</span>
          tile{' '}
          <span className="font-bold text-text">{settings.tileWidth} × {settings.tileHeight}</span>
        </div>
      ) : null}

      {/* Bottom-left status chip */}
      <div className="absolute bottom-4 left-4 z-20 hidden items-center gap-2 rounded-xl bg-black/80 px-3.5 py-2 text-[11px] font-medium text-text/70 shadow-pop backdrop-blur sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span>
          <span className="text-text">{assets.length}</span> motif{assets.length === 1 ? '' : 's'}
        </span>
        <span className="text-text/30">·</span>
        <span>
          <span className="text-text">{settings.tileWidth}×{settings.tileHeight}</span>
        </span>
        <span className="text-text/30">·</span>
        <span>
          seed <span className="font-mono text-text">0x{settings.seed.toString(16).toUpperCase()}</span>
        </span>
      </div>

      {/* Repeat + zoom dock bottom-center */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-line bg-card p-1 shadow-pop">
        {REPEATS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRepeat(value)}
            className={`rounded-full px-2.5 py-1.5 font-mono text-[11px] font-bold transition ${
              repeat === value ? 'bg-black text-text' : 'text-muted hover:text-text'
            }`}
            title={`Preview ${value}×${value} repeats`}
          >
            {value}×{value}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-line" />
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(25, value - 25))}
          className="rounded-full p-1.5 text-muted transition hover:bg-card-2 hover:text-text"
          title="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="w-11 text-center font-mono text-[11px] font-bold text-text">{zoom}%</span>
        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(300, value + 25))}
          className="rounded-full p-1.5 text-muted transition hover:bg-card-2 hover:text-text"
          title="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Export stack bottom-right */}
      {svg ? (
        <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-0.5 rounded-2xl border border-line bg-card p-1.5 shadow-pop lg:right-[380px]">
          <button
            type="button"
            onClick={handleSvgTile}
            className="flex w-14 flex-col items-center gap-1 rounded-xl bg-accent px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-black transition hover:bg-accent-2"
            title="One vector tile, ready to repeat as a CSS background"
          >
            <Download className="h-4 w-4" />
            SVG
          </button>
          <button
            type="button"
            onClick={handleFullSvg}
            className="flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-muted transition hover:bg-card-2 hover:text-text"
            title="The full repeated grid as one vector file"
          >
            <Grid className="h-4 w-4" />
            Grid
          </button>
          <button
            type="button"
            onClick={handlePng}
            disabled={exportingPng}
            className="flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-muted transition hover:bg-card-2 hover:text-text disabled:opacity-40"
            title="Rasterise the tile to a high-resolution PNG"
          >
            {exportingPng ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            PNG
          </button>
          <button
            type="button"
            onClick={handleSaveJson}
            className="flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-muted transition hover:bg-card-2 hover:text-text"
            title="Save the current settings as JSON"
          >
            <FileJson className="h-4 w-4" />
            Save
          </button>
          <button
            type="button"
            onClick={() => settingsInput.current?.click()}
            className="flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold uppercase tracking-wide text-muted transition hover:bg-card-2 hover:text-text"
            title="Load settings from a JSON file"
          >
            <FolderOpen className="h-4 w-4" />
            Load
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
      ) : null}

      {notice ? (
        <div
          className={`absolute left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold shadow-pop ${
            notice.ok ? 'bg-black text-text' : 'bg-red-900 text-red-400'
          }`}
        >
          {notice.ok ? (
            <Check className="h-3.5 w-3.5 text-accent-2" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {notice.text}
        </div>
      ) : null}
    </>
  );
}

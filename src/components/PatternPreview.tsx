// src/components/PatternPreview.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { PatternAsset, PatternSettings, PlacedInstance } from '../types';
import { generatePattern, buildSvgString } from '../utils/patternMath';
import {
  downloadSvgTile,
  downloadFullSvg,
  downloadPngTile,
  downloadJsonSettings,
} from '../utils/exportPatterns';
import {
  Download,
  Eye,
  Image as ImageIcon,
  FileJson,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
  Grid,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface PatternPreviewProps {
  assets: PatternAsset[];
  settings: PatternSettings;
}

export default function PatternPreview({ assets, settings }: PatternPreviewProps) {
  const [gridMultiplier, setGridMultiplier] = useState(3);
  const [zoom, setZoom] = useState(100);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { instances, layoutError } = useMemo<{
    instances: PlacedInstance[];
    layoutError: string | null;
  }>(() => {
    if (assets.length === 0) return { instances: [], layoutError: null };
    try {
      return { instances: generatePattern(assets, settings), layoutError: null };
    } catch (err) {
      return {
        instances: [],
        layoutError:
          err instanceof Error
            ? err.message
            : 'Error generating layout. Check asset details or density.',
      };
    }
  }, [assets, settings]);

  useEffect(() => {
    setErrorMsg(layoutError);
  }, [layoutError]);

  const svgString = useMemo(() => {
    if (instances.length === 0) return '';
    return buildSvgString(assets, instances, settings, gridMultiplier);
  }, [assets, instances, settings, gridMultiplier]);

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const clearMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSvgTile = async () => {
    if (assets.length === 0) return;
    clearMessages();
    const result = await downloadSvgTile({ svgBuilder: buildSvgString, assets, instances, settings });
    if (result.success) notifySuccess('Downloaded single SVG tile!');
    else setErrorMsg(result.message ?? 'Failed to download SVG.');
  };

  const handleFullSvg = async () => {
    if (assets.length === 0) return;
    clearMessages();
    const result = await downloadFullSvg({
      svgBuilder: buildSvgString,
      assets,
      instances,
      settings,
      multiplier: gridMultiplier,
    });
    if (result.success) notifySuccess(`Downloaded ${gridMultiplier}x${gridMultiplier} Grid SVG!`);
    else setErrorMsg(result.message ?? 'Failed to download Grid SVG.');
  };

  const handlePng = async () => {
    if (assets.length === 0) return;
    setIsExportingPng(true);
    clearMessages();
    try {
      const result = await downloadPngTile({
        svgBuilder: buildSvgString,
        assets,
        instances,
        settings,
      });
      if (result.success) notifySuccess('Downloaded high-res PNG Tile!');
      else setErrorMsg(result.message ?? 'Error occurred while creating PNG.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleJson = async () => {
    clearMessages();
    const result = await downloadJsonSettings(settings);
    if (result.success) notifySuccess('Downloaded settings JSON!');
    else setErrorMsg(result.message ?? 'Failed to export settings JSON.');
  };

  return (
    <div id="pattern-preview-container" className="space-y-6">
      <div className="bg-[#121317] rounded-xl border border-[#2D2F36] p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#16171B] border border-[#2D2F36] text-amber-500 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-sans">
              PATTERN PREVIEW
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">
              CHECK THE TILE AND REPEAT BEFORE EXPORTING
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#16171B] rounded border border-[#2D2F36] p-1">
            <span className="text-[9px] uppercase font-bold text-gray-500 font-mono px-1.5">
              TILE MATRIX:
            </span>
            {[1, 2, 3, 4].map((m) => (
              <button
                key={m}
                onClick={() => setGridMultiplier(m)}
                className={`text-[10px] px-2 py-0.5 font-bold font-mono rounded cursor-pointer transition-all ${
                  gridMultiplier === m
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 1 ? 'TILE' : `${m}x${m}`}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-[#16171B] rounded border border-[#2D2F36] p-1 text-gray-400">
            <button
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="p-1 hover:bg-[#2D2F36] hover:text-white rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-bold font-mono px-2 inline-block min-w-10 text-center text-amber-500">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(300, zoom + 25))}
              className="p-1 hover:bg-[#2D2F36] hover:text-white rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#090A0C] rounded-xl p-6 border border-[#2D2F36] overflow-hidden relative group min-h-[400px] flex items-center justify-center shadow-2xl">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {svgString ? (
          <div
            className="transition-transform duration-200 max-w-full max-h-full overflow-auto flex items-center justify-center custom-scrollbar"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div
              className="rounded overflow-hidden transition-all duration-300 relative border border-[#2D2F36]/30 shadow-lg"
              style={{
                width: `${settings.tileWidth * gridMultiplier}px`,
                height: `${settings.tileHeight * gridMultiplier}px`,
              }}
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          </div>
        ) : (
          <div className="text-center space-y-3 max-w-xs text-gray-500">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-600 animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-wide font-mono">
              ADD A MOTIF TO GET STARTED
            </p>
            <p className="text-[11px] text-gray-600">
              Choose a built-in motif or upload an image to see your repeating pattern.
            </p>
          </div>
        )}
        {svgString && (
          <div className="absolute top-4 left-4 bg-[#121317]/90 px-3 py-1.5 rounded border border-[#2D2F36] pointer-events-none text-[10px] font-mono text-gray-400 space-y-0.5">
            <div>
              BOUNDS:{' '}
              <span className="text-amber-500 font-semibold">
                {settings.tileWidth * gridMultiplier} × {settings.tileHeight * gridMultiplier} px
              </span>
            </div>
            <div>
              SINGLE TILE:{' '}
              <span className="text-gray-300">
                {settings.tileWidth} × {settings.tileHeight} px
              </span>
            </div>
          </div>
        )}
      </div>

      {svgString && (
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3 h-3 text-amber-500" /> EXPORT YOUR PATTERN
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleSvgTile}
              className="flex items-center justify-center gap-2 p-3 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold font-mono shadow-md cursor-pointer transition-all uppercase tracking-wide shrink-0"
              title="Download neat 1x1 vector tile for repeating background-image"
            >
              <Download className="w-4 h-4" />
              <span>SVG Tile</span>
            </button>
            <button
              onClick={handleFullSvg}
              className="flex items-center justify-center gap-2 p-3 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 hover:bg-[#202126] text-gray-300 rounded text-xs font-bold font-mono cursor-pointer transition-all uppercase"
              title="Download multi-cell wallpaper layout to print or import"
            >
              <Grid className="w-4 h-4 text-amber-500" />
              <span>Full SVG Grid</span>
            </button>
            <button
              disabled={isExportingPng}
              onClick={handlePng}
              className="flex items-center justify-center gap-2 p-3 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 hover:bg-[#202126] text-gray-300 rounded text-xs font-bold font-mono disabled:opacity-30 cursor-pointer transition-all uppercase"
              title="Convert Vector Tile to High-Res portable PNG"
            >
              {isExportingPng ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin text-gray-500" />
                  <span>RENDER PNG...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>PNG Raster</span>
                </>
              )}
            </button>
            <button
              onClick={handleJson}
              className="flex items-center justify-center gap-2 p-3 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 hover:bg-[#202126] text-gray-300 rounded text-xs font-bold font-mono cursor-pointer transition-all uppercase"
              title="Record alignment seeds and ratios to re-import later"
            >
              <FileJson className="w-4 h-4 text-amber-500/80" />
              <span>Export JSON</span>
            </button>
          </div>
          {successMsg && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/20 px-4 py-2.5 rounded border border-emerald-900/30 font-mono uppercase">
              <Check className="w-4 h-4" />
              <span>SYSTEM SUCCESS // {successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/20 px-4 py-2.5 rounded border border-rose-900/30 font-mono uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>COMPILING ERROR // {errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
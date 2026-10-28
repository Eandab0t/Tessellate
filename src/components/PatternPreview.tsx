/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { PatternAsset, PatternSettings } from '../types';
import { generatePattern, buildSvgString } from '../utils/patternMath';
import { downloadSvgTile, downloadFullSvg, downloadPngTile, downloadJsonSettings } from '../utils/exportPatterns';
import { Download, Eye, Image as ImageIcon, FileJson, ZoomIn, ZoomOut, RefreshCcw, Grid, Check, Sparkles, AlertCircle } from 'lucide-react';

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

  // Layout computation (memoized)
  const instances = useMemo(() => {
    if (assets.length === 0) return [];
    try {
      return generatePattern(assets, settings);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Layout error');
      return [];
    }
  }, [assets, settings]);

  // SVG generation (memoized)
  const svgString = useMemo(() => {
    if (instances.length === 0) return '';
    return buildSvgString(assets, instances, settings, gridMultiplier);
  }, [assets, instances, settings, gridMultiplier]);

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Export handlers
  const handleSvgTile = async () => {
    if (!assets.length) return;
    const result = await downloadSvgTile({ svgBuilder: buildSvgString, assets, instances, settings });
    notifySuccess(result.success ? 'SVG tile downloaded!' : (result.message || 'Download failed'));
    if (!result.success) setErrorMsg(result.message);
  };

  const handleFullSvg = async () => {
    if (!assets.length) return;
    const result = await downloadFullSvg({ svgBuilder: buildSvgString, assets, instances, settings });
    notifySuccess(result.success ? 'Full SVG downloaded!' : (result.message || 'Download failed'));
    if (!result.success) setErrorMsg(result.message);
  };

  const handlePng = async () => {
    if (!assets.length) return;
    setIsExportingPng(true);
    try {
      const result = await downloadPngTile({ svgBuilder: buildSvgString, assets, instances, settings });
      notifySuccess(result.success ? 'PNG downloaded!' : (result.message || 'Render failed'));
      if (!result.success) setErrorMsg(result.message);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleJson = async () => {
    const result = await downloadJsonSettings(settings);
    notifySuccess(result.success ? 'JSON downloaded!' : (result.message || 'Export failed'));
    if (!result.success) setErrorMsg(result.message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121317] rounded-xl border border-[#2D2F36] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#16171B] border border-[#2D2F36] text-amber-500 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-sans">PATTERN PREVIEW</h3>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">Check the tile and repeat before exporting</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#16171B] rounded border border-[#2D2F36] p-1">
            <span className="text-[9px] uppercase font-bold text-gray-500 font-mono px-1.5">Tile Matrix:</span>
            {[1, 2, 3, 4].map((m) => (
              <button key={m} onClick={() => setGridMultiplier(m)}
                className={	ext-[10px] px-2 py-0.5 font-bold font-mono rounded cursor-pointer transition-all }>
                {m === 1 ? 'TILE' : ${m}x}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#16171B] rounded border border-[#2D2F36] p-1 text-gray-400">
            <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1 hover:bg-[#2D2F36] hover:text-white rounded cursor-pointer" title="Zoom Out"><ZoomOut className="w-3 h-3" /></button>
            <span className="text-[10px] font-bold font-mono px-2 inline-block min-w-10 text-center text-amber-500">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(300, zoom + 25))} className="p-1 hover:bg-[#2D2F36] hover:text-white rounded cursor-pointer" title="Zoom In"><ZoomIn className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-[#090A0C] rounded-xl p-6 border border-[#2D2F36] overflow-hidden relative group min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {svgString ? (
          <div className="transition-transform duration-200 max-w-full max-h-full overflow-auto flex items-center justify-center" style={{ transform: \scale()\ }}>
            <div className="rounded overflow-hidden relative border border-[#2D2F36]/30 shadow-lg"
              style={{ width: \\px\, height: \\px\ }}
              dangerouslySetInnerHTML={{ __html: svgString }} />
          </div>
        ) : (
          <div className="text-center space-y-3 max-w-xs text-gray-500">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-600 animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-wide font-mono">Add a motif to get started</p>
            <p className="text-[11px] text-gray-600">Choose a built-in motif or upload an image.</p>
          </div>
        )}

        {/* Bounds overlay */}
        {svgString && (
          <div className="absolute top-4 left-4 bg-[#121317]/90 px-3 py-1.5 rounded border border-[#2D2F36] pointer-events-none text-[10px] font-mono text-gray-400">
            <div>Bounds: <span className="text-amber-500 font-semibold">{settings.tileWidth * gridMultiplier} × {settings.tileHeight * gridMultiplier}px</span></div>
            <div>Tile: <span className="text-gray-300">{settings.tileWidth} × {settings.tileHeight}px</span></div>
          </div>
        )}
      </div>

      {/* Export Buttons */}
      {svgString && (
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3 h-3 text-amber-500" /> Export
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button onClick={handleSvgTile} className="flex items-center justify-center gap-2 p-3 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold font-mono shadow-md cursor-pointer transition-all uppercase">
              <Download className="w-4 h-4" /><span>SVG Tile</span>
            </button>

            <button onClick={handleFullSvg} className="flex items-center justify-center gap-2 p-3 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 hover:bg-[#202126] text-gray-300 rounded text-xs font-bold font-mono cursor-pointer transition-all uppercase">
              <Grid className="w-4 h-4 text-amber-500" /><span>Full SVG</span>
            </button>

            <button disabled={isExportingPng} onClick={handlePng} className="flex items-center justify-center gap-2 p-3 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 hover:bg-[#202126] text-gray-300 rounded text-xs font-bold font-mono disabled:opacity-30 cursor-pointer transition-all uppercase">
              {isExportingPng ? <><RefreshCcw className="w-4 h-4 animate-spin text-gray-500" /><span>RENDERING...</span></> : <><ImageIcon className="w-4 h-4 text-emerald-500" /><span>PNG</span></>}
            </button>

            <button onClick={handleJson} className="flex items-center justify-center gap-2 p-3 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 hover:bg-[#202126] text-gray-300 rounded text-xs font-bold font-mono cursor-pointer transition-all uppercase">
              <FileJson className="w-4 h-4 text-amber-500/80" /><span>JSON</span>
            </button>
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/20 px-4 py-2.5 rounded border border-emerald-900/30">
              <Check className="w-4 h-4" /><span>✓ {successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/20 px-4 py-2.5 rounded border border-rose-900/30">
              <AlertCircle className="w-4 h-4" /><span>✗ {errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { PatternSettings, PatternMode, PositioningMode, PatternAsset } from '../types';
import { 
  Settings, Sliders, RefreshCw, Grid, Layers, Eye, 
  Sparkles, ShieldCheck, Paintbrush, HelpCircle,
  Link, Maximize2, Wand2
} from 'lucide-react';
import { DEFAULT_ASSETS } from '../utils/defaultAssets';

interface ControlPanelProps {
  settings: PatternSettings;
  setSettings: React.Dispatch<React.SetStateAction<PatternSettings>>;
  setAssets?: React.Dispatch<React.SetStateAction<PatternAsset[]>>;
}

export default function ControlPanel({ settings, setSettings, setAssets }: ControlPanelProps) {
  const seedInputRef = useRef<HTMLInputElement>(null);

  const applyPresetTheme = (theme: 'spooky' | 'floral' | 'memphis') => {
    if (theme === 'spooky') {
      setSettings(prev => ({
        ...prev,
        mode: 'grid',
        gridCols: 4,
        gridRows: 4,
        gridType: 'half_drop',
        gridOffset: 50,
        gridJitter: 5,
        gridFlipAlternating: true,
        backgroundColor: '#0F1012',
        scaleMode: 'fixed',
        fixedScale: 1.0,
        fixedOpacity: 1.0,
        opacityMode: 'fixed',
        rotationMode: 'fixed',
        fixedRotation: 0,
      }));

      if (setAssets) {
        const spookyIds = ['spooky-spiral', 'spooky-grin', 'spooky-ghost', 'spooky-boxy'];
        const spookyAssets = DEFAULT_ASSETS.filter(a => spookyIds.includes(a.id)).map((a, i) => ({
          ...a,
          id: `spooky-theme-asset-${i}-${Date.now()}`
        }));
        if (spookyAssets.length > 0) {
          setAssets(spookyAssets);
        }
      }
    } else if (theme === 'floral') {
      setSettings(prev => ({
        ...prev,
        mode: 'grid',
        gridCols: 4,
        gridRows: 4,
        gridType: 'half_slide',
        gridOffset: 50,
        gridJitter: 0,
        gridFlipAlternating: true,
        backgroundColor: '#E6F0EB',
        scaleMode: 'fixed',
        fixedScale: 1.0,
        fixedOpacity: 1.0,
        opacityMode: 'fixed',
        rotationMode: 'random',
        minRotation: -15,
        maxRotation: 15,
      }));

      if (setAssets) {
        const floralIds = ['default-flower', 'default-circle-ring', 'default-star'];
        const floralAssets = DEFAULT_ASSETS.filter(a => floralIds.includes(a.id)).map((a, i) => ({
          ...a,
          id: `floral-theme-asset-${i}-${Date.now()}`
        }));
        if (floralAssets.length > 0) {
          setAssets(floralAssets);
        }
      }
    } else if (theme === 'memphis') {
      setSettings(prev => ({
        ...prev,
        mode: 'organic',
        positioning: 'grid_snap',
        gridCols: 5,
        gridRows: 5,
        gridType: 'standard',
        gridJitter: 35,
        gridFlipAlternating: false,
        backgroundColor: '#1E293B',
        scaleMode: 'random',
        minScale: 0.7,
        maxScale: 1.3,
        collisionAvoidance: true,
        collisionThreshold: 1.1,
        fixedOpacity: 0.95,
        opacityMode: 'fixed',
        rotationMode: 'random',
      }));

      if (setAssets) {
        const memphisIds = ['default-circle-ring', 'default-blob', 'default-star'];
        const memphisAssets = DEFAULT_ASSETS.filter(a => memphisIds.includes(a.id)).map((a, i) => ({
          ...a,
          id: `memphis-theme-asset-${i}-${Date.now()}`
        }));
        if (memphisAssets.length > 0) {
          setAssets(memphisAssets);
        }
      }
    }
  };

  const updateSetting = <K extends keyof PatternSettings>(key: K, value: PatternSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const randomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 100000);
    updateSetting('seed', newSeed);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', val: number) => {
    const value = Math.max(32, Math.min(3840, val));
    const ratio = settings.aspectRatio;
    
    if (ratio === 'custom') {
      if (dimension === 'width') {
        updateSetting('tileWidth', value);
      } else {
        updateSetting('tileHeight', value);
      }
    } else {
      let otherVal = value;
      if (ratio === '1:1') otherVal = value;
      else if (ratio === '16:9') {
        otherVal = dimension === 'width' ? Math.round(value * 9 / 16) : Math.round(value * 16 / 9);
      } else if (ratio === '4:3') {
        otherVal = dimension === 'width' ? Math.round(value * 3 / 4) : Math.round(value * 4 / 3);
      } else if (ratio === '3:2') {
        otherVal = dimension === 'width' ? Math.round(value * 2 / 3) : Math.round(value * 3 / 2);
      } else if (ratio === '2:1') {
        otherVal = dimension === 'width' ? Math.round(value * 1 / 2) : Math.round(value * 2);
      }

      setSettings(prev => ({
        ...prev,
        tileWidth: dimension === 'width' ? value : otherVal,
        tileHeight: dimension === 'height' ? value : otherVal
      }));
    }
  };

  const changeAspectRatio = (newRatio: typeof settings.aspectRatio) => {
    if (newRatio === 'custom') {
      updateSetting('aspectRatio', 'custom');
    } else {
      const width = settings.tileWidth;
      let height = width;
      if (newRatio === '16:9') height = Math.round(width * 9 / 16);
      else if (newRatio === '4:3') height = Math.round(width * 3 / 4);
      else if (newRatio === '3:2') height = Math.round(width * 2 / 3);
      else if (newRatio === '2:1') height = Math.round(width * 1 / 2);

      setSettings(prev => ({
        ...prev,
        aspectRatio: newRatio,
        tileHeight: height
      }));
    }
  };

  const applySizePreset = (widthPreset: number) => {
    const ratio = settings.aspectRatio;
    let height = widthPreset;
    if (ratio === '16:9') height = Math.round(widthPreset * 9 / 16);
    else if (ratio === '4:3') height = Math.round(widthPreset * 3 / 4);
    else if (ratio === '3:2') height = Math.round(widthPreset * 2 / 3);
    else if (ratio === '2:1') height = Math.round(widthPreset * 1 / 2);
    else if (ratio === 'custom') {
      const currentProportion = settings.tileHeight / settings.tileWidth;
      height = Math.round(widthPreset * currentProportion);
    }

    setSettings(prev => ({
      ...prev,
      tileWidth: widthPreset,
      tileHeight: height
    }));
  };

  const backgroundPresets = [
    '#16171B', // Theme Dark
    '#0F1012', // Pure Charcoal
    '#1E293B', // Slate 800
    '#0B132B', // Deep Space Blue
    '#022C22', // Emerald Forest
    '#311042', // Midnight Plum
    '#1c1917', // Stone 900
    '#2E1000', // Dark Rust
  ];

  return (
    <div id="control-panel-root" className="bg-[#121317] rounded-xl border border-[#2D2F36] p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[#2D2F36] pb-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <Settings className="w-4 h-4 text-amber-500" />
            02 // PATTERN ENGINE LAYOUT
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">DIAL CONFIGURATION ALGORITHMS & GRID SCATTER DENSITY</p>
        </div>
      </div>

      {/* Quick Presets & Theme Templates */}
      <div className="space-y-2 bg-[#16171B]/60 p-3.5 border border-[#2D2F36] rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-mono">⚡ Quick Layout & Theme Presets</label>
          <span className="text-[8px] font-mono text-gray-500 uppercase">One-Click Setup</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => applyPresetTheme('spooky')}
            className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:border-red-500/40 text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer"
          >
            👻 SPOOKY RED
          </button>
          <button
            type="button"
            onClick={() => applyPresetTheme('floral')}
            className="p-1.5 rounded-lg border border-[#34d399]/20 bg-[#34d399]/5 hover:bg-[#34d399]/10 text-[#34d399] hover:border-[#34d399]/40 text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer"
          >
            🌸 PASTEL SAGE
          </button>
          <button
            type="button"
            onClick={() => applyPresetTheme('memphis')}
            className="p-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 hover:border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer"
          >
            ✨ RETRO MEMPHIS
          </button>
        </div>
      </div>

      {/* Main Pattern Mode Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Pattern Distribution Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {(['grid', 'organic', 'sequence'] as PatternMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => updateSetting('mode', mode)}
              className={`p-2.5 rounded-lg border text-center transition-all cursor-[#2D2F36] pointer ${
                settings.mode === mode
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-xs'
                  : 'border-[#2D2F36] text-gray-400 bg-[#1A1B1F] hover:border-[#3D3F46]'
              }`}
            >
              <span className="text-[11px] font-mono font-bold block uppercase tracking-wider">{mode}</span>
              <span className="text-[9px] text-gray-500 mt-0.5 leading-tight block font-mono">
                {mode === 'grid' && 'GRID SNAP'}
                {mode === 'organic' && 'SCATTER'}
                {mode === 'sequence' && 'LOOP CYCLE'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio configuration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Aspect Ratio Lock</label>
          {settings.aspectRatio !== 'custom' && (
            <span className="text-[9px] font-mono text-amber-500 font-bold uppercase flex items-center gap-1 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
              <Link className="w-2.5 h-2.5" /> Ratio Locked ({settings.aspectRatio})
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {(['1:1', '16:9', '4:3', '3:2', '2:1', 'custom'] as const).map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => changeAspectRatio(ratio)}
              className={`p-1.5 rounded text-[10px] font-mono text-center transition-all cursor-pointer uppercase ${
                settings.aspectRatio === ratio
                  ? 'border border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                  : 'border border-[#2D2F36] text-gray-400 bg-[#1A1B1F] hover:border-[#3D3F46]'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Grid snaps and canvas dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Tile Unit Width (px)</label>
          <input
            type="number"
            min="32"
            max="3840"
            value={settings.tileWidth}
            onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 400)}
            className="w-full px-3 py-1.5 bg-[#1A1B1F] border border-[#2D2F36] rounded text-xs font-mono text-center text-amber-500 focus:outline-hidden focus:border-amber-500/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Tile Unit Height (px)</label>
          <input
            type="number"
            min="32"
            max="3840"
            value={settings.tileHeight}
            onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 400)}
            disabled={settings.aspectRatio !== 'custom'}
            className={`w-full px-3 py-1.5 border border-[#2D2F36] rounded text-xs font-mono text-center text-amber-500 focus:outline-hidden ${
              settings.aspectRatio !== 'custom' 
                ? 'bg-[#15161A] opacity-75 cursor-not-allowed border-dashed' 
                : 'bg-[#1A1B1F] focus:border-amber-500/50'
            }`}
          />
        </div>
      </div>

      {/* Quick Sizing Presets */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Quick Canvas Presets (Width)</label>
        <div className="grid grid-cols-4 gap-1.5">
          {([256, 512, 1024, 1600] as const).map((size) => {
            let active = settings.tileWidth === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => applySizePreset(size)}
                className={`py-1 rounded text-[10px] font-mono text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#1A1B1F] border border-[#2D2F36] text-gray-400 hover:border-gray-500'
                }`}
              >
                {size}px
                <span className="block text-[8px] opacity-70 font-sans tracking-tight">
                  {size === 256 && 'Compact'}
                  {size === 512 && 'Medium'}
                  {size === 1024 && 'Large'}
                  {size === 1600 && 'Ultra HD'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Columns x Rows & Advanced Grid Math - Only show when grid is active */}
      {(settings.mode === 'grid' || settings.mode === 'sequence' || settings.positioning === 'grid_snap') && (
        <div className="space-y-4 bg-[#16171B] border border-[#2D2F36] p-4 rounded-xl">
          <div className="border-b border-[#2D2F36] pb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-mono">Advanced Grid Controls</span>
            <span className="text-[8px] font-mono text-gray-500 uppercase">Math Matrix Mode</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Grid Columns</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={settings.gridCols}
                  onChange={(e) => updateSetting('gridCols', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-500 min-w-4 text-right font-mono">{settings.gridCols}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Grid Rows</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={settings.gridRows}
                  onChange={(e) => updateSetting('gridRows', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-500 min-w-4 text-right font-mono">{settings.gridRows}</span>
              </div>
            </div>
          </div>

          {/* Grid Type staggers */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Grid Stagger Alignment</label>
            <div className="grid grid-cols-5 gap-1">
              {([
                { value: 'standard', label: 'Align' },
                { value: 'half_drop', label: 'Drop' },
                { value: 'half_slide', label: 'Slide' },
                { value: 'diagonal', label: 'Diag' },
                { value: 'alternate_flip', label: 'Alt Flip' }
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => updateSetting('gridType', t.value)}
                  className={`py-1.5 rounded text-[10px] font-mono text-center transition-all cursor-pointer ${
                    settings.gridType === t.value
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-[#1A1B1F] border border-[#2D2F36] text-gray-400 hover:border-gray-500'
                  }`}
                  title={`${t.label} pattern distribution`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stagger Offset Ratio Slider - Only active for Drop/Slide */}
          {(settings.gridType === 'half_drop' || settings.gridType === 'half_slide') && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <label className="font-bold text-gray-400 uppercase">Stagger Shift Offset</label>
                <span className="text-amber-500 font-bold">{settings.gridOffset}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={settings.gridOffset}
                onChange={(e) => updateSetting('gridOffset', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[8px] text-gray-500 font-mono">Shift ratio between adjacent cells (e.g. 50% is standard brick lay).</p>
            </div>
          )}

          {/* Grid Rigidness / Jitter */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <label className="font-bold text-gray-400 uppercase">Grid Lock Jitter (Slack)</label>
              <span className={`font-bold ${settings.gridJitter === 0 ? 'text-[#34d399]' : 'text-amber-500'}`}>
                {settings.gridJitter === 0 ? '100% Rigid' : `${settings.gridJitter}% Jitter`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.gridJitter}
              onChange={(e) => updateSetting('gridJitter', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[8px] text-gray-500 font-mono">Displaces items slightly within cell bounds. 0% locks them completely.</p>
          </div>

          {/* Mirror Alternating Orientation Switch */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2D2F36]/50">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Mirror Alternating Flip</label>
              <p className="text-[8px] text-gray-500 font-mono">Rotates alternating items 180° for complex wallpaper layouts</p>
            </div>
            <button
              type="button"
              onClick={() => updateSetting('gridFlipAlternating', !settings.gridFlipAlternating)}
              className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                settings.gridFlipAlternating
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                  : 'bg-[#1A1B1F] border-[#2D2F36] text-gray-500'
              }`}
            >
              {settings.gridFlipAlternating ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}

      {/* Positioning options for Organic mode */}
      {settings.mode === 'organic' && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Scatter Constraints</label>
          <div className="grid grid-cols-2 gap-2">
            {(['random_constrained', 'grid_snap'] as PositioningMode[]).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => updateSetting('positioning', pos)}
                className={`py-1.5 px-3 rounded text-[11px] font-mono text-center transition-all cursor-[#2D2F36] target ${
                  settings.positioning === pos
                    ? 'border border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border border-[#2D2F36] bg-[#1A1B1F] text-gray-400 hover:border-[#3D3F46]'
                }`}
              >
                {pos === 'random_constrained' ? 'RANDOM_SCATTER' : 'GRID_SNAP_JITTER'}
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Density / Motif Count</label>
              <span className="text-xs font-mono font-bold text-amber-500">{Math.round(20 * settings.density)} items</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={settings.density}
              onChange={(e) => updateSetting('density', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Layout Jitter / Ranges Selector */}
      <div className="border-t border-[#2D2F36] pt-4 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          03 // MULTI-DIMENSIONAL JITTER
        </h3>

        {/* SCALE SECTION */}
        <div className="space-y-2.5 bg-[#16171B] p-3 border border-[#2D2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-300 font-mono">Scaling Factor</span>
            <div className="flex rounded bg-[#121317] p-0.5 border border-[#2D2F36]">
              <button
                type="button"
                onClick={() => updateSetting('scaleMode', 'fixed')}
                className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                  settings.scaleMode === 'fixed' ? 'bg-amber-500 text-black' : 'text-gray-400'
                }`}
              >
                Fixed
              </button>
              <button
                type="button"
                onClick={() => updateSetting('scaleMode', 'random')}
                className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                  settings.scaleMode === 'random' ? 'bg-amber-500 text-black' : 'text-gray-400'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {settings.scaleMode === 'fixed' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={settings.fixedScale}
                onChange={(e) => updateSetting('fixedScale', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-500 min-w-8 text-right font-mono">{settings.fixedScale}x</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Min: {settings.minScale}x</span>
                <span>Max: {settings.maxScale}x</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={settings.minScale}
                  onChange={(e) => updateSetting('minScale', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.1"
                  value={settings.maxScale}
                  onChange={(e) => updateSetting('maxScale', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* ROTATION SECTION */}
        <div className="space-y-2.5 bg-[#16171B] p-3 border border-[#2D2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-300 font-mono">Rotation (Degrees)</span>
            <div className="flex rounded bg-[#121317] p-0.5 border border-[#2D2F36]">
              <button
                type="button"
                onClick={() => updateSetting('rotationMode', 'fixed')}
                className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                  settings.rotationMode === 'fixed' ? 'bg-amber-500 text-black' : 'text-gray-400'
                }`}
              >
                Fixed
              </button>
              <button
                type="button"
                onClick={() => updateSetting('rotationMode', 'random')}
                className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                  settings.rotationMode === 'random' ? 'bg-amber-500 text-black' : 'text-gray-400'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {settings.rotationMode === 'fixed' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="360"
                value={settings.fixedRotation}
                onChange={(e) => updateSetting('fixedRotation', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-500 min-w-8 text-right font-mono">{settings.fixedRotation}°</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Min: {settings.minRotation}°</span>
                <span>Max: {settings.maxRotation}°</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={settings.minRotation}
                  onChange={(e) => updateSetting('minRotation', parseInt(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={settings.maxRotation}
                  onChange={(e) => updateSetting('maxRotation', parseInt(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* OPACITY SECTION */}
        <div className="space-y-2.5 bg-[#16171B] p-3 border border-[#2D2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-300 font-mono">Opacity (Translucency)</span>
            <div className="flex rounded bg-[#121317] p-0.5 border border-[#2D2F36]">
              <button
                type="button"
                onClick={() => updateSetting('opacityMode', 'fixed')}
                className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                  settings.opacityMode === 'fixed' ? 'bg-amber-500 text-black' : 'text-gray-400'
                }`}
              >
                Fixed
              </button>
              <button
                type="button"
                onClick={() => updateSetting('opacityMode', 'random')}
                className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                  settings.opacityMode === 'random' ? 'bg-amber-500 text-black' : 'text-gray-400'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {settings.opacityMode === 'fixed' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.fixedOpacity}
                onChange={(e) => updateSetting('fixedOpacity', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-500 min-w-8 text-right font-mono">{Math.round(settings.fixedOpacity * 100)}%</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Min: {Math.round(settings.minOpacity * 100)}%</span>
                <span>Max: {Math.round(settings.maxOpacity * 100)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={settings.minOpacity}
                  onChange={(e) => updateSetting('minOpacity', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={settings.maxOpacity}
                  onChange={(e) => updateSetting('maxOpacity', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Wrapping & Seam Treatment */}
      <div className="border-t border-[#2D2F36] pt-4 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          04 // SEAM CORRECTION & SHIELD
        </h3>

        <div className="space-y-3">
          {/* Seamless toggler */}
          <label className="flex items-center justify-between p-3.5 rounded-lg hover:bg-[#1A1B1F] border border-[#2D2F36] bg-[#16171B]/30 transition-colors cursor-pointer">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-bold text-gray-200 block uppercase font-mono tracking-wide">Seamless Edge Wrap</span>
              <span className="text-[9px] text-gray-500 block font-mono mt-0.5">DUPLICATE BORDER CROSSINGS FOR ZERO SEAMS</span>
            </div>
            <input
              type="checkbox"
              checked={settings.seamlessCorrection}
              onChange={(e) => updateSetting('seamlessCorrection', e.target.checked)}
              className="w-4 h-4 text-amber-500 accent-amber-500 rounded cursor-pointer"
            />
          </label>

          {/* Overlap collision avoidance toggler */}
          {settings.mode === 'organic' && (
            <div className="space-y-2 p-3 bg-[#16171B] rounded-lg border border-[#2D2F36]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-gray-200 block uppercase font-mono tracking-wide">Collision Avoidance</span>
                  <span className="text-[9px] text-gray-500 block font-mono">PREVENT OVERLAPS WITH DYNAMIC SPACING</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.collisionAvoidance}
                  onChange={(e) => updateSetting('collisionAvoidance', e.target.checked)}
                  className="w-4 h-4 text-amber-500 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {settings.collisionAvoidance && (
                <div className="space-y-1 pt-2 border-t border-[#2D2F36] mt-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 font-mono">
                    <span>MIN SPACING ACCENTS</span>
                    <span className="text-amber-500">{settings.collisionThreshold}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={settings.collisionThreshold}
                    onChange={(e) => updateSetting('collisionThreshold', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Coloring and styling */}
      <div className="border-t border-[#2D2F36] pt-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <Paintbrush className="w-3.5 h-3.5 text-amber-500" />
          05 // VECTOR BACKGROUND PAINT
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => {
                updateSetting('backgroundColor', e.target.value);
              }}
              className="w-8 h-8 rounded cursor-pointer border border-[#2D2F36] bg-transparent shrink-0"
              title="Custom Hex Picker"
            />
            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith('#') || val.length <= 7) {
                  updateSetting('backgroundColor', val);
                }
              }}
              placeholder="#ffffff"
              className="w-full px-3 py-1.5 bg-[#1A1B1F] border border-[#2D2F36] rounded text-xs font-mono text-amber-500 text-center"
            />
          </div>

          <div className="grid grid-cols-4 gap-1 pt-1">
            {backgroundPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateSetting('backgroundColor', preset)}
                className={`h-5 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                  settings.backgroundColor === preset ? 'ring-1 ring-amber-500 border-amber-500' : 'border-[#2D2F36]'
                }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Deterministic Seed Random generation */}
      <div className="border-t border-[#2D2F36] pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider block font-sans">06 // STOCHASTIC ENTROPY</label>
          <button
            onClick={randomizeSeed}
            className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1 hover:text-amber-400 cursor-pointer font-mono font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            RE-SEED RANDOM
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            ref={seedInputRef}
            value={settings.seed}
            onChange={(e) => updateSetting('seed', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#1A1B1F] border border-[#2D2F36] rounded text-xs font-mono font-bold text-center text-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/30"
            placeholder="Seed index (eg. 42)"
          />
        </div>
      </div>

      {/* Tiling grid helper borders */}
      <div className="border-t border-[#2D2F36] pt-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-gray-300 font-sans uppercase">Show Tile boundary lines</span>
          <input
            type="checkbox"
            checked={settings.showTileBorder}
            onChange={(e) => updateSetting('showTileBorder', e.target.checked)}
            className="w-4 h-4 text-amber-500 accent-amber-500 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}

// src/components/ControlPanel.tsx
import React, { useRef } from 'react';
import { PatternAsset, PatternSettings } from '../types';
import { DEFAULT_ASSETS } from '../utils/defaultAssets';
import { PRESETS, getPresetAssets, applyPresetSettings } from '../presets';
import {
  Settings,
  RefreshCw,
  ShieldCheck,
  Paintbrush,
  SlidersVertical,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

interface ControlPanelProps {
  settings: PatternSettings;
  setSettings: React.Dispatch<React.SetStateAction<PatternSettings>>;
  setAssets: React.Dispatch<React.SetStateAction<PatternAsset[]>>;
}

const BG_PRESETS = [
  '#16171B', '#0F1012', '#1E293B', '#0B132B',
  '#022C22', '#311042', '#1c1917', '#2E1000',
];

const CANVAS_PRESETS: Array<{ size: number; label: string }> = [
  { size: 256, label: 'Compact' },
  { size: 512, label: 'Medium' },
  { size: 1024, label: 'Large' },
  { size: 1600, label: 'Ultra HD' },
];

export default function ControlPanel({ settings, setSettings, setAssets }: ControlPanelProps) {
  const seedRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof PatternSettings>(key: K, value: PatternSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string) => {
    const next = applyPresetSettings(settings, presetName);
    setSettings(next);
    const presetAssets = getPresetAssets(DEFAULT_ASSETS, presetName);
    if (presetAssets.length > 0) {
      setAssets((prev) => [...prev, ...presetAssets]);
    }
  };

  const reseed = () => {
    update('seed', Math.floor(Math.random() * 1e5));
  };

  const handleDimension = (field: 'width' | 'height', raw: number) => {
    const value = Math.max(32, Math.min(3840, raw || 0));
    const ratio = settings.aspectRatio;
    if (ratio === 'custom') {
      update(field === 'width' ? 'tileWidth' : 'tileHeight', value);
      return;
    }
    let counterpart = value;
    if (ratio === '16:9') counterpart = Math.round(field === 'width' ? value * 9 / 16 : value * 16 / 9);
    else if (ratio === '4:3') counterpart = Math.round(field === 'width' ? value * 3 / 4 : value * 4 / 3);
    else if (ratio === '3:2') counterpart = Math.round(field === 'width' ? value * 2 / 3 : value * 3 / 2);
    else if (ratio === '2:1') counterpart = Math.round(field === 'width' ? value * 1 / 2 : value * 2);
    setSettings((prev) => ({
      ...prev,
      tileWidth: field === 'width' ? value : counterpart,
      tileHeight: field === 'height' ? value : counterpart,
    }));
  };

  const setAspectRatio = (ratio: PatternSettings['aspectRatio']) => {
    if (ratio === 'custom') {
      update('aspectRatio', ratio);
      return;
    }
    const w = settings.tileWidth;
    let h = w;
    if (ratio === '16:9') h = Math.round(w * 9 / 16);
    else if (ratio === '4:3') h = Math.round(w * 3 / 4);
    else if (ratio === '3:2') h = Math.round(w * 2 / 3);
    else if (ratio === '2:1') h = Math.round(w * 1 / 2);
    setSettings((prev) => ({ ...prev, aspectRatio: ratio, tileHeight: h }));
  };

  const applyCanvasPreset = (width: number) => {
    const ratio = settings.aspectRatio;
    let height = width;
    if (ratio === '16:9') height = Math.round(width * 9 / 16);
    else if (ratio === '4:3') height = Math.round(width * 3 / 4);
    else if (ratio === '3:2') height = Math.round(width * 2 / 3);
    else if (ratio === '2:1') height = Math.round(width * 1 / 2);
    else if (ratio === 'custom') height = Math.round(width * (settings.tileHeight / settings.tileWidth));
    setSettings((prev) => ({ ...prev, tileWidth: width, tileHeight: height }));
  };

  const showGridControls =
    settings.mode === 'grid' ||
    settings.mode === 'sequence' ||
    settings.positioning === 'grid_snap';

  const showStaggerSlider =
    settings.gridType === 'half_drop' || settings.gridType === 'half_slide';

  return (
    <div
      id="control-panel-root"
      className="bg-[#121317] rounded-xl border border-[#2D2F36] p-6 space-y-6"
    >
      <div className="flex items-center justify-between border-b border-[#2D2F36] pb-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <Settings className="w-4 h-4 text-amber-500" />
            02 // PATTERN ENGINE LAYOUT
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">
            DIAL CONFIGURATION ALGORITHMS & GRID SCATTER DENSITY
          </p>
        </div>
      </div>

      <div className="space-y-2 bg-[#16171B]/60 p-3.5 border border-[#2D2F36] rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-mono">
            ⚡ Quick Layout & Theme Presets
          </label>
          <span className="text-[8px] font-mono text-gray-500 uppercase">One-Click Setup</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {PRESETS.map((preset, idx) => {
            const tone =
              idx === 0
                ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:border-red-500/40'
                : idx === 1
                  ? 'border-[#34d399]/20 bg-[#34d399]/5 hover:bg-[#34d399]/10 text-[#34d399] hover:border-[#34d399]/40'
                  : 'border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 hover:border-cyan-500/40';
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset.name)}
                className={`p-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${tone}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
          Pattern Distribution Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['grid', 'organic', 'sequence'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => update('mode', mode)}
              className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                settings.mode === mode
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-xs'
                  : 'border-[#2D2F36] text-gray-400 bg-[#1A1B1F] hover:border-[#3D3F46]'
              }`}
            >
              <span className="text-[11px] font-mono font-bold block uppercase tracking-wider">
                {mode}
              </span>
              <span className="text-[9px] text-gray-500 mt-0.5 leading-tight block font-mono">
                {mode === 'grid' && 'GRID SNAP'}
                {mode === 'organic' && 'SCATTER'}
                {mode === 'sequence' && 'LOOP CYCLE'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
            Aspect Ratio Lock
          </label>
          {settings.aspectRatio !== 'custom' && (
            <span className="text-[9px] font-mono text-amber-500 font-bold uppercase flex items-center gap-1 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
              <LinkIcon className="w-2.5 h-2.5" />
              Ratio Locked ({settings.aspectRatio})
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {(['1:1', '16:9', '4:3', '3:2', '2:1', 'custom'] as const).map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setAspectRatio(ratio)}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
            Tile Unit Width (px)
          </label>
          <input
            type="number"
            min={32}
            max={3840}
            value={settings.tileWidth}
            onChange={(e) => handleDimension('width', parseInt(e.target.value) || 400)}
            className="w-full px-3 py-1.5 bg-[#1A1B1F] border border-[#2D2F36] rounded text-xs font-mono text-center text-amber-500 focus:outline-hidden focus:border-amber-500/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
            Tile Unit Height (px)
          </label>
          <input
            type="number"
            min={32}
            max={3840}
            value={settings.tileHeight}
            onChange={(e) => handleDimension('height', parseInt(e.target.value) || 400)}
            disabled={settings.aspectRatio !== 'custom'}
            className={`w-full px-3 py-1.5 border border-[#2D2F36] rounded text-xs font-mono text-center text-amber-500 focus:outline-hidden ${
              settings.aspectRatio !== 'custom'
                ? 'bg-[#15161A] opacity-75 cursor-not-allowed border-dashed'
                : 'bg-[#1A1B1F] focus:border-amber-500/50'
            }`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
          Quick Canvas Presets (Width)
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {CANVAS_PRESETS.map(({ size, label }) => {
            const active = settings.tileWidth === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => applyCanvasPreset(size)}
                className={`py-1 rounded text-[10px] font-mono text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#1A1B1F] border border-[#2D2F36] text-gray-400 hover:border-gray-500'
                }`}
              >
                {size}px
                <span className="block text-[8px] opacity-70 font-sans tracking-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showGridControls && (
        <div className="space-y-4 bg-[#16171B] border border-[#2D2F36] p-4 rounded-xl">
          <div className="border-b border-[#2D2F36] pb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-mono">
              Advanced Grid Controls
            </span>
            <span className="text-[8px] font-mono text-gray-500 uppercase">Math Matrix Mode</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                Grid Columns
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={settings.gridCols}
                  onChange={(e) => update('gridCols', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-500 min-w-4 text-right font-mono">
                  {settings.gridCols}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                Grid Rows
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={settings.gridRows}
                  onChange={(e) => update('gridRows', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-500 min-w-4 text-right font-mono">
                  {settings.gridRows}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
              Grid Stagger Alignment
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[
                { value: 'standard', label: 'Align' },
                { value: 'half_drop', label: 'Drop' },
                { value: 'half_slide', label: 'Slide' },
                { value: 'diagonal', label: 'Diag' },
                { value: 'alternate_flip', label: 'Alt Flip' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('gridType', value as PatternSettings['gridType'])}
                  className={`py-1.5 rounded text-[10px] font-mono text-center transition-all cursor-pointer ${
                    settings.gridType === value
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-[#1A1B1F] border border-[#2D2F36] text-gray-400 hover:border-gray-500'
                  }`}
                  title={`${label} pattern distribution`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {showStaggerSlider && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <label className="font-bold text-gray-400 uppercase">Stagger Shift Offset</label>
                <span className="text-amber-500 font-bold">{settings.gridOffset}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={settings.gridOffset}
                onChange={(e) => update('gridOffset', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[8px] text-gray-500 font-mono">
                Shift ratio between adjacent cells (e.g. 50% is standard brick lay).
              </p>
            </div>
          )}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <label className="font-bold text-gray-400 uppercase">Grid Lock Jitter (Slack)</label>
              <span
                className={`font-bold ${
                  settings.gridJitter === 0 ? 'text-[#34d399]' : 'text-amber-500'
                }`}
              >
                {settings.gridJitter === 0 ? '100% Rigid' : `${settings.gridJitter}% Jitter`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={settings.gridJitter}
              onChange={(e) => update('gridJitter', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[8px] text-gray-500 font-mono">
              Displaces items slightly within cell bounds. 0% locks them completely.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2D2F36]/50">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                Mirror Alternating Flip
              </label>
              <p className="text-[8px] text-gray-500 font-mono">
                Rotates alternating items 180° for complex wallpaper layouts
              </p>
            </div>
            <button
              type="button"
              onClick={() => update('gridFlipAlternating', !settings.gridFlipAlternating)}
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

      {settings.mode === 'organic' && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
            Scatter Constraints
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['random_constrained', 'grid_snap'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => update('positioning', pos)}
                className={`py-1.5 px-3 rounded text-[11px] font-mono text-center transition-all cursor-pointer ${
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
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">
                Density / Motif Count
              </label>
              <span className="text-xs font-mono font-bold text-amber-500">
                {Math.round(20 * settings.density)} items
              </span>
            </div>
            <input
              type="range"
              min={0.25}
              max={4}
              step={0.25}
              value={settings.density}
              onChange={(e) => update('density', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="border-t border-[#2D2F36] pt-4 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <SlidersVertical className="w-3.5 h-3.5 text-amber-500" />
          03 // MULTI-DIMENSIONAL JITTER
        </h3>

        <div className="space-y-2.5 bg-[#16171B] p-3 border border-[#2D2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-300 font-mono">Scaling Factor</span>
            <div className="flex rounded bg-[#121317] p-0.5 border border-[#2D2F36]">
              {(['fixed', 'random'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update('scaleMode', m)}
                  className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                    settings.scaleMode === m ? 'bg-amber-500 text-black' : 'text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {settings.scaleMode === 'fixed' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={settings.fixedScale}
                onChange={(e) => update('fixedScale', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-500 min-w-8 text-right font-mono">
                {settings.fixedScale}x
              </span>
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
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={settings.minScale}
                  onChange={(e) => update('minScale', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <input
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.1}
                  value={settings.maxScale}
                  onChange={(e) => update('maxScale', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2.5 bg-[#16171B] p-3 border border-[#2D2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-300 font-mono">Rotation (Degrees)</span>
            <div className="flex rounded bg-[#121317] p-0.5 border border-[#2D2F36]">
              {(['fixed', 'random'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update('rotationMode', m)}
                  className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                    settings.rotationMode === m ? 'bg-amber-500 text-black' : 'text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {settings.rotationMode === 'fixed' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={360}
                value={settings.fixedRotation}
                onChange={(e) => update('fixedRotation', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-500 min-w-8 text-right font-mono">
                {settings.fixedRotation}°
              </span>
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
                  min={-180}
                  max={180}
                  value={settings.minRotation}
                  onChange={(e) => update('minRotation', parseInt(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={settings.maxRotation}
                  onChange={(e) => update('maxRotation', parseInt(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2.5 bg-[#16171B] p-3 border border-[#2D2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-300 font-mono">Opacity (Translucency)</span>
            <div className="flex rounded bg-[#121317] p-0.5 border border-[#2D2F36]">
              {(['fixed', 'random'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update('opacityMode', m)}
                  className={`text-[9px] px-2 py-0.5 rounded cursor-pointer font-bold font-mono transition-all uppercase ${
                    settings.opacityMode === m ? 'bg-amber-500 text-black' : 'text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {settings.opacityMode === 'fixed' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={settings.fixedOpacity}
                onChange={(e) => update('fixedOpacity', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-500 min-w-8 text-right font-mono">
                {Math.round(settings.fixedOpacity * 100)}%
              </span>
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
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  value={settings.minOpacity}
                  onChange={(e) => update('minOpacity', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <input
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.05}
                  value={settings.maxOpacity}
                  onChange={(e) => update('maxOpacity', parseFloat(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#2D2F36] pt-4 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          04 // SEAM CORRECTION & SHIELD
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-lg hover:bg-[#1A1B1F] border border-[#2D2F36] bg-[#16171B]/30 transition-colors cursor-pointer">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-bold text-gray-200 block uppercase font-mono tracking-wide">
                Seamless Edge Wrap
              </span>
              <span className="text-[9px] text-gray-500 block font-mono mt-0.5">
                DUPLICATE BORDER CROSSINGS FOR ZERO SEAMS
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.seamlessCorrection}
              onChange={(e) => update('seamlessCorrection', e.target.checked)}
              className="w-4 h-4 text-amber-500 accent-amber-500 rounded cursor-pointer"
            />
          </label>
          {settings.mode === 'organic' && (
            <div className="space-y-2 p-3 bg-[#16171B] rounded-lg border border-[#2D2F36]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-gray-200 block uppercase font-mono tracking-wide">
                    Collision Avoidance
                  </span>
                  <span className="text-[9px] text-gray-500 block font-mono">
                    PREVENT OVERLAPS WITH DYNAMIC SPACING
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.collisionAvoidance}
                  onChange={(e) => update('collisionAvoidance', e.target.checked)}
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
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    value={settings.collisionThreshold}
                    onChange={(e) => update('collisionThreshold', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
              onChange={(e) => update('backgroundColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-[#2D2F36] bg-transparent shrink-0"
              title="Custom Hex Picker"
            />
            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => {
                const v = e.target.value;
                if (v.startsWith('#') || v.length <= 7) update('backgroundColor', v);
              }}
              placeholder="#ffffff"
              className="w-full px-3 py-1.5 bg-[#1A1B1F] border border-[#2D2F36] rounded text-xs font-mono text-amber-500 text-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-1 pt-1">
            {BG_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => update('backgroundColor', c)}
                className={`h-5 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                  settings.backgroundColor === c
                    ? 'ring-1 ring-amber-500 border-amber-500'
                    : 'border-[#2D2F36]'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#2D2F36] pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider block font-sans">
            06 // STOCHASTIC ENTROPY
          </label>
          <button
            onClick={reseed}
            className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1 hover:text-amber-400 cursor-pointer font-mono"
          >
            <RefreshCw className="w-3 h-3" />
            RE-SEED RANDOM
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            ref={seedRef}
            value={settings.seed}
            onChange={(e) => update('seed', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#1A1B1F] border border-[#2D2F36] rounded text-xs font-mono font-bold text-center text-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/30"
            placeholder="Seed index (eg. 42)"
          />
        </div>
      </div>

      <div className="border-t border-[#2D2F36] pt-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-gray-300 font-sans uppercase">
            Show Tile boundary lines
          </span>
          <input
            type="checkbox"
            checked={settings.showTileBorder}
            onChange={(e) => update('showTileBorder', e.target.checked)}
            className="w-4 h-4 text-amber-500 accent-amber-500 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
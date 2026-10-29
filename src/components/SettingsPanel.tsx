import { PatternSettings } from '../types';
import { PRESETS } from '../presets';
import { ChoiceButton, Group, NumberField, Panel, Segmented, Slider, Toggle, clamp } from './Controls';
import { RefreshCw, Settings } from 'lucide-react';

interface SettingsPanelProps {
  settings: PatternSettings;
  onChange: (patch: Partial<PatternSettings>) => void;
  onPreset: (name: string) => void;
}

const LOCKED_ASPECTS = {
  '1:1': 1,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
  '2:1': 2,
} as const;

type LockedAspect = keyof typeof LOCKED_ASPECTS;

const isLocked = (ratio: PatternSettings['aspectRatio']): ratio is LockedAspect =>
  ratio !== 'custom';

const CANVAS_PRESETS = [
  { size: 256, label: 'Compact' },
  { size: 512, label: 'Medium' },
  { size: 1024, label: 'Large' },
  { size: 1600, label: 'Ultra' },
] as const;

const GRID_TYPES: ReadonlyArray<{ value: PatternSettings['gridType']; label: string; hint: string }> = [
  { value: 'standard', label: 'Align', hint: 'Aligned rows and columns' },
  { value: 'half_drop', label: 'Drop', hint: 'Every other column shifted down' },
  { value: 'half_slide', label: 'Slide', hint: 'Every other row shifted sideways' },
  { value: 'diagonal', label: 'Diag', hint: 'Stair-stepped diagonal layout' },
  { value: 'alternate_flip', label: 'Flip', hint: 'Rows offset with mirrored items' },
];

const BG_PRESETS = [
  '#16171B',
  '#0F1012',
  '#1E293B',
  '#0B132B',
  '#022C22',
  '#311042',
  '#1C1917',
  '#2E1000',
] as const;

export default function SettingsPanel({ settings, onChange, onPreset }: SettingsPanelProps) {
  const setWidth = (value: number) => {
    const width = clamp(Math.round(value), 32, 3840);
    if (!isLocked(settings.aspectRatio)) {
      onChange({ tileWidth: width });
      return;
    }
    onChange({
      tileWidth: width,
      tileHeight: clamp(Math.round(width / LOCKED_ASPECTS[settings.aspectRatio]), 32, 3840),
    });
  };

  const setHeight = (value: number) => {
    const height = clamp(Math.round(value), 32, 3840);
    if (!isLocked(settings.aspectRatio)) {
      onChange({ tileHeight: height });
      return;
    }
    onChange({
      tileHeight: height,
      tileWidth: clamp(Math.round(height * LOCKED_ASPECTS[settings.aspectRatio]), 32, 3840),
    });
  };

  const setAspect = (ratio: PatternSettings['aspectRatio']) => {
    if (!isLocked(ratio)) {
      onChange({ aspectRatio: ratio });
      return;
    }
    onChange({
      aspectRatio: ratio,
      tileHeight: clamp(Math.round(settings.tileWidth / LOCKED_ASPECTS[ratio]), 32, 3840),
    });
  };

  const setCanvasWidth = (width: number) => {
    const target = clamp(width, 32, 3840);
    if (!isLocked(settings.aspectRatio)) {
      const ratio = settings.tileWidth > 0 ? settings.tileHeight / settings.tileWidth : 1;
      onChange({ tileWidth: target, tileHeight: clamp(Math.round(target * ratio), 32, 3840) });
      return;
    }
    onChange({
      tileWidth: target,
      tileHeight: clamp(Math.round(target / LOCKED_ASPECTS[settings.aspectRatio]), 32, 3840),
    });
  };

  const showGrid = settings.mode !== 'organic' || settings.positioning === 'grid_snap';
  const showStagger = settings.gridType === 'half_drop' || settings.gridType === 'half_slide';

  return (
    <Panel title="Settings" subtitle="Layout, variation & seams" icon={<Settings className="h-4 w-4" />}>
      <Group title="Presets">
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onPreset(preset.name)}
              className="rounded-md border border-line bg-ink/60 px-1.5 py-2 font-mono text-[9px] uppercase leading-tight tracking-wide text-zinc-300 transition hover:border-accent/60 hover:text-white"
              title={`Apply the ${preset.label} preset`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Layout">
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { value: 'grid', title: 'Grid', hint: 'snap' },
              { value: 'organic', title: 'Scatter', hint: 'free' },
              { value: 'sequence', title: 'Cycle', hint: 'loop' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange({ mode: mode.value })}
              aria-pressed={settings.mode === mode.value}
              className={`rounded-md border px-1 py-2 text-center transition ${
                settings.mode === mode.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line bg-ink/60 text-muted hover:border-line-2 hover:text-white'
              }`}
            >
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wide">
                {mode.title}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase opacity-60">
                {mode.hint}
              </span>
            </button>
          ))}
        </div>

        {settings.mode === 'organic' ? (
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">
              Placement
            </span>
            <Segmented
              value={settings.positioning}
              onChange={(value) => onChange({ positioning: value })}
              options={
                [
                  { value: 'random_constrained', label: 'Random' },
                  { value: 'grid_snap', label: 'Grid snap' },
                ] as const
              }
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">
            Aspect ratio
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['1:1', '16:9', '4:3', '3:2', '2:1', 'custom'] as const).map((ratio) => (
              <ChoiceButton
                key={ratio}
                active={settings.aspectRatio === ratio}
                onClick={() => setAspect(ratio)}
              >
                {ratio}
              </ChoiceButton>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="Tile width"
            value={settings.tileWidth}
            min={32}
            max={3840}
            suffix="px"
            onChange={setWidth}
          />
          <NumberField
            label="Tile height"
            value={settings.tileHeight}
            min={32}
            max={3840}
            suffix="px"
            disabled={settings.aspectRatio !== 'custom'}
            onChange={setHeight}
          />
        </div>

        <div className="space-y-1.5">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">
            Quick sizes
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {CANVAS_PRESETS.map((preset) => (
              <button
                key={preset.size}
                type="button"
                onClick={() => setCanvasWidth(preset.size)}
                className={`rounded-md border px-1 py-1 text-center transition ${
                  settings.tileWidth === preset.size
                    ? 'border-accent bg-accent font-bold text-black'
                    : 'border-line bg-ink/60 text-muted hover:border-line-2 hover:text-white'
                }`}
              >
                <span className="block font-mono text-[10px]">{preset.size}</span>
                <span className="block text-[8px] uppercase opacity-70">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Group>

      {showGrid ? (
        <Group title="Grid">
          <Slider
            label="Columns"
            value={settings.gridCols}
            min={1}
            max={16}
            onChange={(value) => onChange({ gridCols: value })}
          />
          <Slider
            label="Rows"
            value={settings.gridRows}
            min={1}
            max={16}
            onChange={(value) => onChange({ gridRows: value })}
          />

          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">
              Stagger
            </span>
            <div className="grid grid-cols-5 gap-1">
              {GRID_TYPES.map((type) => (
                <ChoiceButton
                  key={type.value}
                  active={settings.gridType === type.value}
                  onClick={() => onChange({ gridType: type.value })}
                  title={type.hint}
                >
                  {type.label}
                </ChoiceButton>
              ))}
            </div>
          </div>

          {showStagger ? (
            <Slider
              label="Stagger offset"
              value={settings.gridOffset}
              min={10}
              max={90}
              step={5}
              display={`${settings.gridOffset}%`}
              hint="How far each alternating row or column shifts. 50% is a classic brick lay."
              onChange={(value) => onChange({ gridOffset: value })}
            />
          ) : null}

          <Slider
            label="Slack"
            value={settings.gridJitter}
            min={0}
            max={100}
            step={5}
            display={settings.gridJitter === 0 ? 'Rigid' : `${settings.gridJitter}%`}
            hint="Lets each motif drift inside its cell. Zero keeps the grid perfectly locked."
            onChange={(value) => onChange({ gridJitter: value })}
          />

          <Toggle
            label="Mirror alternating items"
            hint="Flips every other motif 180° for denser, more varied wallpapers."
            checked={settings.gridFlipAlternating}
            onChange={(value) => onChange({ gridFlipAlternating: value })}
          />
        </Group>
      ) : null}

      <Group title="Variation">
        <div className="space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">Scale</span>
          <Segmented
            value={settings.scaleMode}
            onChange={(value) => onChange({ scaleMode: value })}
            options={
              [
                { value: 'fixed', label: 'Fixed' },
                { value: 'random', label: 'Random' },
              ] as const
            }
          />
          {settings.scaleMode === 'fixed' ? (
            <Slider
              label="Size"
              value={settings.fixedScale}
              min={0.1}
              max={10}
              step={0.1}
              display={`${settings.fixedScale.toFixed(1)}×`}
              onChange={(value) => onChange({ fixedScale: value })}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Min"
                value={settings.minScale}
                min={0.1}
                max={5}
                step={0.1}
                display={`${settings.minScale.toFixed(1)}×`}
                onChange={(value) =>
                  onChange({ minScale: Math.min(value, settings.maxScale) })
                }
              />
              <Slider
                label="Max"
                value={settings.maxScale}
                min={0.5}
                max={10}
                step={0.1}
                display={`${settings.maxScale.toFixed(1)}×`}
                onChange={(value) =>
                  onChange({ maxScale: Math.max(value, settings.minScale) })
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">
            Rotation
          </span>
          <Segmented
            value={settings.rotationMode}
            onChange={(value) => onChange({ rotationMode: value })}
            options={
              [
                { value: 'fixed', label: 'Fixed' },
                { value: 'random', label: 'Random' },
              ] as const
            }
          />
          {settings.rotationMode === 'fixed' ? (
            <Slider
              label="Angle"
              value={settings.fixedRotation}
              min={0}
              max={360}
              display={`${settings.fixedRotation}°`}
              onChange={(value) => onChange({ fixedRotation: value })}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Min"
                value={settings.minRotation}
                min={-180}
                max={180}
                display={`${settings.minRotation}°`}
                onChange={(value) =>
                  onChange({ minRotation: Math.min(value, settings.maxRotation) })
                }
              />
              <Slider
                label="Max"
                value={settings.maxRotation}
                min={0}
                max={360}
                display={`${settings.maxRotation}°`}
                onChange={(value) =>
                  onChange({ maxRotation: Math.max(value, settings.minRotation) })
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">
            Opacity
          </span>
          <Segmented
            value={settings.opacityMode}
            onChange={(value) => onChange({ opacityMode: value })}
            options={
              [
                { value: 'fixed', label: 'Fixed' },
                { value: 'random', label: 'Random' },
              ] as const
            }
          />
          {settings.opacityMode === 'fixed' ? (
            <Slider
              label="Opacity"
              value={settings.fixedOpacity}
              min={0.1}
              max={1}
              step={0.05}
              display={`${Math.round(settings.fixedOpacity * 100)}%`}
              onChange={(value) => onChange({ fixedOpacity: value })}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Min"
                value={settings.minOpacity}
                min={0.1}
                max={0.8}
                step={0.05}
                display={`${Math.round(settings.minOpacity * 100)}%`}
                onChange={(value) =>
                  onChange({ minOpacity: Math.min(value, settings.maxOpacity) })
                }
              />
              <Slider
                label="Max"
                value={settings.maxOpacity}
                min={0.5}
                max={1}
                step={0.05}
                display={`${Math.round(settings.maxOpacity * 100)}%`}
                onChange={(value) =>
                  onChange({ maxOpacity: Math.max(value, settings.minOpacity) })
                }
              />
            </div>
          )}
        </div>

        {settings.mode === 'organic' ? (
          <Slider
            label="Density"
            value={settings.density}
            min={0.25}
            max={4}
            step={0.25}
            display={`${Math.round(20 * settings.density)} motifs`}
            onChange={(value) => onChange({ density: value })}
          />
        ) : null}
      </Group>

      <Group title="Seams" className="border-t border-line pt-4">
        <Toggle
          label="Seamless edge wrap"
          hint="Duplicates motifs that cross the border so the tile repeats without gaps."
          checked={settings.seamlessCorrection}
          onChange={(value) => onChange({ seamlessCorrection: value })}
        />

        {settings.mode === 'organic' ? (
          <>
            <Toggle
              label="Collision avoidance"
              hint="Nudges motifs apart so they keep breathing room."
              checked={settings.collisionAvoidance}
              onChange={(value) => onChange({ collisionAvoidance: value })}
            />
            {settings.collisionAvoidance ? (
              <Slider
                label="Minimum spacing"
                value={settings.collisionThreshold}
                min={0.5}
                max={2.5}
                step={0.1}
                display={`${settings.collisionThreshold.toFixed(1)}×`}
                onChange={(value) => onChange({ collisionThreshold: value })}
              />
            ) : null}
          </>
        ) : null}
      </Group>

      <Group title="Canvas">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(event) => onChange({ backgroundColor: event.target.value })}
            className="h-8 w-9 shrink-0 cursor-pointer rounded border border-line bg-transparent"
            title="Pick a background colour"
          />
          <input
            type="text"
            value={settings.backgroundColor}
            onChange={(event) => {
              const value = event.target.value;
              if (value.startsWith('#') || value.length <= 7) {
                onChange({ backgroundColor: value });
              }
            }}
            placeholder="#16171B"
            className="w-full rounded-md border border-line bg-ink px-2 py-1.5 text-center font-mono text-xs text-accent outline-none transition focus:border-accent/60"
          />
        </div>
        <div className="grid grid-cols-8 gap-1">
          {BG_PRESETS.map((colour) => (
            <button
              key={colour}
              type="button"
              onClick={() => onChange({ backgroundColor: colour })}
              className={`h-5 rounded border transition ${
                settings.backgroundColor === colour
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-line hover:border-line-2'
              }`}
              style={{ backgroundColor: colour }}
              title={colour}
            />
          ))}
        </div>
        <Toggle
          label="Show tile boundary"
          hint="Draws a dashed outline where the tile repeats."
          checked={settings.showTileBorder}
          onChange={(value) => onChange({ showTileBorder: value })}
        />
      </Group>

      <Group title="Seed">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <NumberField
              label="Seed"
              value={settings.seed}
              onChange={(value) => onChange({ seed: Math.round(value) })}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange({ seed: Math.floor(Math.random() * 100000) })}
            className="flex h-[34px] items-center gap-1.5 rounded-md border border-line bg-ink/60 px-2.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent transition hover:border-accent/60 hover:text-white"
            title="Pick a new random seed"
          >
            <RefreshCw className="h-3 w-3" />
            New
          </button>
        </div>
        <p className="font-mono text-[10px] leading-relaxed text-zinc-500">
          The same seed and settings always produce the same arrangement.
        </p>
      </Group>
    </Panel>
  );
}

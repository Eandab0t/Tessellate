import { PatternSettings } from '../types';
import { ChoiceButton, Group, NumberField, Segmented, Slider, Toggle, clamp } from './Controls';
import { LayoutGrid, RefreshCw, Repeat, Sparkles } from 'lucide-react';

interface SettingsPanelProps {
  section: 'canvas' | 'style';
  settings: PatternSettings;
  onChange: (patch: Partial<PatternSettings>) => void;
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
  '#F4F2ED',
  '#E6F0EB',
  '#FDF2F8',
  '#FEF9C3',
  '#E0E7FF',
  '#FFE4E6',
  '#DCFCE7',
  '#FFFFFF',
] as const;

const MODES = [
  { value: 'grid', label: 'Grid', hint: 'Rows & columns', Icon: LayoutGrid },
  { value: 'organic', label: 'Scatter', hint: 'Free placement', Icon: Sparkles },
  { value: 'sequence', label: 'Cycle', hint: 'Loops assets', Icon: Repeat },
] as const;

export default function SettingsPanel({ section, settings, onChange }: SettingsPanelProps) {
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

  if (section === 'canvas') {
    return (
      <div className="space-y-6">
        <Group title="Arrangement">
          <div className="grid grid-cols-3 gap-1.5">
            {MODES.map(({ value, label, hint, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ mode: value })}
                aria-pressed={settings.mode === value}
                className={`rounded-xl border p-2 text-left transition ${
                  settings.mode === value
                    ? 'border-accent bg-accent-soft'
                    : 'border-line bg-card hover:border-line-2'
                }`}
              >
                <Icon
                  className={`mb-1 h-3.5 w-3.5 ${
                    settings.mode === value ? 'text-accent' : 'text-faint'
                  }`}
                />
                <span className="block text-[11px] font-bold text-ink">{label}</span>
                <span className="block text-[9px] font-medium uppercase tracking-wide text-faint">
                  {hint}
                </span>
              </button>
            ))}
          </div>

          {settings.mode === 'organic' ? (
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
          ) : null}
        </Group>

        <Group title="Tile size">
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

          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="Width"
              value={settings.tileWidth}
              min={32}
              max={3840}
              suffix="px"
              onChange={setWidth}
            />
            <NumberField
              label="Height"
              value={settings.tileHeight}
              min={32}
              max={3840}
              suffix="px"
              disabled={settings.aspectRatio !== 'custom'}
              onChange={setHeight}
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {CANVAS_PRESETS.map((preset) => (
              <button
                key={preset.size}
                type="button"
                onClick={() => setCanvasWidth(preset.size)}
                className={`rounded-lg border px-1 py-1.5 text-center transition ${
                  settings.tileWidth === preset.size
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-line bg-card text-muted hover:border-line-2 hover:text-ink'
                }`}
              >
                <span className="block font-mono text-[10px] font-semibold">{preset.size}</span>
                <span className="block text-[8px] font-semibold uppercase tracking-wide opacity-70">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </Group>

        {showGrid ? (
          <Group title="Grid">
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-5 gap-1">
              {GRID_TYPES.map((type) => (
                <ChoiceButton
                  key={type.value}
                  active={settings.gridType === type.value}
                  onClick={() => onChange({ gridType: type.value })}
                  title={type.hint}
                  className="px-1"
                >
                  {type.label}
                </ChoiceButton>
              ))}
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

        <Group title="Seams">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Group title="Scale">
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
              onChange={(value) => onChange({ minScale: Math.min(value, settings.maxScale) })}
            />
            <Slider
              label="Max"
              value={settings.maxScale}
              min={0.5}
              max={10}
              step={0.1}
              display={`${settings.maxScale.toFixed(1)}×`}
              onChange={(value) => onChange({ maxScale: Math.max(value, settings.minScale) })}
            />
          </div>
        )}
      </Group>

      <Group title="Rotation">
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
              onChange={(value) => onChange({ minRotation: Math.min(value, settings.maxRotation) })}
            />
            <Slider
              label="Max"
              value={settings.maxRotation}
              min={0}
              max={360}
              display={`${settings.maxRotation}°`}
              onChange={(value) => onChange({ maxRotation: Math.max(value, settings.minRotation) })}
            />
          </div>
        )}
      </Group>

      <Group title="Opacity">
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
              onChange={(value) => onChange({ minOpacity: Math.min(value, settings.maxOpacity) })}
            />
            <Slider
              label="Max"
              value={settings.maxOpacity}
              min={0.5}
              max={1}
              step={0.05}
              display={`${Math.round(settings.maxOpacity * 100)}%`}
              onChange={(value) => onChange({ maxOpacity: Math.max(value, settings.minOpacity) })}
            />
          </div>
        )}
      </Group>

      {settings.mode === 'organic' ? (
        <Group title="Density">
          <Slider
            label="Motifs on canvas"
            value={settings.density}
            min={0.25}
            max={4}
            step={0.25}
            display={`${Math.round(20 * settings.density)}`}
            onChange={(value) => onChange({ density: value })}
          />
        </Group>
      ) : null}

      <Group title="Background">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(event) => onChange({ backgroundColor: event.target.value })}
            className="h-9 w-12 shrink-0 rounded-lg"
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
            placeholder="#F4F2ED"
            className="w-full rounded-xl border border-line bg-paper/60 px-2.5 py-2 text-center font-mono text-xs font-semibold text-ink outline-none transition focus:border-accent/60 focus:bg-card focus:ring-2 focus:ring-accent/15"
          />
        </div>
        <div className="grid grid-cols-8 gap-1">
          {BG_PRESETS.map((colour) => (
            <button
              key={colour}
              type="button"
              onClick={() => onChange({ backgroundColor: colour })}
              className={`h-6 rounded-lg border transition ${
                settings.backgroundColor.toLowerCase() === colour.toLowerCase()
                  ? 'border-accent ring-2 ring-accent ring-offset-1'
                  : 'border-line-2/60 hover:border-line-2'
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
            className="flex h-[38px] items-center gap-1.5 rounded-xl border border-line bg-card px-3 text-[11px] font-semibold text-accent transition hover:border-accent/60"
            title="Pick a new random seed"
          >
            <RefreshCw className="h-3 w-3" />
            New
          </button>
        </div>
        <p className="text-[11px] leading-snug text-faint">
          The same seed and settings always produce the same arrangement.
        </p>
      </Group>
    </div>
  );
}

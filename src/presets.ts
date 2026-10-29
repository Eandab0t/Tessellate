import { DEFAULT_ASSETS } from './utils/defaultAssets';
import { PatternAsset, PatternSettings } from './types';

export interface Preset {
  name: string;
  label: string;
  settings: Partial<PatternSettings>;
  assetIds: string[];
}

export const PRESETS: Preset[] = [
  {
    name: 'spooky',
    label: '👻 Spooky red',
    settings: {
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
      opacityMode: 'fixed',
      fixedOpacity: 1.0,
      rotationMode: 'fixed',
      fixedRotation: 0,
    },
    assetIds: ['spooky-spiral', 'spooky-grin', 'spooky-ghost', 'spooky-boxy'],
  },
  {
    name: 'floral',
    label: '🌸 Pastel sage',
    settings: {
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
      opacityMode: 'fixed',
      fixedOpacity: 1.0,
      rotationMode: 'random',
      minRotation: -15,
      maxRotation: 15,
    },
    assetIds: ['default-flower', 'default-circle-ring', 'default-star'],
  },
  {
    name: 'memphis',
    label: '✨ Retro memphis',
    settings: {
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
      opacityMode: 'fixed',
      fixedOpacity: 0.95,
      rotationMode: 'random',
    },
    assetIds: ['default-circle-ring', 'default-blob', 'default-star'],
  },
];

/** Settings for a preset, applied on top of the current ones. */
export function presetSettings(name: string, current: PatternSettings): PatternSettings {
  const preset = PRESETS.find((candidate) => candidate.name === name);
  return preset ? { ...current, ...preset.settings } : current;
}

/** The default motifs a preset needs, in a stable order. */
export function presetAssets(name: string): PatternAsset[] {
  const preset = PRESETS.find((candidate) => candidate.name === name);
  if (!preset) return [];
  return preset.assetIds
    .map((id) => DEFAULT_ASSETS.find((asset) => asset.id === id))
    .filter((asset): asset is PatternAsset => Boolean(asset));
}

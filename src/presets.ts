// src/presets.ts
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
    label: '👻 SPOOKY RED',
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
    label: '🌸 PASTEL SAGE',
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
    label: '✨ RETRO MEMPHIS',
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

let presetAssetCounter = 0;

export function getPresetAssets(
  defaultAssets: PatternAsset[],
  presetName: string,
): PatternAsset[] {
  const preset = PRESETS.find((p) => p.name === presetName);
  if (!preset) return [];
  return defaultAssets
    .filter((a) => preset.assetIds.includes(a.id))
    .map((a) => {
      presetAssetCounter += 1;
      return { ...a, id: `${presetName}-theme-asset-${presetAssetCounter}` };
    });
}

export function applyPresetSettings(
  current: PatternSettings,
  presetName: string,
): Partial<PatternSettings> {
  const preset = PRESETS.find((p) => p.name === presetName);
  if (!preset) return {};
  return { ...current, ...preset.settings } as PatternSettings;
}
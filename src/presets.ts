/**
 * Preset configurations for the pattern generator.
 * Extracted from ControlPanel.tsx for maintainability.
 */

import { PatternSettings, PatternAsset } from '../types';

interface Preset {
  name: string;
  label: string;
  settings: Partial<PatternSettings>;
  assetIds: string[];
}

/** Built-in presets */
export const PRESETS: Preset[] = [
  {
    name: 'spooky',
    label: '🎃 Spooky Grid',
    settings: {
      mode: 'grid' as const,
      gridCols: 4,
      gridRows: 4,
      gridType: 'half_drop' as const,
      gridOffset: 50,
      gridJitter: 5,
      gridFlipAlternating: true,
      backgroundColor: '#0F1012',
      scaleMode: 'fixed' as const,
      fixedScale: 1.0,
      opacityMode: 'fixed' as const,
      fixedOpacity: 1.0,
      rotationMode: 'fixed' as const,
      fixedRotation: 0,
    },
    assetIds: ['spooky-spiral', 'spooky-grin', 'spooky-ghost', 'spooky-boxy'],
  },
  {
    name: 'floral',
    label: '🌸 Floral Grid',
    settings: {
      mode: 'grid' as const,
      gridCols: 4,
      gridRows: 4,
      gridType: 'half_slide' as const,
      gridOffset: 50,
      gridJitter: 0,
      gridFlipAlternating: true,
      backgroundColor: '#E6F0EB',
      scaleMode: 'fixed' as const,
      fixedScale: 1.0,
      opacityMode: 'fixed' as const,
      fixedOpacity: 1.0,
      rotationMode: 'random' as const,
      minRotation: -15,
      maxRotation: 15,
    },
    assetIds: ['default-flower', 'default-circle-ring', 'default-star'],
  },
  {
    name: 'memphis',
    label: '🎨 Memphis Scatter',
    settings: {
      mode: 'organic' as const,
      positioning: 'grid_snap' as const,
      gridCols: 5,
      gridRows: 5,
      gridType: 'standard' as const,
      gridJitter: 35,
      gridFlipAlternating: false,
      backgroundColor: '#1E293B',
      scaleMode: 'random' as const,
      minScale: 0.7,
      maxScale: 1.3,
      collisionAvoidance: true,
      collisionThreshold: 1.1,
      opacityMode: 'fixed' as const,
      fixedOpacity: 0.95,
    },
    assetIds: ['default-spiral', 'default-square', 'default-heart'],
  },
];

/** Get preset assets from DEFAULT_ASSETS */
export function getPresetAssets(defaultAssets: PatternAsset[], presetName: string): PatternAsset[] {
  const preset = PRESETS.find((p) => p.name === presetName);
  if (!preset) return [];
  
  const ids = preset.assetIds;
  return defaultAssets
    .filter((a) => ids.includes(a.id))
    .map((a, i) => ({ ...a, id: ${presetName}-theme-- }));
}

/** Apply a preset's settings to current state */
export function applyPresetSettings(current: PatternSettings, presetName: string): Partial<PatternSettings> {
  const preset = PRESETS.find((p) => p.name === presetName);
  return preset ? preset.settings : {};
}
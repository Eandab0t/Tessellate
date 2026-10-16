/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatternAsset {
  id: string;
  name: string;
  dataUrl: string; // Embeddable base64 or SVG content
  width: number;
  height: number;
  type: 'svg' | 'raster';
  isDefault?: boolean;
}

export type PatternMode = 'grid' | 'organic' | 'sequence';

export type PositioningMode = 'random_constrained' | 'grid_snap';

export interface PatternSettings {
  mode: PatternMode;
  positioning: PositioningMode;
  tileWidth: number;
  tileHeight: number;
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:2' | '2:1' | 'custom';
  gridCols: number;
  gridRows: number;
  
  // Scale range
  minScale: number;
  maxScale: number;
  scaleMode: 'fixed' | 'random';
  fixedScale: number;

  // Rotation range
  minRotation: number;
  maxRotation: number;
  rotationMode: 'fixed' | 'random';
  fixedRotation: number;

  // Opacity range
  minOpacity: number;
  maxOpacity: number;
  opacityMode: 'fixed' | 'random';
  fixedOpacity: number;

  // Seamless & Advanced
  seamlessCorrection: boolean;
  edgeBleed: number; // visual offset overlap multiplier or extra distance
  collisionAvoidance: boolean; // items don't overlap too much
  collisionThreshold: number; // min spacing multiplier
  
  // Advanced Grid Settings
  gridType: 'standard' | 'half_drop' | 'half_slide' | 'diagonal' | 'alternate_flip';
  gridJitter: number; // 0 to 100 percentage
  gridOffset: number; // 0 to 100 percentage
  gridFlipAlternating: boolean;

  seed: number;
  density: number; // density multiplier for items (e.g. total items to scatter in organic mode)
  backgroundColor: string;
  showTileBorder: boolean; // for previewing tile boundaries
}

export interface PlacedInstance {
  id: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  
  // Seamless clone metadata
  isClone: boolean;
  parentInstanceId?: string;
  offsetX?: number; // Shift applied on X for wrap-around
  offsetY?: number; // Shift applied on Y for wrap-around
}

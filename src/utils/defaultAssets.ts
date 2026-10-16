/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatternAsset } from '../types';

// Encodes clean vector paths into browser-safe UTF-8 SVG data URLs
const createSvgDataUrl = (svgContent: string) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

export const DEFAULT_ASSETS: PatternAsset[] = [
  {
    id: 'default-sparkle',
    name: 'Modern Sparkle.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M32 0C32 17.6731 17.6731 32 0 32C17.6731 32 32 46.3269 32 64C32 46.3269 46.3269 32 64 32C46.3269 32 32 17.6731 32 0Z" fill="#6366F1" />
      </svg>
    `.trim())
  },
  {
    id: 'default-flower',
    name: 'Minimal Flower.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <g fill="#F43F5E">
          <circle cx="32" cy="18" r="12" />
          <circle cx="32" cy="46" r="12" />
          <circle cx="18" cy="32" r="12" />
          <circle cx="46" cy="32" r="12" />
          <circle cx="32" cy="32" r="14" fill="#FEE2E2" />
          <circle cx="32" cy="32" r="8" fill="#F59E0B" />
        </g>
      </svg>
    `.trim())
  },
  {
    id: 'default-leaf',
    name: 'Monstera Leaf.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M32 6C16 6 8 18 8 36C8 46 16 54 32 58C48 54 56 46 56 36C56 18 48 6 32 6ZM28 14C29 16 29 20 27 24C25 28 20 30 16 31C17 25 21 17 28 14ZM48 31C44 30 39 28 37 24C35 20 35 16 36 14C43 17 47 25 48 31ZM14 38C14 37 15 36 17 36C22 36 26 40 28 44C25 46 19 47 14 38ZM50 38C45 47 39 46 36 44C38 40 42 36 47 36C49 36 50 37 50 38Z" fill="#10B981" />
      </svg>
    `.trim())
  },
  {
    id: 'default-crescent',
    name: 'Golden Crescent.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M42 8C27.64 8 16 19.64 16 34C16 48.36 27.64 60 42 60C45.33 60 48.51 59.38 51.44 58.24C37.89 54.84 28 42.58 28 28C28 18.66 33.15 10.5 40.83 6.13C36.6 4.79 32.1 4 27.64 4M42 8C43.33 8 44.66 8.08 45.96 8.24C34.39 12.18 26 23.11 26 36C26 48.89 34.39 59.82 45.96 63.76C44.66 63.92 43.33 64 42 64C25.43 64 12 50.57 12 34C12 17.43 25.43 10 42 8Z" fill="#F59E0B" />
      </svg>
    `.trim())
  },
  {
    id: 'default-blob',
    name: 'Liquid Blob.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M32 4C45 4 58 13 58 28C58 43 45 58 30 58C15 58 6 46 6 32C6 18 19 4 32 4ZM20 22C22 22 24 20 24 18C24 16 22 14 20 14C18 14 16 16 16 18C16 20 18 22 20 22Z" fill="#8B5CF6" fill-rule="evenodd" />
      </svg>
    `.trim())
  },
  {
    id: 'default-star',
    name: 'Aesthetic Star.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <polygon points="32,2 41,23 64,32 41,41 32,62 23,41 2,32 23,23" fill="#EC4899" />
      </svg>
    `.trim())
  },
  {
    id: 'default-circle-ring',
    name: 'Retro Geo Ring.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <g fill="none" stroke="#06B6D4" stroke-width="6">
          <circle cx="32" cy="32" r="24" />
          <circle cx="32" cy="32" r="14" stroke="#D946EF" stroke-width="4" />
          <circle cx="32" cy="32" r="6" fill="#06B6D4" />
        </g>
      </svg>
    `.trim())
  },
  {
    id: 'spooky-spiral',
    name: 'Spooky Spiral Cat.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M10 8 L20 20 L44 20 L54 8 L52 38 C52 50 43 58 32 58 C21 58 12 50 12 38 Z" fill="#EF4444" />
        <path d="M 22 28 C 18 28, 18 34, 22 34 C 26 34, 26 30, 24 30 C 22 30, 22 32, 23 32" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 42 28 C 38 28, 38 34, 42 34 C 46 34, 46 30, 44 30 C 42 30, 42 32, 43 32" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 20 40 Q 32 48 44 40" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
        <polygon points="26,41 28,44 30,41" fill="#000000" />
        <polygon points="38,41 36,44 34,41" fill="#000000" />
      </svg>
    `.trim())
  },
  {
    id: 'spooky-grin',
    name: 'Indie Grin Imp.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M8 12 L16 4 L28 14 L36 14 L48 4 L56 12 L50 44 C48 54 40 60 32 60 C24 60 16 54 14 44 Z" fill="#EF4444" />
        <ellipse cx="22" cy="26" rx="6" ry="8" fill="#FFFFFF" />
        <circle cx="22" cy="26" r="3" fill="#000000" />
        <ellipse cx="42" cy="26" rx="6" ry="8" fill="#FFFFFF" />
        <circle cx="42" cy="26" r="3" fill="#000000" />
        <path d="M 18 40 C 22 48, 42 48, 46 40 Z" fill="#000000" />
        <polygon points="22,41 25,45 28,42" fill="#FFFFFF" />
        <polygon points="42,41 39,45 36,42" fill="#FFFFFF" />
      </svg>
    `.trim())
  },
  {
    id: 'spooky-ghost',
    name: 'Mischievous Ghost.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M12 32 C12 16, 20 8, 32 8 C44 8, 52 16, 52 32 C52 46, 48 56, 42 56 C38 56, 36 50, 32 50 C28 50, 26 56, 22 56 C16 56, 12 46, 12 32 Z" fill="#EF4444" />
        <ellipse cx="22" cy="28" rx="5" ry="7" fill="#000000" />
        <ellipse cx="42" cy="28" rx="5" ry="7" fill="#000000" />
        <circle cx="23" cy="28" r="1.5" fill="#FFFFFF" />
        <circle cx="43" cy="28" r="1.5" fill="#FFFFFF" />
        <path d="M 24 40 Q 32 44 40 40" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    `.trim())
  },
  {
    id: 'spooky-boxy',
    name: 'Glitch Boxy Cat.svg',
    width: 64,
    height: 64,
    type: 'svg',
    isDefault: true,
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <rect x="10" y="14" width="44" height="40" rx="6" fill="#EF4444" />
        <polygon points="10,14 6,2 22,14" fill="#EF4444" />
        <polygon points="54,14 58,2 42,14" fill="#EF4444" />
        <path d="M 18 24 L 26 24 M 22 20 L 22 28" stroke="#000000" stroke-width="3" stroke-linecap="round" />
        <rect x="36" y="20" width="8" height="8" fill="#000000" />
        <path d="M 20 42 L 24 38 L 28 42 L 32 38 L 36 42 L 40 38 L 44 42" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" />
      </svg>
    `.trim())
  }
];

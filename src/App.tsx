/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PatternAsset, PatternSettings } from './types';
import { DEFAULT_ASSETS } from './utils/defaultAssets';
import AssetManager from './components/AssetManager';
import ControlPanel from './components/ControlPanel';
import PatternPreview from './components/PatternPreview';
import { Wand2, Info } from 'lucide-react';

const INITIAL_SETTINGS: PatternSettings = {
  mode: 'organic',
  positioning: 'random_constrained',
  tileWidth: 400,
  tileHeight: 400,
  aspectRatio: '1:1',
  gridCols: 4,
  gridRows: 4,
  
  minScale: 0.4,
  maxScale: 1.1,
  scaleMode: 'random',
  fixedScale: 0.8,

  minRotation: -30,
  maxRotation: 60,
  rotationMode: 'random',
  fixedRotation: 0,

  minOpacity: 0.7,
  maxOpacity: 1.0,
  opacityMode: 'fixed',
  fixedOpacity: 1.0,

  seamlessCorrection: true,
  edgeBleed: 1.0,
  collisionAvoidance: true,
  collisionThreshold: 1.2,
  
  // Advanced Grid defaults
  gridType: 'standard',
  gridJitter: 0,
  gridOffset: 50,
  gridFlipAlternating: false,
  
  seed: 142,
  density: 1.25,
  backgroundColor: '#16171B', // Dark technical color matching the theme
  showTileBorder: true
};

export default function App() {
  // We preload first 3 beautiful starter assets to showcase the pattern flawlessly on first load
  const [assets, setAssets] = useState<PatternAsset[]>([
    DEFAULT_ASSETS[0], // sparkle
    DEFAULT_ASSETS[1], // flower
    DEFAULT_ASSETS[2], // leaf
  ]);

  const [settings, setSettings] = useState<PatternSettings>(INITIAL_SETTINGS);

  const resetToFactory = () => {
    setAssets([DEFAULT_ASSETS[0], DEFAULT_ASSETS[1], DEFAULT_ASSETS[2]]);
    setSettings(INITIAL_SETTINGS);
  };

  const loadAllDefaultPresets = () => {
    setAssets([...DEFAULT_ASSETS]);
    setSettings(prev => ({
      ...prev,
      mode: 'organic',
      density: 1.5,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-[#D1D5DB] font-sans antialiased flex flex-col selection:bg-amber-500/20 selection:text-amber-500">
      
      {/* Decorative amber system boundary line */}
      <div className="h-0.5 bg-amber-500 shrink-0" />

      {/* Main App Navigation Header */}
      <header className="bg-[#16171B] border-b border-[#2D2F36] px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-black font-sans shadow-amber-500/10 shadow-lg shrink-0">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-widest uppercase text-white">Tessellate</h1>
                <span className="px-2 py-0.5 rounded bg-[#2D2F36] text-[10px] text-amber-500 font-mono font-medium">PATTERN STUDIO</span>
              </div>
              <p className="text-[11px] text-gray-500 font-mono mt-0.5">DESIGN AND EXPORT SEAMLESS REPEATING PATTERNS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllDefaultPresets}
              className="text-xs font-bold px-3 py-1.5 text-amber-500 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-md transition-all cursor-pointer flex items-center gap-1.5"
              title="Add all native presets to create a complex organic tile"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>USE ALL PRESETS</span>
            </button>
            <button
              onClick={resetToFactory}
              className="text-xs font-bold px-3 py-1.5 text-gray-400 bg-[#2D2F36] hover:bg-[#3D3F46] hover:text-white rounded-md transition-all cursor-pointer border border-transparent"
              title="Restore the starter motifs and default settings"
            >
              RESET
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="grow px-6 py-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Assets list, Grid dials, guides */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Asset manager section */}
          <AssetManager assets={assets} setAssets={setAssets} />

          {/* Configuration Settings Box */}
          <ControlPanel settings={settings} setSettings={setSettings} setAssets={setAssets} />

          {/* Technical guide on seamless wrap cloning */}

        </section>

        {/* Right column: Sticky visualizer & exporters */}
        <section className="lg:col-span-7 lg:sticky lg:top-24 space-y-6">
          
          {/* Preview panel */}
          <PatternPreview assets={assets} settings={settings} />

          {/* Quick tips notice */}
          <div className="p-4 bg-[#1A1B1F] rounded-xl border border-[#2D2F36] text-xs text-gray-400 flex gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">READY TO USE:</p>
              <p className="mt-1 leading-relaxed">
                Use the exported <strong className="text-amber-500">SVG tile</strong> as a repeating background or bring it into your design tool. Your uploaded images stay in this browser and are embedded in the export.
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* Dynamic Grid System Info Bar */}
      <footer className="h-10 border-t border-[#2D2F36] bg-[#0A0B0E] flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono mt-auto shrink-0">
        <div className="flex space-x-6">
          <span>TESSELLATE <span className="text-gray-300">PATTERN STUDIO</span></span>
          <span><span className="text-[#34d399] font-semibold">● READY</span></span>
        </div>
        <div className="hidden md:flex space-x-6">
          <span>MOTIFS: <span className="text-amber-500">{assets.length}</span></span>
          <span>SEED: <span className="text-amber-500">0x{settings.seed.toString(16).toUpperCase()}</span></span>
        </div>
      </footer>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Grid, Shuffle, Repeat, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div id="how-it-works-container" className="bg-[#121317] rounded-xl border border-[#2D2F36] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-sans">03 // GEOMETRIC SEAM LAWS</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] font-bold px-2.5 py-1 text-amber-500 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-md transition-all cursor-pointer font-mono"
        >
          {isOpen ? 'CLOSE DIAGRAM' : 'LEARN ALGORITHM'}
        </button>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed font-sans">
        This app uses solid algebra and geometry checks to make sure your uploaded motifs wrap perfectly around boundaries. 
        When you tile the output, you will see no seams or broken gaps.
      </p>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-4 border-t border-[#2D2F36] animate-fadeIn">
          {/* Tile Wrap Mechanics */}
          <div className="bg-[#16171B] border border-[#2D2F36] rounded-lg p-4 text-xs space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 font-sans uppercase text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
              The 9-Grid Cloner
            </h4>
            <p className="text-gray-400 leading-relaxed">
              When an item crosses any border of the <strong className="text-white">W × H Tile Bounds</strong> (left, right, top, bottom, or corner), the engine calculates its visual overlap. It instantly spawns virtual duplicates at:
            </p>
            <div className="font-mono text-[9px] bg-[#121317] p-2 rounded border border-[#2D2F36] text-gray-400 grid grid-cols-3 gap-1 text-center">
              <div>(X - W, Y - H)</div>
              <div>(X, Y - H)</div>
              <div>(X + W, Y - H)</div>
              <div>(X - W, Y)</div>
              <div className="bg-amber-500/10 border border-amber-500/20 font-bold text-amber-500">PRIMARY (X, Y)</div>
              <div>(X + W, Y)</div>
              <div>(X - W, Y + H)</div>
              <div>(X, Y + H)</div>
              <div>(X + W, Y + H)</div>
            </div>
            <p className="text-gray-500 leading-relaxed italic text-[10px]">
              Only clones that actually reach inside the active tile space are included in the generated output, keeping your exported SVG code light and tidy!
            </p>
          </div>

          {/* Mode Explanations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-[11px] uppercase tracking-wider font-mono">Modes Explained</h4>
            
            <div className="flex gap-3 text-xs leading-normal">
              <div className="p-1.5 bg-[#1A1B1F] text-amber-500 rounded border border-[#2D2F36] h-fit">
                <Grid className="w-3.5 h-3.5" />
              </div>
              <div>
                <b className="text-gray-200 block font-sans">Repeating Grid</b>
                <span className="text-gray-400">Places items inside uniform rectangular subdivisions. Perfect for structured retro wallpaper patterns or neat icon sets.</span>
              </div>
            </div>

            <div className="flex gap-3 text-xs leading-normal">
              <div className="p-1.5 bg-[#1A1B1F] text-emerald-400 rounded border border-[#2D2F36] h-fit">
                <Shuffle className="w-3.5 h-3.5" />
              </div>
              <div>
                <b className="text-gray-200 block font-sans">Consistent Organic Scatter</b>
                <span className="text-gray-400">Distributes assets randomly using a seeded generator. Features custom collision avoidance so leaves or sparkles pack tightly without overlapping excessively.</span>
              </div>
            </div>

            <div className="flex gap-3 text-xs leading-normal">
              <div className="p-1.5 bg-[#1A1B1F] text-indigo-400 rounded border border-[#2D2F36] h-fit">
                <Repeat className="w-3.5 h-3.5" />
              </div>
              <div>
                <b className="text-gray-200 block font-sans">Sequence (N Images) Loop</b>
                <span className="text-gray-400">Loops uploaded files in file-name order. If you upload 10 icons, they sequence through consecutive rows/columns so every tile cycle looks unique.</span>
              </div>
            </div>
          </div>

          {/* Safety note */}
          <div className="p-3.5 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-start gap-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-300 leading-relaxed font-mono uppercase">
              <strong className="text-white font-semibold">Vector Precision Output:</strong> Every uploaded SVG works at native vector crispness. Raster files (PNG/JPG) are dynamically self-contained within safe base64 URL embeddings.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

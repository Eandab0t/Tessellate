/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { PatternAsset } from '../types';
import { Upload, X, ArrowUp, ArrowDown, Sparkles, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_ASSETS } from '../utils/defaultAssets';

interface AssetManagerProps {
  assets: PatternAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PatternAsset[]>>;
}

export default function AssetManager({ assets, setAssets }: AssetManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to load file as Base64 Data URL and infer dimensions
  const processFile = (file: File) => {
    return new Promise<PatternAsset>((resolve, reject) => {
      if (file.size > 8 * 1024 * 1024) {
        reject(new Error(`File ${file.name} exceeds the 8MB size limit.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          reject(new Error(`Failed to read file ${file.name}`));
          return;
        }

        // Dynamically compute natural dimensions
        const img = new Image();
        img.onload = () => {
          resolve({
            id: `user-asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            dataUrl,
            width: img.naturalWidth || 64,
            height: img.naturalHeight || 64,
            type: file.type === 'image/svg+xml' ? 'svg' : 'raster',
          });
        };
        img.onerror = () => {
          // Fallback if image fails loading (e.g. invalid file format)
          resolve({
            id: `user-asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            dataUrl,
            width: 64,
            height: 64,
            type: file.type === 'image/svg+xml' ? 'svg' : 'raster',
          });
        };
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error(`Failed to load ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    setErrorMsg(null);
    const validFiles = Array.from(files).filter(file => {
      const type = file.type;
      return type.startsWith('image/') || file.name.endsWith('.svg');
    });

    if (validFiles.length === 0) {
      setErrorMsg('Please upload valid image files (PNG, JPG, SVG, WebP, GIF).');
      return;
    }

    try {
      const results = await Promise.all(
        validFiles.map(file => processFile(file))
      );
      setAssets((prev) => [...prev, ...results]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file.');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const moveAsset = (index: number, direction: 'up' | 'down') => {
    setAssets((prev) => {
      const newAssets = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newAssets.length) return prev;
      
      const temp = newAssets[index];
      newAssets[index] = newAssets[targetIndex];
      newAssets[targetIndex] = temp;
      return newAssets;
    });
  };

  const addPreset = (preset: PatternAsset) => {
    // Add unique clone of the preset to selection
    const cloned = {
      ...preset,
      id: `preset-asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setAssets((prev) => [...prev, cloned]);
  };

  const addAllPresets = () => {
    const clonedPresets = DEFAULT_ASSETS.map((preset, i) => ({
      ...preset,
      id: `preset-asset-all-${i}-${Date.now()}`,
    }));
    setAssets((prev) => [...prev, ...clonedPresets]);
  };

  const clearAll = () => {
    setAssets([]);
  };

  return (
    <div id="asset-manager-root" className="bg-[#121317] rounded-xl border border-[#2D2F36] p-6 space-y-6">
      {/* Header and Action links */}
      <div className="flex items-center justify-between border-b border-[#2D2F36] pb-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <FolderOpen className="w-4 h-4 text-amber-500" />
            01 // INPUT ASSETS QUEUE
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">REGISTER PRIMARY AND REPEATING MOTIFS</p>
        </div>
        {assets.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:bg-rose-500/10 font-mono font-bold cursor-pointer py-1 px-2.5 rounded transition-all"
          >
            CLEAR QUEUE
          </button>
        )}
      </div>

      {/* Preset Starters */}
      <div className="bg-[#16171B] border border-[#2D2F36] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            BUILT-IN MOTIFS
          </span>
          <button
            onClick={addAllPresets}
            className="text-[10px] text-gray-300 hover:text-white font-mono font-bold cursor-pointer underline decoration-amber-500/50 underline-offset-2"
          >
            USE ALL MOTIFS
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEFAULT_ASSETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => addPreset(preset)}
              title={`Add ${preset.name}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1A1B1F] border border-[#2D2F36] hover:border-amber-500/50 rounded text-[11px] font-mono text-gray-300 hover:text-white hover:scale-[1.02] cursor-pointer transition-all"
            >
              <img src={preset.dataUrl} className="w-4 h-4 object-contain" alt="" aria-hidden="true" referrerPolicy="no-referrer" />
              <span>{preset.name.replace('.svg', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragOver 
            ? 'border-amber-500 bg-amber-500/10 text-white' 
            : 'border-[#2D2F36] bg-[#16171B]/30 hover:border-amber-500/40 hover:bg-[#16171B]/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelectChange}
          multiple
          accept="image/*,.svg"
          className="hidden"
        />
        <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
        <p className="text-xs font-semibold text-gray-300">DRAG & DROP VECTORS / IMAGES</p>
        <p className="text-[10px] text-gray-500 mt-1 font-mono">SVG, PNG, JPG, WEBP, GIF (MAX 8MB)</p>
      </div>

      {errorMsg && (
        <div className="text-[11px] text-rose-400 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30 font-semibold font-mono">
          ERROR // {errorMsg}
        </div>
      )}

      {/* Thumbnail List */}
      {assets.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 border-b border-[#2D2F36] pb-2">
            <span>REGISTERED ASSETS LIST ({assets.length})</span>
            <span className="italic">SEQUENCE DIRECTORY ORDER</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {assets.map((asset, index) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-2 bg-[#1A1B1F] border border-[#2D2F36] rounded-md hover:border-amber-500/30 transition-shadow group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-[#121317] rounded p-1 border border-[#2d2f36] flex items-center justify-center shrink-0">
                    <img
                      src={asset.dataUrl}
                      className="max-w-full max-h-full object-contain"
                      alt={asset.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate max-w-[150px] sm:max-w-xs">{asset.name}</p>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                      {asset.type.toUpperCase()} • {asset.width}×{asset.height}px
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Sequence Order Shifters */}
                  <button
                    onClick={() => moveAsset(index, 'up')}
                    disabled={index === 0}
                    title="Move Up in sequence"
                    className="p-1 text-gray-400 hover:text-white hover:bg-[#2D2F36] disabled:opacity-20 disabled:hover:text-gray-400 transition-colors rounded bg-[#16171B] border border-[#2D2F36] cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveAsset(index, 'down')}
                    disabled={index === assets.length - 1}
                    title="Move Down in sequence"
                    className="p-1 text-gray-400 hover:text-white hover:bg-[#2D2F36] disabled:opacity-20 disabled:hover:text-gray-400 transition-colors rounded bg-[#16171B] border border-[#2D2F36] cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  
                  {/* Delete Item */}
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    title="Delete asset"
                    className="p-1.5 text-gray-500 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-[#16171B]/50 border border-[#2D2F36] rounded-lg">
          <ImageIcon className="w-5 h-5 text-gray-600 mx-auto mb-1.5" />
          <p className="text-xs text-gray-400">Empty assets registry. Upload custom vectors to feed the engine.</p>
        </div>
      )}
    </div>
  );
}

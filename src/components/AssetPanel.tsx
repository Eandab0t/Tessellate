import React, { useRef, useState } from 'react';
import { PatternAsset } from '../types';
import { DEFAULT_ASSETS } from '../utils/defaultAssets';
import { Panel } from './Controls';
import {
  ArrowDown,
  ArrowUp,
  FolderOpen,
  Image as ImageIcon,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

interface AssetPanelProps {
  assets: PatternAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PatternAsset[]>>;
}

const MAX_FILE_BYTES = 8 * 1024 * 1024;

const newId = () => `motif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function measure(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () =>
      resolve({
        width: image.naturalWidth || 64,
        height: image.naturalHeight || 64,
      });
    image.onerror = () => resolve({ width: 64, height: 64 });
    image.src = dataUrl;
  });
}

async function toAsset(file: File): Promise<PatternAsset> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`${file.name} is larger than 8 MB.`);
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`${file.name} could not be read.`));
    reader.readAsDataURL(file);
  });

  const { width, height } = await measure(dataUrl);

  return {
    id: newId(),
    name: file.name,
    dataUrl,
    width,
    height,
    type: file.type === 'image/svg+xml' ? 'svg' : 'raster',
  };
}

export default function AssetPanel({ assets, setAssets }: AssetPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (files: FileList | File[]) => {
    setError(null);
    const valid = Array.from(files).filter(
      (file) => file.type.startsWith('image/') || /\.svg$/i.test(file.name),
    );

    if (valid.length === 0) {
      setError('Choose PNG, JPG, WebP, GIF or SVG files.');
      return;
    }

    try {
      const parsed = await Promise.all(valid.map(toAsset));
      setAssets((previous) => [...previous, ...parsed]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Those files could not be loaded.');
    }
  };

  const addMotif = (motif: PatternAsset) => {
    setAssets((previous) => [...previous, { ...motif, id: newId(), isDefault: false }]);
  };

  const addAllMotifs = () => {
    setAssets((previous) => {
      const names = new Set(previous.map((asset) => asset.name));
      const missing = DEFAULT_ASSETS.filter((motif) => !names.has(motif.name)).map((motif) => ({
        ...motif,
        id: newId(),
        isDefault: false,
      }));
      return missing.length ? [...previous, ...missing] : previous;
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    setAssets((previous) => {
      const target = index + direction;
      if (target < 0 || target >= previous.length) return previous;
      const next = [...previous];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <Panel
      title="Motifs"
      subtitle="Built-in art & your uploads"
      icon={<FolderOpen className="h-4 w-4" />}
      action={
        assets.length > 0 ? (
          <button
            type="button"
            onClick={() => setAssets([])}
            className="rounded border border-rose-500/25 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-rose-300 transition hover:bg-rose-500/10"
          >
            Clear
          </button>
        ) : null
      }
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent">
            <Sparkles className="h-3 w-3" />
            Built-in
          </span>
          <button
            type="button"
            onClick={addAllMotifs}
            className="font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-400 underline decoration-accent/50 underline-offset-2 transition hover:text-white"
          >
            Add all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {DEFAULT_ASSETS.map((motif) => (
            <button
              key={motif.id}
              type="button"
              onClick={() => addMotif(motif)}
              title={`Add ${motif.name}`}
              className="group flex items-center gap-2 rounded-lg border border-line bg-ink/40 px-2 py-1.5 text-left transition hover:border-accent/50 hover:bg-ink"
            >
              <img src={motif.dataUrl} alt="" className="h-5 w-5 shrink-0 object-contain" />
              <span className="truncate font-mono text-[10px] text-zinc-400 group-hover:text-zinc-100">
                {motif.name.replace(/\.svg$/i, '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length) void addFiles(event.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition ${
          dragging
            ? 'border-accent bg-accent/10'
            : 'border-line bg-ink/30 hover:border-accent/40 hover:bg-ink/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.svg"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) void addFiles(event.target.files);
            event.target.value = '';
          }}
        />
        <Upload className="mx-auto mb-1.5 h-5 w-5 text-zinc-500" />
        <p className="text-[11px] font-semibold text-zinc-300">Drop images here</p>
        <p className="mt-0.5 font-mono text-[10px] text-zinc-500">SVG · PNG · JPG · WebP · GIF · 8 MB max</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-500/25 bg-rose-500/5 px-3 py-2 font-mono text-[10px] text-rose-300">
          {error}
        </p>
      ) : null}

      {assets.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-line pb-2 font-mono text-[10px] text-zinc-500">
            <span>{assets.length} registered</span>
            <span className="italic">order = cycle order</span>
          </div>

          <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-0.5">
            {assets.map((asset, index) => (
              <li
                key={asset.id}
                className="group flex items-center justify-between gap-2 rounded-md border border-line bg-ink/50 p-1.5 transition hover:border-accent/30"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-line bg-panel p-0.5">
                    <img src={asset.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold text-zinc-200">
                      {asset.name}
                    </span>
                    <span className="block font-mono text-[9px] uppercase text-zinc-500">
                      {asset.type} · {asset.width}×{asset.height}px
                    </span>
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                    className="rounded border border-line bg-panel p-1 text-zinc-400 transition hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === assets.length - 1}
                    title="Move down"
                    className="rounded border border-line bg-panel p-1 text-zinc-400 transition hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssets((previous) => previous.filter((item) => item.id !== asset.id))}
                    title="Remove"
                    className="ml-0.5 rounded p-1 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-line bg-ink/40 px-4 py-6 text-center">
          <ImageIcon className="mx-auto mb-1.5 h-5 w-5 text-zinc-600" />
          <p className="text-[11px] text-zinc-400">No motifs yet — add a built-in one or drop an image.</p>
        </div>
      )}
    </Panel>
  );
}

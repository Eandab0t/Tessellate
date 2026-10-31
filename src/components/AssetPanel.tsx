import React, { useRef, useState } from 'react';
import { PatternAsset } from '../types';
import { DEFAULT_ASSETS } from '../utils/defaultAssets';
import { Group } from './Controls';
import { ArrowDown, ArrowUp, Upload, X } from 'lucide-react';

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
    <div className="space-y-6">
      <Group
        title={`Built-in library · ${DEFAULT_ASSETS.length}`}
        action={
          <button
            type="button"
            onClick={addAllMotifs}
            className="text-[11px] font-semibold text-accent transition hover:underline"
          >
            Add all
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-1.5">
          {DEFAULT_ASSETS.map((motif) => (
            <button
              key={motif.id}
              type="button"
              onClick={() => addMotif(motif)}
              title={`Add ${motif.name}`}
              className="group flex items-center gap-2 rounded-xl border border-line bg-card p-1.5 pr-2 text-left transition hover:border-accent/50 hover:shadow-chip"
            >
              <span className="h-7 w-7 shrink-0 rounded-lg bg-paper p-1 ring-1 ring-line">
                <img src={motif.dataUrl} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="truncate text-[11px] font-medium text-muted transition group-hover:text-ink">
                {motif.name.replace(/\.svg$/i, '')}
              </span>
            </button>
          ))}
        </div>
      </Group>

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
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition ${
          dragging
            ? 'border-accent bg-accent-soft/60'
            : 'border-line-2 bg-paper/50 hover:border-accent/50 hover:bg-accent-soft/30'
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
        <Upload className="mx-auto mb-1.5 h-5 w-5 text-faint" />
        <p className="text-xs font-semibold text-ink">Drop images here</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-faint">
          SVG · PNG · JPG · WebP · GIF — 8 MB max
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-600">
          {error}
        </p>
      ) : null}

      {assets.length > 0 ? (
        <Group
          title={`Your motifs · ${assets.length}`}
          action={
            <button
              type="button"
              onClick={() => setAssets([])}
              className="text-[11px] font-semibold text-rose-500 transition hover:underline"
            >
              Clear
            </button>
          }
        >
          <ul className="space-y-1.5">
            {assets.map((asset, index) => (
              <li
                key={asset.id}
                className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-card p-1.5 transition hover:border-accent/40"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-9 w-9 shrink-0 rounded-lg bg-paper p-1 ring-1 ring-line">
                    <img src={asset.dataUrl} alt="" className="h-full w-full object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-ink">
                      {asset.name}
                    </span>
                    <span className="block text-[10px] font-medium uppercase tracking-wide text-faint">
                      {asset.type} · {asset.width}×{asset.height}
                    </span>
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                    className="rounded-md p-1 text-faint transition hover:bg-paper hover:text-ink disabled:opacity-30"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === assets.length - 1}
                    title="Move down"
                    className="rounded-md p-1 text-faint transition hover:bg-paper hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssets((previous) => previous.filter((item) => item.id !== asset.id))}
                    title="Remove"
                    className="rounded-md p-1 text-faint transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-faint">Order sets the cycle order in Cycle mode.</p>
        </Group>
      ) : null}
    </div>
  );
}

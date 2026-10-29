import { useCallback, useState } from 'react';
import { PatternAsset, PatternSettings } from './types';
import { DEFAULT_ASSETS } from './utils/defaultAssets';
import { presetAssets, presetSettings } from './presets';
import AssetPanel from './components/AssetPanel';
import PreviewPanel from './components/PreviewPanel';
import SettingsPanel from './components/SettingsPanel';
import { RefreshCcw, Wand2 } from 'lucide-react';

const STARTER_ASSETS: PatternAsset[] = DEFAULT_ASSETS.slice(0, 3);

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
  maxOpacity: 1,
  opacityMode: 'fixed',
  fixedOpacity: 1,

  seamlessCorrection: true,
  edgeBleed: 1,
  collisionAvoidance: true,
  collisionThreshold: 1.2,

  gridType: 'standard',
  gridJitter: 0,
  gridOffset: 50,
  gridFlipAlternating: false,

  seed: 142,
  density: 1.25,
  backgroundColor: '#16171B',
  showTileBorder: true,
};

const newId = () => `motif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const cloneAssets = (assets: PatternAsset[]) => assets.map((asset) => ({ ...asset }));

export default function App() {
  const [assets, setAssets] = useState<PatternAsset[]>(() => cloneAssets(STARTER_ASSETS));
  const [settings, setSettings] = useState<PatternSettings>(INITIAL_SETTINGS);

  const patchSettings = useCallback((patch: Partial<PatternSettings>) => {
    setSettings((previous) => ({ ...previous, ...patch }));
  }, []);

  const addMissing = (incoming: PatternAsset[]) => {
    setAssets((previous) => {
      const names = new Set(previous.map((asset) => asset.name));
      const missing = incoming
        .filter((asset) => !names.has(asset.name))
        .map((asset) => ({ ...asset, id: newId(), isDefault: false }));
      return missing.length ? [...previous, ...missing] : previous;
    });
  };

  const useAllMotifs = () => {
    addMissing(DEFAULT_ASSETS);
    setSettings((previous) => ({ ...previous, mode: 'organic', density: 1.5 }));
  };

  const applyPreset = (name: string) => {
    setSettings((previous) => presetSettings(name, previous));
    addMissing(presetAssets(name));
  };

  const reset = () => {
    setAssets(cloneAssets(STARTER_ASSETS));
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink text-zinc-300">
      <div className="h-0.5 shrink-0 bg-accent" />

      <header className="sticky top-0 z-40 border-b border-line bg-panel/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-base font-black text-black">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Tessellate
                </h1>
                <span className="rounded border border-line bg-ink px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-accent">
                  Pattern studio
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-muted">
                Seamless repeating patterns · runs offline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={useAllMotifs}
              className="flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent transition hover:bg-accent/20"
              title="Add every built-in motif and switch to a dense scatter"
            >
              <Wand2 className="h-3.5 w-3.5" />
              All motifs
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-md border border-line bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-zinc-400 transition hover:border-line-2 hover:text-white"
              title="Restore the starter motifs and default settings"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 items-start gap-4 px-4 py-4 lg:px-6 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <AssetPanel assets={assets} setAssets={setAssets} />
        </div>

        <div className="min-w-0 xl:sticky xl:top-[76px]">
          <PreviewPanel
            assets={assets}
            settings={settings}
            onLoadSettings={(loaded) => setSettings((previous) => ({ ...previous, ...loaded }))}
          />
        </div>

        <div className="min-w-0">
          <SettingsPanel settings={settings} onChange={patchSettings} onPreset={applyPreset} />
        </div>
      </main>

      <footer className="shrink-0 border-t border-line bg-panel">
        <div className="mx-auto flex w-full max-w-[1680px] flex-wrap items-center justify-between gap-2 px-4 py-2.5 font-mono text-[10px] text-muted lg:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-emerald-400">● ready</span>
            <span>
              {assets.length} motif{assets.length === 1 ? '' : 's'}
            </span>
            <span>
              tile {settings.tileWidth} × {settings.tileHeight}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>seed 0x{settings.seed.toString(16).toUpperCase()}</span>
            <span className="hidden sm:inline">single file · no install</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

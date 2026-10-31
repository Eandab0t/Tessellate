import { useCallback, useState } from 'react';
import { PatternAsset, PatternSettings } from './types';
import { DEFAULT_ASSETS } from './utils/defaultAssets';
import { presetAssets, presetSettings } from './presets';
import Inspector from './components/Inspector';
import PreviewPanel from './components/PreviewPanel';
import TopBar from './components/TopBar';

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
  backgroundColor: '#000000',
  showTileBorder: true,
};

const newId = () => `motif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const cloneAssets = (assets: PatternAsset[]) => assets.map((asset) => ({ ...asset }));

export default function App() {
  const [assets, setAssets] = useState<PatternAsset[]>(() => cloneAssets(STARTER_ASSETS));
  const [settings, setSettings] = useState<PatternSettings>(INITIAL_SETTINGS);
  const [inspectorOpen, setInspectorOpen] = useState(false);

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
    <div className="flex min-h-dvh flex-col bg-black text-text lg:h-dvh lg:overflow-hidden">
      <TopBar
        onPreset={applyPreset}
        onAllMotifs={useAllMotifs}
        onReset={reset}
        onToggleInspector={() => setInspectorOpen((open) => !open)}
      />

      <main className="relative min-h-[72dvh] flex-1 lg:min-h-0">
        <PreviewPanel
          assets={assets}
          settings={settings}
          onLoadSettings={(loaded) => setSettings((previous) => ({ ...previous, ...loaded }))}
          onTune={() => setInspectorOpen(true)}
        />

        <Inspector
          assets={assets}
          setAssets={setAssets}
          settings={settings}
          onChange={patchSettings}
          open={inspectorOpen}
          onClose={() => setInspectorOpen(false)}
        />
      </main>
    </div>
  );
}

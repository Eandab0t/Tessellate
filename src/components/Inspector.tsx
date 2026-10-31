import React, { useState } from 'react';
import { PatternAsset, PatternSettings } from '../types';
import AssetPanel from './AssetPanel';
import SettingsPanel from './SettingsPanel';
import { Image, LayoutGrid, Palette, X } from 'lucide-react';

type Tab = 'motifs' | 'canvas' | 'style';

interface InspectorProps {
  assets: PatternAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PatternAsset[]>>;
  settings: PatternSettings;
  onChange: (patch: Partial<PatternSettings>) => void;
  open: boolean;
  onClose: () => void;
}

const TABS: ReadonlyArray<{ id: Tab; label: string; Icon: typeof Image }> = [
  { id: 'motifs', label: 'Motifs', Icon: Image },
  { id: 'canvas', label: 'Canvas', Icon: LayoutGrid },
  { id: 'style', label: 'Style', Icon: Palette },
];

export default function Inspector({ assets, setAssets, settings, onChange, open, onClose }: InspectorProps) {
  const [tab, setTab] = useState<Tab>('motifs');

  return (
    <aside
      className={`absolute inset-y-4 right-4 z-30 w-[min(92vw,360px)] lg:rounded-3xl lg:flex ${
        open ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-pop">
        <div className="flex items-center gap-1.5 border-b border-line px-5 py-4">
          <div className="grid flex-1 grid-cols-3 gap-2 rounded-xl bg-card-2 p-1">
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-bold transition ${
                    active ? 'bg-accent text-black shadow-chip' : 'text-muted hover:text-text'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? 'text-black' : ''}`} />
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-card-2 hover:text-text lg:hidden"
            title="Close the inspector"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'motifs' ? <AssetPanel assets={assets} setAssets={setAssets} /> : null}
          {tab === 'canvas' ? (
            <SettingsPanel section="canvas" settings={settings} onChange={onChange} />
          ) : null}
          {tab === 'style' ? (
            <SettingsPanel section="style" settings={settings} onChange={onChange} />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

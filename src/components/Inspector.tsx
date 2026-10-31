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
      className={`absolute inset-y-3 right-3 z-30 w-[min(92vw,348px)] max-lg:rounded-2xl lg:inset-y-4 lg:right-4 lg:w-[352px] ${
        open ? 'flex' : 'hidden'
      } lg:flex`}
    >
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-pop">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
          <div className="grid flex-1 grid-cols-3 gap-1 rounded-xl bg-paper p-1">
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition ${
                    active ? 'bg-card text-ink shadow-chip' : 'text-muted hover:text-ink'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? 'text-accent' : ''}`} />
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition hover:bg-paper hover:text-ink lg:hidden"
            title="Close the inspector"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
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

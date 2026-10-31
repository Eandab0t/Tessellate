import { PRESETS } from '../presets';
import { RefreshCcw, SlidersHorizontal, Sparkles, Wand2 } from 'lucide-react';

interface TopBarProps {
  onPreset: (name: string) => void;
  onAllMotifs: () => void;
  onReset: () => void;
  onToggleInspector: () => void;
}

export default function TopBar({ onPreset, onAllMotifs, onReset, onToggleInspector }: TopBarProps) {
  const presetPills = PRESETS.map((preset) => (
    <button
      key={preset.name}
      type="button"
      onClick={() => onPreset(preset.name)}
      className="shrink-0 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:bg-accent-soft hover:text-accent"
      title={`Apply the ${preset.label} preset`}
    >
      {preset.label}
    </button>
  ));

  return (
    <header className="relative z-40 shrink-0 border-b border-line bg-card/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#6d5ae8,#c85ae8)] text-white shadow-chip">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold leading-none tracking-tight text-ink">
              Tessellate
            </h1>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-faint">
              Seamless pattern studio
            </p>
          </div>
        </div>

        <nav aria-label="Presets" className="hidden items-center gap-1.5 md:flex">
          {presetPills}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onAllMotifs}
            className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-chip transition hover:bg-accent-2"
            title="Add every built-in motif and switch to a dense scatter"
          >
            <Wand2 className="h-3.5 w-3.5" />
            All motifs
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:border-line-2 hover:text-ink"
            title="Restore the starter motifs and default settings"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onToggleInspector}
            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-card text-muted transition hover:border-line-2 hover:text-ink lg:hidden"
            title="Open the inspector"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-4 pb-2.5 md:hidden">
        {presetPills}
      </div>
    </header>
  );
}

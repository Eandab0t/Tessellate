import { PRESETS } from '../presets';
import { RefreshCcw, SlidersHorizontal, Sparkles } from 'lucide-react';

const LOGO = `data:image/webp;base64,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`;

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
      className="shrink-0 rounded-full border border-line bg-card-2 px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:bg-accent-soft hover:text-accent"
      title={`Apply the ${preset.label} preset`}
    >
      {preset.label}
    </button>
  ));

  return (
    <header className="relative z-40 shrink-0 border-b border-line bg-card/80 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <img
            src={LOGO}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg"
            loading="eager"
            decoding="async"
          />
          <div>
            <h1 className="font-display text-lg font-bold leading-none tracking-tight text-text">
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
            className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-black shadow-chip transition hover:bg-accent-2"
            title="Add every built-in motif and switch to a dense scatter"
          >
            <Sparkles className="h-3.5 w-3.5" />
            All motifs
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:border-line hover:text-text"
            title="Restore the starter motifs and default settings"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onToggleInspector}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-muted transition hover:border-line hover:text-text lg:hidden"
            title="Open the inspector"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-5 pb-3 md:hidden">
        {presetPills}
      </div>
    </header>
  );
}

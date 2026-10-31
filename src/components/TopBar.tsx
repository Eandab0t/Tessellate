import { PRESETS } from '../presets';
import { RefreshCcw, SlidersHorizontal, Sparkles } from 'lucide-react';

const LOGO = `data:image/webp;base64,UklGRpYMAABXRUJQVlA4TIoMAAAv58P5EBUPggBIgvj/dQHqgYhQ4LaNMjoc7xXYwIoRCklsIC32D4AAGB8AB8AABUAVII8waYACAC9A2VAAyABA/QAg1AEoAB4DDxABwADAQH/Q0ZNINIAA==`;

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

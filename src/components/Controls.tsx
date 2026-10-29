import React from 'react';

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

interface PanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Panel({ title, subtitle, icon, action, className = '', children }: PanelProps) {
  return (
    <section className={`rounded-xl border border-line bg-panel ${className}`}>
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {icon ? <span className="mt-0.5 shrink-0 text-accent">{icon}</span> : null}
          <div className="min-w-0">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 font-mono text-[10px] text-muted">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

interface GroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Group({ title, children, className = '' }: GroupProps) {
  return (
    <div className={`space-y-3 border-t border-line pt-4 first:border-t-0 first:pt-0 ${className}`}>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{title}</h3>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  display?: React.ReactNode;
  hint?: string;
  disabled?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  hint,
  disabled,
}: SliderProps) {
  return (
    <label className={`block space-y-1 ${disabled ? 'pointer-events-none opacity-40' : ''}`}>
      <span className="flex items-baseline justify-between gap-2 text-[11px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono font-semibold text-accent">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
      {hint ? <span className="block font-mono text-[10px] leading-tight text-zinc-500">{hint}</span> : null}
    </label>
  );
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className = '',
}: SegmentedProps<T>) {
  return (
    <div className={`flex gap-0.5 rounded-lg border border-line bg-ink/60 p-0.5 ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition ${
              active ? 'bg-accent font-bold text-black' : 'text-muted hover:text-white'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface ToggleProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, hint, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold text-zinc-200">{label}</span>
        {hint ? (
          <span className="mt-0.5 block font-mono text-[10px] leading-tight text-zinc-500">{hint}</span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
          checked ? 'border-accent bg-accent' : 'border-line-2 bg-ink'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${
            checked ? 'left-[18px] bg-black' : 'left-0.5 bg-zinc-400'
          }`}
        />
      </button>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  suffix?: string;
  disabled?: boolean;
}

export function NumberField({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
  disabled,
}: NumberFieldProps) {
  return (
    <label className="block space-y-1">
      <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">{label}</span>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(event) => {
            const raw = event.target.value;
            if (raw === '') return;
            const parsed = Number(raw);
            if (Number.isFinite(parsed)) onChange(parsed);
          }}
          className="w-full rounded-md border border-line bg-ink px-2 py-1.5 text-center font-mono text-xs text-accent outline-none transition focus:border-accent/60 disabled:cursor-not-allowed disabled:border-dashed disabled:opacity-40"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

interface ChoiceButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  key?: React.Key;
}

export function ChoiceButton({ active, onClick, children, title, className = '' }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide transition ${
        active
          ? 'border-accent bg-accent font-bold text-black'
          : 'border-line bg-ink/60 text-muted hover:border-line-2 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

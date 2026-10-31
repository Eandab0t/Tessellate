import React from 'react';

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

interface GroupProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Group({ title, action, children, className = '' }: GroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
          {title}
        </h3>
        {action}
      </div>
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
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-[11px] font-semibold text-accent">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? <span className="block text-[11px] leading-snug text-faint">{hint}</span> : null}
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
    <div className={`flex gap-1 rounded-xl bg-paper p-1 ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${
              active ? 'bg-card text-ink shadow-chip' : 'text-muted hover:text-ink'
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
        <span className="block text-xs font-semibold text-ink">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-[11px] leading-snug text-faint">{hint}</span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-line-2'
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-chip transition-all ${
            checked ? 'left-[21px]' : 'left-[3px]'
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
      <span className="block text-[10px] font-semibold uppercase tracking-wide text-faint">
        {label}
      </span>
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
          className="w-full rounded-xl border border-line bg-paper/60 px-2.5 py-2 text-center font-mono text-xs font-semibold text-ink outline-none transition placeholder:text-faint focus:border-accent/60 focus:bg-card focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:border-dashed disabled:opacity-40"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-faint">
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
      className={`rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${
        active
          ? 'border-accent bg-accent-soft text-accent'
          : 'border-line bg-card text-muted hover:border-line-2 hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

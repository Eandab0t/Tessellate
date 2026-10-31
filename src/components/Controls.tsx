import React from 'react';

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Card({ title, subtitle, icon, action, className = '', children }: CardProps) {
  return (
    <section className={`rounded-2xl border border-line bg-card shadow-card ${className}`}>
      {title || subtitle || icon || action ? (
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-start gap-2.5">
            {icon ? <span className="mt-0.5 shrink-0 text-accent">{icon}</span> : null}
            <div className="min-w-0">
              {title ? (
                <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {title}
                </h3>
              ) : null}
              {subtitle ? (
                <p className="mt-0.5 font-mono text-[10px] text-faint">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div className="space-y-4 p-5">{children}</div>
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
      <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
        {title}
      </h3>
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
    <div className={`flex gap-1 rounded-xl border border-line bg-card-2 p-1 ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${
              active
                ? 'bg-accent text-black shadow-chip'
                : 'text-muted hover:text-text hover:border-line-2'
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
        <span className="block text-xs font-semibold text-text">{label}</span>
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
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-black shadow-chip transition-all ${
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
          className="w-full rounded-xl border border-line bg-card-2 px-2.5 py-2 text-center font-mono text-xs font-semibold text-text outline-none transition placeholder:text-faint focus:border-accent/60 focus:bg-card focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:border-dashed disabled:opacity-40"
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
          : 'border-line-2 bg-card-2 text-muted hover:border-line hover:text-text'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

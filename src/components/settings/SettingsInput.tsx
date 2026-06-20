"use client";

interface SettingsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  counter?: { current: number; max: number };
}

export function SettingsInput({ label, helper, error, counter, id, className = "", ...props }: SettingsInputProps) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-2 block font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0 motion-reduce:transition-none ${
          error ? "border-accent focus:ring-accent" : "focus:border-accent"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-2 text-xs text-accent" role="alert">
          {error}
        </p>
      ) : null}
      {counter ? <p className="mt-1 text-xs text-muted-foreground">{counter.current} / {counter.max}</p> : null}
      {helper && !error ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}

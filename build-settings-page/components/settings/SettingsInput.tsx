'use client'

interface SettingsInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  counter?: { current: number; max: number }
}

export function SettingsInput({
  label,
  helper,
  error,
  counter,
  id,
  className = '',
  ...props
}: SettingsInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-mono tracking-wider text-muted-foreground mb-2 uppercase"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 text-sm border border-border rounded bg-input text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0 ${
          error ? 'border-accent focus:ring-accent' : 'focus:border-accent'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs text-accent font-sans" role="alert">
          {error}
        </p>
      )}
      {counter && (
        <p className="mt-1 text-xs text-muted-foreground">
          {counter.current} / {counter.max}
        </p>
      )}
      {helper && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      )}
    </div>
  )
}

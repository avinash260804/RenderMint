'use client'

interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function PillButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: PillButtonProps) {
  const baseClasses = 'rounded font-mono font-bold uppercase text-xs transition-all duration-150'

  const variantClasses = {
    primary: 'bg-accent text-accent-foreground hover:opacity-80 active:scale-95 transition-all duration-100',
    secondary:
      'bg-secondary text-foreground border border-border hover:bg-muted transition-colors duration-150',
    ghost: 'text-foreground hover:bg-muted/30 transition-colors duration-150',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

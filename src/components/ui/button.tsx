import React from 'react';
import { cn } from '@/src/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold shadow-sm hover:shadow-emerald-500/20 active:translate-y-px',
      secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/60 active:translate-y-px',
      outline: 'bg-transparent hover:bg-neutral-800/80 text-neutral-200 border border-neutral-800 hover:border-neutral-700 active:translate-y-px',
      ghost: 'bg-transparent hover:bg-neutral-800/60 text-neutral-300 hover:text-neutral-100',
      danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30',
      subtle: 'bg-neutral-900/80 hover:bg-neutral-800/90 text-neutral-200 border border-neutral-800/80',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-xs rounded-md gap-1.5',
      md: 'h-9 px-3.5 text-sm rounded-md gap-2',
      lg: 'h-11 px-5 text-base rounded-md gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-md',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

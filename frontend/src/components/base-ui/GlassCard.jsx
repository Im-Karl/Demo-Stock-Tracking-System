import React from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const cardStyles = cva('relative overflow-hidden transition-all duration-300', {
  variants: {
    intent: {
      default: 'backdrop-blur-xl bg-white/70 dark:bg-grey-900/80 border border-white/50 dark:border-white/10 shadow-xl',
      success: 'backdrop-blur-md bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-500/20',
      warning: 'backdrop-blur-md bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-500/20',
      danger: 'backdrop-blur-md bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-500/20',
      info: 'backdrop-blur-md bg-primary-50/80 dark:bg-primary-900/30 border border-primary-200/50 dark:border-primary-500/20',
    },
    rounded: {
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      xl: 'rounded-3xl',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
  },
  defaultVariants: {
    intent: 'default',
    rounded: 'lg',
    padding: 'lg',
  },
});

export default function GlassCard({ as: Component = 'div', children, className, intent, rounded, padding, ...props }) {
  return (
    <Component className={clsx(cardStyles({ intent, rounded, padding }), className)} {...props}>
      {children}
    </Component>
  );
}

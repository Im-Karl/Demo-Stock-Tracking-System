import React from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const cardStyles = cva('relative overflow-hidden transition-colors shadow-sm', {
  variants: {
    intent: {
      default: 'bg-white dark:bg-grey-800',
      success: 'bg-emerald-50 dark:bg-emerald-900/30',
      warning: 'bg-amber-50 dark:bg-amber-900/30',
      danger: 'bg-red-50 dark:bg-red-900/30',
      info: 'bg-primary-50 dark:bg-primary-900/30',
    },
    rounded: {
      md: 'rounded-sm',
      lg: 'rounded-sm',
      xl: 'rounded-sm',
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

export default function GlassCard({ children, className, intent, rounded, padding, ...props }) {
  return (
    <div className={clsx(cardStyles({ intent, rounded, padding }), className)} {...props}>
      {children}
    </div>
  );
}

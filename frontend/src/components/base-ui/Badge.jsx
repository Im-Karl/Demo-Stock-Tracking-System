import React from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const badge = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-bold',
    'rounded-sm',
    'whitespace-nowrap',
    'transition-all',
  ],
  {
    variants: {
      intent: {
        primary: '',
        secondary: '',
        success: '',
        danger: '',
        warning: '',
        neutral: '',
      },
      variant: {
        solid: ['shadow-sm', 'text-white'],
        soft: [],
      },
      size: {
        sm: ['px-2', 'py-0.5', 'text-[10px]', 'gap-1'],
        md: ['px-2.5', 'py-1', 'text-xs', 'gap-1.5'],
        lg: ['px-3', 'py-1.5', 'text-sm', 'gap-2'],
      },
    },
    compoundVariants: [
      // Primary
      { intent: 'primary', variant: 'soft', className: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' },
      { intent: 'primary', variant: 'solid', className: 'bg-primary-500' },
      // Secondary
      { intent: 'secondary', variant: 'soft', className: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400' },
      { intent: 'secondary', variant: 'solid', className: 'bg-secondary-500' },
      // Success
      { intent: 'success', variant: 'soft', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
      { intent: 'success', variant: 'solid', className: 'bg-emerald-500' },
      // Danger
      { intent: 'danger', variant: 'soft', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { intent: 'danger', variant: 'solid', className: 'bg-red-500' },
      // Warning
      { intent: 'warning', variant: 'soft', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
      { intent: 'warning', variant: 'solid', className: 'bg-orange-500' },
      // Neutral
      { intent: 'neutral', variant: 'soft', className: 'bg-grey-200 text-grey-700 dark:bg-grey-900 dark:text-grey-300' },
      { intent: 'neutral', variant: 'solid', className: 'bg-grey-700 dark:bg-grey-800' },
    ],
    defaultVariants: {
      intent: 'neutral',
      variant: 'soft', // Badges typically default to soft
      size: 'md',
    },
  }
);

export default function Badge({ intent, variant, size, className, children, onClick, ...props }) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={clsx(
        badge({ intent, variant, size }),
        onClick && 'cursor-pointer hover:opacity-80 active:scale-[0.98] outline-none focus-visible:ring-2 ring-primary-500',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const button = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'border',
    'font-bold',
    'cursor-pointer',
    'rounded-xl',
    'transition-all',
    'duration-300',
    'ease-out',
    'active:scale-[0.97]',
    'shadow-lg',
    'hover:shadow-xl',
    'hover:-translate-y-0.5',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-gradient-to-r from-blue-600 to-indigo-600',
          'text-white',
          'border-transparent',
          'hover:from-blue-700 hover:to-indigo-700',
          'active:from-blue-800 active:to-indigo-800',
          'shadow-blue-500/25',
          'hover:shadow-blue-500/40',
        ],
        success: [
          'bg-gradient-to-r from-emerald-500 to-teal-500',
          'text-white',
          'border-transparent',
          'hover:from-emerald-600 hover:to-teal-600',
          'active:from-emerald-700 active:to-teal-700',
          'shadow-emerald-500/25',
          'hover:shadow-emerald-500/40',
        ],
        danger: [
          'bg-gradient-to-r from-red-500 to-rose-500',
          'text-white',
          'border-transparent',
          'hover:from-red-600 hover:to-rose-600',
          'active:from-red-700 active:to-rose-700',
          'shadow-red-500/25',
          'hover:shadow-red-500/40',
        ],
        warning: [
          'bg-gradient-to-r from-amber-500 to-orange-500',
          'text-white',
          'border-transparent',
          'hover:from-amber-600 hover:to-orange-600',
          'active:from-amber-700 active:to-orange-700',
          'shadow-amber-500/25',
          'hover:shadow-amber-500/40',
        ],
        neutral: [
          'bg-gradient-to-r from-neutral-100 to-neutral-200',
          'text-neutral-800',
          'border-neutral-300',
          'hover:from-neutral-200 hover:to-neutral-300',
          'active:from-neutral-300 active:to-neutral-400',
          'dark:from-neutral-700 dark:to-neutral-800',
          'dark:text-neutral-100',
          'dark:border-neutral-600',
          'dark:hover:from-neutral-600 dark:hover:to-neutral-700',
          'dark:active:from-neutral-500 dark:active:to-neutral-600',
          'shadow-neutral-500/10',
          'hover:shadow-neutral-500/20',
        ],
        ghost: [
          'border-transparent',
          'text-neutral-600',
          'bg-transparent',
          'hover:bg-gradient-to-r hover:from-neutral-100 hover:to-neutral-200',
          'active:bg-neutral-300',
          'dark:text-neutral-300',
          'dark:hover:from-neutral-800 dark:hover:to-neutral-700',
          'dark:active:bg-neutral-600',
          'shadow-none',
          'hover:shadow-none',
        ],
        primarySoft: [
          'bg-gradient-to-r from-blue-50 to-indigo-50',
          'text-blue-700',
          'border-blue-200',
          'hover:from-blue-100 hover:to-indigo-100',
          'active:from-blue-200 active:to-indigo-200',
          'dark:from-blue-950/50 dark:to-indigo-950/50',
          'dark:text-blue-300',
          'dark:border-blue-800',
          'dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50',
          'shadow-blue-500/10',
          'hover:shadow-blue-500/20',
        ],
        successSoft: [
          'bg-gradient-to-r from-emerald-50 to-teal-50',
          'text-emerald-700',
          'border-emerald-200',
          'hover:from-emerald-100 hover:to-teal-100',
          'active:from-emerald-200 active:to-teal-200',
          'dark:from-emerald-950/50 dark:to-teal-950/50',
          'dark:text-emerald-300',
          'dark:border-emerald-800',
          'dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50',
          'shadow-emerald-500/10',
          'hover:shadow-emerald-500/20',
        ],
        warningSoft: [
          'bg-gradient-to-r from-amber-50 to-orange-50',
          'text-amber-700',
          'border-amber-200',
          'hover:from-amber-100 hover:to-orange-100',
          'active:from-amber-200 active:to-orange-200',
          'dark:from-amber-950/50 dark:to-orange-950/50',
          'dark:text-amber-300',
          'dark:border-amber-800',
          'dark:hover:from-amber-900/50 dark:hover:to-orange-900/50',
          'shadow-amber-500/10',
          'hover:shadow-amber-500/20',
        ],
        dangerSoft: [
          'bg-gradient-to-r from-red-50 to-rose-50',
          'text-red-700',
          'border-red-200',
          'hover:from-red-100 hover:to-rose-100',
          'active:from-red-200 active:to-rose-200',
          'dark:from-red-950/50 dark:to-rose-950/50',
          'dark:text-red-300',
          'dark:border-red-800',
          'dark:hover:from-red-900/50 dark:hover:to-rose-900/50',
          'shadow-red-500/10',
          'hover:shadow-red-500/20',
        ],
      },
      size: {
        lg: ['h-12', 'px-7', 'text-lg', 'gap-3'],
        md: ['h-10', 'px-5', 'text-base', 'gap-2'],
        sm: ['h-9', 'px-4', 'text-sm', 'gap-2'],
        icon: ['h-10', 'w-10', 'p-0'],
      },
    },
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
  },
);

export default function Button({ intent, size, className, render, ...props }) {
  return (
    <BaseButton
      className={clsx(button({ intent, size }), className)}
      render={render}
      nativeButton={render ? false : undefined}
      {...props}
    />
  );
}

import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const button = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'font-bold',
    'cursor-pointer',
    'rounded-sm', // MD2 less-rounded
    'transition-colors',
    'duration-200',
    'ease-in-out',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-primary-500',
          'text-white',
          'hover:bg-primary-600',
          'active:bg-primary-700',
          'shadow-sm',
        ],
        secondary: [
          'bg-secondary-500',
          'text-white',
          'hover:bg-secondary-600',
          'active:bg-secondary-700',
          'shadow-sm',
        ],
        success: [
          'bg-emerald-500',
          'text-white',
          'hover:bg-emerald-600',
          'active:bg-emerald-700',
          'shadow-sm',
        ],
        danger: [
          'bg-red-500',
          'text-white',
          'hover:bg-red-600',
          'active:bg-red-700',
          'shadow-sm',
        ],
        warning: [
          'bg-amber-500',
          'text-white',
          'hover:bg-amber-600',
          'active:bg-amber-700',
          'shadow-sm',
        ],
        neutral: [
          'bg-grey-100',
          'text-grey-800',
          'hover:bg-grey-200',
          'active:bg-grey-300',
          'dark:bg-grey-900',
          'dark:text-grey-100',
          'dark:hover:bg-grey-800',
          'dark:active:bg-grey-700',
        ],
        ghost: [
          'bg-transparent',
          'text-grey-600',
          'hover:bg-grey-100',
          'active:bg-grey-200',
          'dark:text-grey-300',
          'dark:hover:bg-grey-800',
          'dark:active:bg-grey-700',
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

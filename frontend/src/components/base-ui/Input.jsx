import React from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const inputStyles = cva(
  'w-full py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 font-medium',
  {
    variants: {
      intent: {
        default:
          'bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 hover:border-blue-300 dark:hover:border-blue-600 caret-blue-500 placeholder-neutral-400 dark:placeholder-neutral-500',
        error:
          'bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700 focus:border-red-500 hover:border-red-400 dark:hover:border-red-600 caret-red-500',
      },
      hasIcon: {
        true: 'pl-11 pr-4',
        false: 'px-4',
      },
    },
    defaultVariants: {
      intent: 'default',
      hasIcon: false,
    },
  },
);

export default function Input({ className, intent, icon: Icon, ...props }) {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 transition-colors group-focus-within:text-blue-500"
          size={20}
        />
      )}
      <input className={clsx(inputStyles({ intent, hasIcon: !!Icon }), className)} {...props} />
    </div>
  );
}

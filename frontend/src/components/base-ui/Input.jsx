import React from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const inputStyles = cva(
  'w-full py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 font-medium',
  {
    variants: {
      intent: {
        default:
          'bg-white/80 dark:bg-black/50 text-grey-900 dark:text-grey-100 border-grey-200 dark:border-grey-800 focus:border-primary-500 hover:border-primary-300 dark:hover:border-primary-600 caret-primary-500 placeholder-grey-400 dark:placeholder-grey-600',
        error:
          'bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-100 border-red-300 dark:border-red-800 focus:border-red-500 hover:border-red-400 dark:hover:border-red-600 caret-red-500',
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
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400 dark:text-grey-500 transition-colors group-focus-within:text-primary-500"
          size={20}
        />
      )}
      <input className={clsx(inputStyles({ intent, hasIcon: !!Icon }), className)} {...props} />
    </div>
  );
}

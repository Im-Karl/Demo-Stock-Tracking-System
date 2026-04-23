import React from 'react';
import { Field } from '@base-ui/react/field';
import clsx from 'clsx';

/**
 * MD2-style outlined text field with floating label.
 * 
 * Uses Base UI Field primitives for accessibility.
 * The floating effect is pure CSS via :placeholder-shown + :focus-within.
 */
export default function TextField({ label, icon: Icon, className, intent = 'default', ...props }) {
  const hasIcon = !!Icon;

  return (
    <Field.Root
      className={clsx(
        'group/field relative w-full',
        props.disabled && 'opacity-60',
        className,
      )}
    >
      {/* Icon */}
      {Icon && (
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-grey-400 dark:text-grey-500 group-focus-within/field:text-primary-500 transition-colors"
          size={20}
        />
      )}

      {/* Input */}
      <Field.Control
        placeholder=" "
        className={clsx(
          'peer w-full rounded-sm border-2 bg-transparent py-3.5 transition-colors duration-200',
          'text-grey-900 dark:text-grey-100 font-medium',
          'outline-none focus:ring-0',
          'placeholder-transparent',
          hasIcon ? 'pl-11 pr-4' : 'px-4',
          intent === 'error'
            ? 'border-red-400 dark:border-red-700 focus:border-red-500 caret-red-500'
            : 'border-grey-300 dark:border-grey-700 focus:border-primary-500 dark:focus:border-primary-500 caret-primary-500',
        )}
        {...props}
      />

      {/* Floating Label */}
      {label && (
        <Field.Label
          className={clsx(
            // Base
            'absolute top-1/2 -translate-y-1/2 pointer-events-none',
            'text-grey-500 dark:text-grey-400 font-medium',
            'origin-left transition-all duration-200 ease-out',
            // Position
            hasIcon ? 'left-11' : 'left-4',
            // Floated state (focus or has value)
            'peer-focus:top-0 peer-focus:text-xs peer-focus:px-1.5 peer-focus:-translate-y-1/2',
            'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2',
            // Floated left position (reset to border edge)
            hasIcon ? 'peer-focus:left-3 peer-[:not(:placeholder-shown)]:left-3' : '',
            // Background mask (covers the border behind the label)
            'peer-focus:bg-grey-50 peer-focus:dark:bg-black',
            'peer-[:not(:placeholder-shown)]:bg-grey-50 peer-[:not(:placeholder-shown)]:dark:bg-black',
            // Color when focused
            intent === 'error'
              ? 'peer-focus:text-red-500'
              : 'peer-focus:text-primary-500',
          )}
        >
          {label}
        </Field.Label>
      )}
    </Field.Root>
  );
}

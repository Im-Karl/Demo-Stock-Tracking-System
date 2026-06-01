import React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { RiAddLine, RiSubtractLine, RiArrowLeftRightLine } from 'react-icons/ri';
import clsx from 'clsx';

export default function NumberField({ label, className, bgTheme = 'page', prefix, suffix, ...props }) {
  const id = React.useId();

  return (
    <BaseNumberField.Root
      id={id}
      className={clsx('group/field relative w-full', props.disabled && 'opacity-60', className)}
      {...props}
    >
      {label && (
        <BaseNumberField.ScrubArea className="mb-2 flex items-center gap-2 cursor-ew-resize">
          <label
            htmlFor={id}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-400 cursor-ew-resize"
          >
            {label}
          </label>
          <BaseNumberField.ScrubAreaCursor className="text-primary-500 drop-shadow-sm">
            <RiArrowLeftRightLine size={14} />
          </BaseNumberField.ScrubAreaCursor>
        </BaseNumberField.ScrubArea>
      )}

      <BaseNumberField.Group
        className={clsx(
          'peer flex w-full items-center rounded-sm border-2 transition-colors duration-200 overflow-hidden',
          'bg-transparent',
          'border-grey-300 dark:border-grey-700 focus-within:border-primary-500 dark:focus-within:border-primary-500',
        )}
      >
        <BaseNumberField.Decrement
          className={clsx(
            'flex h-full items-center justify-center px-3 py-3.5 outline-none transition-colors',
            'text-grey-500 hover:text-grey-900 dark:hover:text-white',
            'focus-visible:bg-grey-100 dark:focus-visible:bg-grey-800',
          )}
        >
          <RiSubtractLine size={20} />
        </BaseNumberField.Decrement>

        {prefix && <span className="pl-1 text-grey-500 pointer-events-none select-none">{prefix}</span>}

        <BaseNumberField.Input
          className={clsx(
            'w-full bg-transparent py-3 text-center transition-colors duration-200',
            'font-mono font-normal text-base text-grey-900 dark:text-grey-100',
            'outline-none focus:ring-0 placeholder-transparent caret-primary-500',
          )}
        />

        {suffix && <span className="pl-2 pr-1 text-grey-500 pointer-events-none select-none font-mono">{suffix}</span>}

        <BaseNumberField.Increment
          className={clsx(
            'flex h-full items-center justify-center px-3 py-3.5 outline-none transition-colors',
            'text-grey-500 hover:text-grey-900 dark:hover:text-white',
            'focus-visible:bg-grey-100 dark:focus-visible:bg-grey-800',
          )}
        >
          <RiAddLine size={20} />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}

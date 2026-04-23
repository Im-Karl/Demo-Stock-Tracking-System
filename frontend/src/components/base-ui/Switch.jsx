import React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import clsx from 'clsx';

export default function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  checkedIcon,
  uncheckedIcon,
  className,
  'aria-label': ariaLabel,
}) {
  return (
    <BaseSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={clsx(
        'group flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'transition-colors duration-300',
        'bg-grey-200', // iOS unselected
        'data-[checked]:bg-primary-500', // iOS selected
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      aria-label={ariaLabel}
    >
      <BaseSwitch.Thumb
        className={clsx(
          'flex items-center justify-center rounded-full transition-all duration-300 relative overflow-hidden',
          'size-7 ml-0.5', // 28px size with 2px margin perfectly centered in 32px track
          'bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)]', // iOS drop shadow
          'data-[checked]:translate-x-6', // 56px - 28px - 4px = 24px (translate-x-6)
        )}
      >
        {/* Unchecked Icon */}
        <span className="absolute transition-opacity duration-300 opacity-100 data-[checked]:opacity-0 flex items-center justify-center pointer-events-none group-data-[checked]:opacity-0">
          {uncheckedIcon &&
            React.cloneElement(uncheckedIcon, {
              className: clsx('w-3.5 h-3.5 text-grey-500', uncheckedIcon?.props?.className),
            })}
        </span>
        {/* Checked Icon */}
        <span className="absolute transition-opacity duration-300 opacity-0 data-[checked]:opacity-100 flex items-center justify-center pointer-events-none group-data-[checked]:opacity-100">
          {checkedIcon &&
            React.cloneElement(checkedIcon, {
              className: clsx('w-3.5 h-3.5 text-primary-600', checkedIcon?.props?.className),
            })}
        </span>
      </BaseSwitch.Thumb>
    </BaseSwitch.Root>
  );
}

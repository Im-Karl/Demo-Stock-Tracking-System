import React, { useState, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const tabStyles = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'px-4',
    'py-3',
    'font-bold',
    'text-sm',
    'transition-colors',
    'duration-200',
    'cursor-pointer',
    'border-b-2', // The underline
    'relative',
    '-mb-[1px]', // Overlap the parent border-b
  ],
  {
    variants: {
      active: {
        false: [
          'border-transparent',
          'text-grey-500',
          'dark:text-grey-400',
          'hover:text-grey-900',
          'dark:hover:text-grey-100',
          'hover:bg-grey-50',
          'dark:hover:bg-grey-800/50',
        ],
        true: [
          'border-primary-500',
          'text-primary-600',
          'dark:text-primary-400',
        ],
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export default function Tab({ active, href, onClick, className, children, icon }) {
  // Auto-detect active state for links if not explicitly provided
  const [isLinkActive, setIsLinkActive] = useState(active || false);

  useEffect(() => {
    if (href && active === undefined && typeof window !== 'undefined') {
      setIsLinkActive(window.location.pathname.startsWith(href));
    } else if (active !== undefined) {
      setIsLinkActive(active);
    }
  }, [href, active]);

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      className={clsx(tabStyles({ active: isLinkActive }), className)}
    >
      {icon}
      {children}
    </Component>
  );
}

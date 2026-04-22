import React, { useMemo } from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const avatarStyles = cva(
  'inline-flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors bg-grey-100 dark:bg-grey-800 relative',
  {
    variants: {
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

const fallbackStyles = cva(
  'font-semibold uppercase flex items-center justify-center w-full h-full',
  {
    variants: {
      size: {
        sm: 'text-[10px]',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// We keep full Tailwind classes here so the scanner picks them up
const FALLBACK_COLORS = [
  'bg-red-600 text-white',
  'bg-orange-600 text-white',
  'bg-amber-600 text-white',
  'bg-green-600 text-white',
  'bg-emerald-600 text-white',
  'bg-teal-600 text-white',
  'bg-cyan-600 text-white',
  'bg-sky-600 text-white',
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-violet-600 text-white',
  'bg-purple-600 text-white',
  'bg-fuchsia-600 text-white',
  'bg-pink-600 text-white',
  'bg-rose-600 text-white',
];

function getHashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export default function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size,
  shape,
  className,
}) {
  const hashIdentifier = useMemo(() => {
    // We prioritize the full `alt` string for hashing to ensure consistent colors 
    // across different usages (e.g. one passing full name as fallback, one passing initial)
    if (typeof alt === 'string' && alt !== 'Avatar' && alt.trim().length > 0) return alt.trim();
    if (typeof fallback === 'string' && fallback.trim().length > 0) return fallback.trim();
    return '?';
  }, [alt, fallback]);

  const renderFallbackContent = () => {
    if (React.isValidElement(fallback)) return fallback;
    // Always render a single character for string fallbacks
    if (typeof fallback === 'string' && fallback.trim().length > 0) return fallback.trim().charAt(0);
    if (typeof alt === 'string' && alt !== 'Avatar' && alt.trim().length > 0) return alt.trim().charAt(0);
    return '?';
  };

  const colorClass = useMemo(() => getHashColor(hashIdentifier), [hashIdentifier]);

  return (
    <BaseAvatar.Root className={clsx(avatarStyles({ size, shape }), className)}>
      {src && (
        <BaseAvatar.Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover absolute inset-0 rounded-[inherit]"
        />
      )}
      <BaseAvatar.Fallback className={clsx(fallbackStyles({ size }), colorClass)}>
        {renderFallbackContent()}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

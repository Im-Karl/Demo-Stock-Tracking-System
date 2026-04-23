import React from 'react';
import clsx from 'clsx';
import GlassCard from './GlassCard';

const FeatureCard = React.forwardRef(function FeatureCard(
  {
    icon: Icon,
    colorClass,
    title,
    desc,
    direction = 'vertical', // 'vertical' | 'horizontal'
    onClick,
    className,
    as,
    ...props
  },
  ref,
) {
  const isClickable = !!onClick;
  const isHorizontal = direction === 'horizontal';

  return (
    <GlassCard
      ref={ref}
      as={as}
      onClick={onClick}
      className={clsx(
        isHorizontal ? 'flex items-center gap-4 p-4 min-w-[160px]' : 'flex flex-col items-start gap-5 cursor-default',
        isClickable && 'cursor-pointer hover:-translate-y-1 hover:!shadow-md !transition-all duration-300 group',
        className,
      )}
      {...props}
    >
      <div
        className={clsx(
          'flex items-center justify-center shrink-0 rounded-sm',
          isHorizontal ? 'w-12 h-12' : 'w-14 h-14',
          colorClass,
        )}
      >
        <Icon size={isHorizontal ? 24 : 28} />
      </div>

      <div className={isHorizontal ? 'text-left' : ''}>
        <h4
          className={clsx(
            'font-bold font-heading text-grey-900 dark:text-grey-50',
            isHorizontal ? 'text-xl' : 'text-xl mb-2',
          )}
        >
          {title}
        </h4>
        <p className={clsx(isHorizontal ? 'text-xs font-medium text-grey-500' : 'text-grey-600 dark:text-grey-400')}>
          {desc}
        </p>
      </div>
    </GlassCard>
  );
});

export default FeatureCard;

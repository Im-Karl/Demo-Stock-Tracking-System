import React from 'react';
import clsx from 'clsx';

export default function PageLayout({ children, className }) {
  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 overflow-x-hidden">
      
      <div className={clsx("relative z-10 w-full min-h-screen", className)}>
        {children}
      </div>
      
    </div>
  );
}
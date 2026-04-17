import React from 'react';
import clsx from 'clsx';

export default function PageLayout({ children, className, showAmbient = true }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950/20 text-neutral-800 dark:text-neutral-100 overflow-x-hidden">
      {showAmbient && (
        <>
          {/* Animated gradient orbs */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-purple-500/20 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-violet-400/20 via-fuchsia-400/15 to-pink-500/20 dark:from-violet-500/10 dark:via-fuchsia-500/10 dark:to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/15 via-teal-400/15 to-cyan-500/15 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
            <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-orange-400/15 via-amber-400/15 to-yellow-500/15 dark:from-orange-500/10 dark:via-amber-500/10 dark:to-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
          </div>
          
          {/* Subtle grid pattern */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300/30 dark:text-blue-700/20" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </>
      )}
      
      <div className={clsx("relative z-10 w-full min-h-screen", className)}>
        {children}
      </div>
      
    </div>
  );
}
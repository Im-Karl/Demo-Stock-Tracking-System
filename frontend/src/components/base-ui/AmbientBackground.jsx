import React from 'react';

export default function AmbientBackground() {
  return (
    <>
      {/* Base Background Color */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-grey-50 via-white to-primary-50/30 dark:from-black dark:via-black dark:to-primary-950/20" />

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-40">
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/30 via-indigo-400/20 to-purple-500/30 dark:from-primary-500/20 dark:via-indigo-500/15 dark:to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-violet-400/30 via-fuchsia-400/20 to-pink-500/30 dark:from-violet-500/20 dark:via-fuchsia-500/15 dark:to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-500/20 dark:from-emerald-500/15 dark:via-teal-500/15 dark:to-cyan-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-orange-400/20 via-amber-400/20 to-yellow-500/20 dark:from-orange-500/15 dark:via-amber-500/15 dark:to-yellow-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '9s', animationDelay: '1s' }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ambient-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary-300/40 dark:text-primary-700/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ambient-grid)" />
        </svg>
      </div>
    </>
  );
}

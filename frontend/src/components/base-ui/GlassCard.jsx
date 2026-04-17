import React from "react";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const cardStyles = cva(
  "backdrop-blur-xl border shadow-xl relative overflow-hidden",
  {
    variants: {
      intent: {
        default: "bg-white/70 dark:bg-neutral-900/70 border-white/50 dark:border-neutral-700/50 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent dark:before:from-white/5 dark:before:to-transparent",
        success: "bg-emerald-50/70 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50",
        warning: "bg-amber-50/70 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-700/50",
        danger: "bg-red-50/70 dark:bg-red-900/30 border-red-200/50 dark:border-red-700/50",
        info: "bg-blue-50/70 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-700/50",
      },
      rounded: {
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      intent: "default",
      rounded: "xl",
      padding: "lg",
    },
  },
);

export default function GlassCard({
  children,
  className,
  intent,
  rounded,
  padding,
  ...props
}) {
  return (
    <div
      className={clsx(cardStyles({ intent, rounded, padding }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

import React from 'react';
import { cva } from "class-variance-authority";
import clsx from "clsx";

const cardStyles = cva(
  "backdrop-blur-xl border shadow-xl",
  {
    variants: {
      intent: {
        // Box mặc định
        default: "bg-white/60 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/50",
        // Box thông báo thành công (Dùng cho trang Forgot Password)
        success: "bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-500/40",
      },
      rounded: {
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
      },
      padding: {
        none: "p-0",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      }
    },
    defaultVariants: {
      intent: "default",
      rounded: "xl",
      padding: "lg",
    }
  }
);

export default function GlassCard({ children, className, intent, rounded, padding, ...props }) {
  return (
    <div className={clsx(cardStyles({ intent, rounded, padding }), className)} {...props}>
      {children}
    </div>
  );
}
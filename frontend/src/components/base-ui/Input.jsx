import React from "react";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const inputStyles = cva(
  "w-full py-3 rounded-xl border transition-all focus:outline-none focus:ring-2",
  {
    variants: {
      intent: {
        // Cấu hình màu sắc chuẩn cho ô input (Sáng/Tối)
        default: "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 caret-blue-600 dark:caret-blue-400 placeholder-neutral-400 dark:placeholder-neutral-500",
        error: "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 border-red-300 dark:border-red-500/50 focus:ring-red-500 caret-red-600",
      },
      hasIcon: {
        true: "pl-10 pr-4",
        false: "px-4",
      },
    },
    defaultVariants: {
      intent: "default",
      hasIcon: false,
    },
  }
);

export default function Input({ className, intent, icon: Icon, ...props }) {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
      )}
      <input
        className={clsx(inputStyles({ intent, hasIcon: !!Icon }), className)}
        {...props}
      />
    </div>
  );
}
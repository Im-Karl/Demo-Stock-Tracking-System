import { Button as BaseButton } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const button = cva(
  "flex justify-center items-center font-bold rounded-xl cursor-pointer not-active:border-b-[5px] border-b-black/20 hover:not-active:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:not-active:border-b-0 disabled:translate-y-[5px]",
  {
    variants: {
      intent: {
        primary: "bg-blue-600 text-white",
        success: "bg-emerald-600 text-white",
        danger: "bg-red-500 text-white",
        warning: "bg-amber-500 text-white",
        neutral: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white",
        
        // Các bản màu "Soft" (Nền nhạt, chữ đậm) dùng cho các nút nhỏ
        primarySoft: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        successSoft: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        warningSoft: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
        dangerSoft: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      },
      size: {
        lg: "gap-x-2.25 h-14 px-7 text-lg active:h-[46px] active:mt-[10px]",
        sm: "gap-x-1.5 h-10 px-4 text-sm active:h-[35px] active:mt-[5px]",
        icon: "w-10 h-10 p-0 active:h-[35px] active:mt-[5px]", // Kích thước vuông chuyên cho nút chỉ có Icon
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
);

export default function Button({ intent, size, className, render, ...props }) {
  return (
    <BaseButton
      className={clsx(button({ intent, size }), className)}
      render={render}
      {...props}
    />
  );
}
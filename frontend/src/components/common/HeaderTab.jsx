import { cva } from "class-variance-authority";
import clsx from "clsx";

const tab = cva(
  [
    "flex",
    "justify-center",
    "items-center",
    "h-11",
    "px-5",
    "font-bold",
    "rounded-xl",
    "transition-all",
    "duration-300",
    "relative",
  ],
  {
    variants: {
      active: {
        false: [
          "text-neutral-600",
          "dark:text-neutral-400",
          "hover:text-blue-600",
          "dark:hover:text-blue-400",
          "hover:bg-blue-50/50",
          "dark:hover:bg-blue-950/30",
        ],
        true: [
          "text-blue-600",
          "dark:text-blue-400",
          "bg-blue-50",
          "dark:bg-blue-950/50",
          "shadow-md",
          "shadow-blue-500/20",
        ],
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export default function HeaderTab({ active, href, className, children }) {
  return (
    <a
      href={href}
      className={clsx(
        tab({
          active: Boolean(active || window.location.pathname.startsWith(href)),
        }),
        className,
      )}
    >
      {children}
    </a>
  );
}

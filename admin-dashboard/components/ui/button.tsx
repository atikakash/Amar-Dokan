"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "border-brand-600 bg-brand-600 text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lift",
        variant === "secondary" && "border-border bg-panel text-ink shadow-soft hover:-translate-y-0.5 hover:bg-elevated",
        variant === "danger" && "border-danger bg-danger text-white hover:bg-red-700",
        variant === "ghost" && "border-transparent bg-transparent text-muted hover:bg-panel hover:text-ink",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "icon" && "h-10 w-10 p-0",
        className,
      )}
      {...props}
    />
  );
}

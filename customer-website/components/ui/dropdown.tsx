"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Dropdown({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-panel px-3 text-sm font-semibold text-ink shadow-soft" onClick={() => setOpen((value) => !value)}>
        {label}
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 z-20 min-w-48 rounded-2xl border border-border bg-panel p-2 shadow-lift">
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

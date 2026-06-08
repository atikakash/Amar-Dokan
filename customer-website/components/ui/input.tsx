"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-muted">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-11 rounded-xl border border-border/90 bg-panel px-3 text-sm text-ink shadow-soft outline-none placeholder:text-muted transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-24 rounded-xl border border-border/90 bg-panel px-3 py-2 text-sm text-ink shadow-soft outline-none placeholder:text-muted transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 rounded-xl border border-border/90 bg-panel px-3 text-sm text-ink shadow-soft outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10", className)} {...props} />;
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) {
  return (
    <nav className="flex items-center justify-between rounded-2xl border border-border/80 bg-panel p-2 shadow-soft">
      <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm font-medium text-muted">
        Page {page} of {Math.max(1, totalPages)}
      </span>
      <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

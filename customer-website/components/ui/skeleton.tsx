import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted/15", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-panel p-3 shadow-soft">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}

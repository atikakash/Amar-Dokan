import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
};

export function Toast({ tone = "info", title, message }: { tone?: keyof typeof icons; title: string; message?: string }) {
  const Icon = icons[tone];

  return (
    <div className={cn("flex gap-3 rounded-2xl border bg-panel p-4 shadow-lift", tone === "success" && "border-emerald-200", tone === "warning" && "border-amber-200", tone === "info" && "border-border")}>
      <Icon className="h-5 w-5 text-leaf-600" />
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        {message ? <p className="mt-1 text-sm text-muted">{message}</p> : null}
      </div>
    </div>
  );
}

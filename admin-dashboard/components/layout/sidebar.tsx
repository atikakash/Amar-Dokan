"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListTree,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/categories", label: "Categories", icon: ListTree },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/coupons", label: "Coupons", icon: Percent },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, collapsed, onToggle, onClose }: { open: boolean; collapsed: boolean; onToggle: () => void; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn("fixed inset-0 z-30 bg-black/30 lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-panel transition-transform lg:static lg:translate-x-0",
          collapsed && "lg:w-20",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <BarChart3 className="h-5 w-5" />
            </span>
            <span className={cn(collapsed && "lg:hidden")}>
              <span className="block text-sm font-semibold text-ink">MewMew Admin</span>
              <span className="block text-xs text-muted">Pet shop operations</span>
            </span>
          </Link>
          <button className="rounded-md p-2 text-muted lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="hidden border-b border-border/80 p-3 lg:block">
          <button className="flex h-10 w-full items-center justify-center rounded-xl border border-border bg-surface text-muted hover:text-ink" onClick={onToggle} aria-label="Collapse sidebar">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="grid gap-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
                  collapsed && "lg:justify-center lg:px-0",
                  active ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100" : "text-muted hover:bg-surface hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

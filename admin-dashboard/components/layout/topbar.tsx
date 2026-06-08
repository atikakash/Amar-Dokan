"use client";

import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLogout, useResolvedUser } from "@/lib/hooks/use-auth";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const logout = useLogout();
  const { user } = useResolvedUser();
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    setDark((value) => {
      const next = !value;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/80 bg-panel/85 px-4 backdrop-blur-xl lg:px-6">
      <Button type="button" variant="ghost" size="icon" onClick={onMenu} className="lg:hidden" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="hidden h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-muted shadow-soft sm:flex">
        <Search className="h-4 w-4" />
        <span className="text-sm">Search products, orders, customers</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-ink">{user?.name}</p>
          <p className="text-xs capitalize text-muted">{user?.role}</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

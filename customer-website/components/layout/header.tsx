"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/use-commerce";
import { useLogout, useResolvedUser } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user } = useResolvedUser();
  const logout = useLogout();
  const cart = useCart();
  const itemCount = cart.data?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  function toggleTheme() {
    setDark((value) => {
      const next = !value;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-panel/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-leaf-600 text-white">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="hidden text-sm font-semibold text-ink sm:block">Ecommerce Store</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition",
                pathname === link.href ? "bg-leaf-50 text-leaf-700" : "text-muted hover:bg-surface hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden h-10 w-72 items-center gap-2 rounded-md border border-border bg-surface px-3 text-muted md:flex">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search catalog</span>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button type="button" onClick={toggleTheme} className="hidden rounded-xl border border-border bg-panel p-2 text-muted shadow-soft hover:text-ink sm:inline-flex" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/wishlist" className="hidden rounded-xl border border-border bg-panel p-2 text-muted shadow-soft hover:text-ink sm:inline-flex" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
          </Link>
          <Link href="/cart" className="relative rounded-xl border border-border bg-panel p-2 text-muted shadow-soft hover:text-ink" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry-500 px-1 text-xs font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          {user ? (
            <Link href="/profile" className="hidden rounded-xl border border-border bg-panel p-2 text-muted shadow-soft hover:text-ink sm:inline-flex" aria-label="Profile">
              <UserRound className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/login" className="hidden rounded-xl bg-leaf-600 px-3 py-2 text-sm font-bold text-white shadow-soft hover:bg-leaf-700 sm:inline-flex">
              Sign in
            </Link>
          )}
          <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <nav className="ml-auto h-full w-80 max-w-[85vw] border-l border-border bg-panel p-4 shadow-lift" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-ink">Menu</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink">
                  {link.label}
                </Link>
              ))}
              <Link href="/cart" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink">
                Cart
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink">
                Profile
              </Link>
              {user ? (
                <button onClick={logout} className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted hover:bg-surface hover:text-ink">
                  Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-ink">
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

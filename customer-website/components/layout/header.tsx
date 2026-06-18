"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Grid3X3, Heart, Home, MapPin, Menu, Moon, PackageSearch, PawPrint, Phone, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/use-commerce";
import { useLogout, useResolvedUser } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Track Order" },
];

const mobileLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/products", label: "Shop", icon: PawPrint },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/profile", label: "Account", icon: UserRound },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
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

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();

    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    setOpen(false);
  }

  return (
    <>
    <header className="sticky top-0 z-30 border-b border-border/80 bg-panel/95 backdrop-blur-xl">
      <div className="bg-ink text-white">
        <div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs lg:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/82">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              +880 1711-111111
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Banani, Dhaka
            </span>
            <Link href="/orders" className="inline-flex items-center gap-1.5 hover:text-white">
              <PackageSearch className="h-3.5 w-3.5" />
              Track order
            </Link>
          </div>
          <p className="font-semibold text-amber">Use WELCOME10 for 10% off local preview orders</p>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-berry-500 text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="hidden text-sm font-black text-ink sm:block">MewMew Pet Shop</span>
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

        <form onSubmit={submitSearch} className="ml-auto hidden h-10 w-80 items-center gap-2 rounded-md border border-border bg-surface px-3 text-muted md:flex">
          <Search className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            placeholder="Search food, litter, treats"
            aria-label="Search products"
          />
        </form>

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
            <Link href="/login" className="hidden rounded-xl bg-berry-500 px-3 py-2 text-sm font-bold text-white shadow-soft hover:bg-berry-600 sm:inline-flex">
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
              <form onSubmit={submitSearch} className="mb-3 flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-muted">
                <Search className="h-4 w-4" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  placeholder="Search food, litter, treats"
                  aria-label="Search products"
                />
              </form>
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
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-border bg-panel/95 px-1 shadow-lift backdrop-blur lg:hidden">
      {mobileLinks.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;

        return (
          <Link key={link.href} href={link.href} className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-berry-500" : "text-muted")}>
            <span className="relative">
              <Icon className="h-5 w-5" />
              {link.href === "/cart" && itemCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-berry-500 px-1 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
    </>
  );
}

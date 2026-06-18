import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-panel pb-16 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-muted sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr] lg:px-6">
        <div>
          <p className="text-lg font-black text-ink">MewMew Pet Shop</p>
          <p className="mt-2 max-w-sm leading-6">Food, litter, health care, and daily essentials for cats and dogs across Bangladesh.</p>
          <div className="mt-4 flex gap-2">
            <a href="https://facebook.com" className="rounded-md border border-border p-2 text-muted hover:text-ink" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" className="rounded-md border border-border p-2 text-muted hover:text-ink" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="grid gap-2">
          <p className="font-semibold text-ink">Shop</p>
          <Link href="/products" className="hover:text-ink">Products</Link>
          <Link href="/categories" className="hover:text-ink">Categories</Link>
          <Link href="/wishlist" className="hover:text-ink">Wishlist</Link>
        </div>
        <div className="grid gap-2">
          <p className="font-semibold text-ink">Account</p>
          <Link href="/orders" className="hover:text-ink">Track Order</Link>
          <Link href="/profile" className="hover:text-ink">Profile</Link>
          <Link href="/cart" className="hover:text-ink">Cart</Link>
        </div>
        <div className="grid gap-2">
          <p className="font-semibold text-ink">Contact</p>
          <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1711-111111</span>
          <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> support@mewmewpet.shop</span>
          <span className="inline-flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> Banani showroom, Dhaka</span>
        </div>
      </div>
    </footer>
  );
}

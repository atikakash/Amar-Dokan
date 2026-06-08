import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-panel">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-muted sm:grid-cols-3 lg:px-6">
        <div>
          <p className="font-semibold text-ink">Ecommerce Store</p>
          <p className="mt-2 max-w-sm">A shared catalog and order experience powered by the Laravel API.</p>
        </div>
        <div className="grid gap-2">
          <Link href="/products" className="hover:text-ink">Products</Link>
          <Link href="/categories" className="hover:text-ink">Categories</Link>
          <Link href="/wishlist" className="hover:text-ink">Wishlist</Link>
        </div>
        <div className="grid gap-2">
          <Link href="/orders" className="hover:text-ink">Orders</Link>
          <Link href="/profile" className="hover:text-ink">Profile</Link>
          <Link href="/cart" className="hover:text-ink">Cart</Link>
        </div>
      </div>
    </footer>
  );
}

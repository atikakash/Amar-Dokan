"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { ProductCard } from "@/components/features/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useWishlist } from "@/lib/hooks/use-commerce";

export function WishlistPage() {
  const wishlist = useWishlist();
  const rows = (wishlist.data ?? []).filter((item) => item.product);

  return (
    <AuthGuard>
      <SectionHeading title="Wishlist" description="Products you saved for later." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((item) => (
          <ProductCard key={item.id} product={item.product!} />
        ))}
      </div>
      {!wishlist.isLoading && rows.length === 0 ? <p className="rounded-lg border border-border bg-panel p-8 text-center text-muted">Your wishlist is empty.</p> : null}
    </AuthGuard>
  );
}

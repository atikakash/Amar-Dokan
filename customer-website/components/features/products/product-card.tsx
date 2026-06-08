"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api/types";
import { useCartMutations, useWishlist, useWishlistMutations } from "@/lib/hooks/use-commerce";
import { getStoredToken } from "@/lib/state/auth-store";
import { currency, productImage } from "@/lib/utils/format";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCartMutations();
  const wishlist = useWishlist();
  const wishlistMutations = useWishlistMutations();
  const isWished = (wishlist.data ?? []).some((item) => item.product_id === product.id);
  const image = productImage(product.images?.[0]?.url);
  const canShop = Boolean(getStoredToken());

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22 }}
      className="group overflow-hidden rounded-2xl border border-border/80 bg-panel shadow-soft"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <img src={image} alt={product.images?.[0]?.alt_text ?? product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          {product.compare_price ? (
            <span className="absolute left-3 top-3 rounded-full bg-berry-500 px-2.5 py-1 text-xs font-bold text-white shadow-soft">Deal</span>
          ) : null}
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <Link href={`/products/${product.id}`} className="line-clamp-2 text-sm font-bold text-ink hover:text-leaf-700">
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-muted">{product.category?.name ?? "Catalog"}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-ink">{currency(product.price)}</p>
            {product.compare_price ? <p className="text-xs text-muted line-through">{currency(product.compare_price)}</p> : null}
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Star className="h-3.5 w-3.5 fill-amber text-amber" />
            {product.reviews?.length ?? 0}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={!canShop || product.stock_quantity === 0 || cart.add.isPending}
            onClick={() => cart.add.mutate({ productId: product.id, quantity: 1 })}
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            disabled={!canShop || wishlistMutations.add.isPending || wishlistMutations.remove.isPending}
            onClick={() => (isWished ? wishlistMutations.remove.mutate(product.id) : wishlistMutations.add.mutate(product.id))}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={isWished ? "h-4 w-4 fill-berry-500 text-berry-500" : "h-4 w-4"} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

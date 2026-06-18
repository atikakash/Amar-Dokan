"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgePercent, CheckCircle2, CreditCard, Heart, Loader2, MapPin, Minus, PackageCheck, Plus, Share2, ShoppingCart, Star, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageMotion } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/features/products/product-card";
import { useCartMutations, useProduct, useProducts, useWishlist, useWishlistMutations } from "@/lib/hooks/use-commerce";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";
import { getStoredToken } from "@/lib/state/auth-store";
import { currency, productImage, shortDate } from "@/lib/utils/format";

export function ProductDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const product = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const cart = useCartMutations();
  const wishlist = useWishlist();
  const wishlistMutations = useWishlistMutations();
  const related = useProducts({ per_page: 4, category_id: product.data?.category_id, is_active: true });
  const image = activeImage || productImage(product.data?.images?.[0]?.url);
  const isWished = (wishlist.data ?? []).some((item) => item.product_id === product.data?.id);
  const canShop = Boolean(getStoredToken());
  const reviews = useMemo(() => product.data?.reviews ?? [], [product.data?.reviews]);
  const recentlyViewed = useRecentlyViewed(product.data);
  const optionSource =
    product.data?.attributes?.sizes ??
    product.data?.attributes?.flavours ??
    product.data?.attributes?.flavour ??
    product.data?.attributes?.weight ??
    product.data?.attributes?.size ??
    "";
  const options = optionSource.split(",").map((item) => item.trim()).filter(Boolean);
  const soldCount = product.data?.attributes?.sold_count;
  const rewardPoints = product.data?.attributes?.reward_points;
  const deliveryNote = product.data?.attributes?.delivery_note;
  const comparePrice = Number(product.data?.compare_price ?? 0);
  const price = Number(product.data?.price ?? 0);
  const discount = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  async function buyNow() {
    if (!product.data) return;

    await cart.add.mutateAsync({ productId: product.data.id, quantity });
    router.push("/checkout");
  }

  if (product.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading product
      </div>
    );
  }

  if (!product.data) {
    return <p className="rounded-lg border border-border bg-panel p-8 text-center text-muted">Product not found.</p>;
  }

  return (
    <PageMotion>
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <span className="font-medium text-ink">{product.data.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="group overflow-hidden rounded-lg border border-border/80 bg-panel p-3 shadow-soft">
            <div className="aspect-square overflow-hidden rounded-xl bg-surface">
              <img src={image} alt={product.data.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {(product.data.images ?? []).slice(0, 5).map((item) => (
              <button key={item.id} className="aspect-square overflow-hidden rounded-xl border border-border/80 bg-panel p-1 transition hover:-translate-y-0.5 hover:shadow-soft" onClick={() => setActiveImage(item.url)}>
                <img src={productImage(item.url)} alt={item.alt_text ?? product.data.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/80 bg-panel p-5 shadow-soft lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-muted">
            <span>{product.data.category?.name ?? "Product"}</span>
            <span>SKU: {product.data.sku}</span>
            {soldCount ? <span>{soldCount} sold</span> : null}
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">{product.data.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-black text-ink">{currency(product.data.price)}</span>
            {product.data.compare_price ? <span className="text-sm text-muted line-through">{currency(product.data.compare_price)}</span> : null}
            {discount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-berry-500 px-2.5 py-1 text-xs font-bold text-white">
                <BadgePercent className="h-3.5 w-3.5" />
                {discount}% off
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <Star className="h-4 w-4 fill-amber text-amber" />
              {reviews.length} reviews
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{product.data.description ?? "No description available."}</p>

          <div className="mt-5 grid gap-3 rounded-lg border border-border/80 bg-surface p-4 text-sm text-muted sm:grid-cols-3">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-leaf-700" />
              <span><b className="text-ink">{product.data.stock_quantity}</b> in stock</span>
            </span>
            {rewardPoints ? (
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber text-amber" />
                {rewardPoints} reward points
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted" />
              Share product
            </span>
          </div>

          {options.length > 0 ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-ink">Options</p>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const active = (selectedOption || options[0]) === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedOption(option)}
                      className={active ? "rounded-md border border-leaf-600 bg-leaf-50 px-3 py-2 text-sm font-bold text-leaf-700" : "rounded-md border border-border bg-panel px-3 py-2 text-sm font-semibold text-muted hover:text-ink"}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="inline-flex h-11 items-center rounded-xl border border-border bg-panel">
              <button className="px-3 text-muted" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button className="px-3 text-muted" onClick={() => setQuantity((value) => Math.min(product.data.stock_quantity, value + 1))} aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              disabled={!canShop || product.data.stock_quantity === 0 || cart.add.isPending}
              onClick={() => cart.add.mutate({ productId: product.data.id, quantity })}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              className="bg-berry-500 hover:bg-berry-600"
              disabled={!canShop || product.data.stock_quantity === 0 || cart.add.isPending}
              onClick={buyNow}
            >
              <CreditCard className="h-4 w-4" />
              Buy Now
            </Button>
            <Button
              variant="secondary"
              disabled={!canShop || wishlistMutations.add.isPending || wishlistMutations.remove.isPending}
              onClick={() => (isWished ? wishlistMutations.remove.mutate(product.data.id) : wishlistMutations.add.mutate(product.data.id))}
            >
              <Heart className={isWished ? "h-4 w-4 fill-berry-500 text-berry-500" : "h-4 w-4"} />
              Wishlist
            </Button>
          </div>
          {!canShop ? (
            <p className="mt-3 text-sm text-muted">
              <Link href="/login" className="font-medium text-leaf-700">
                Sign in
              </Link>{" "}
              to add items to cart or wishlist.
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm">
            <p className="inline-flex items-center gap-2 font-bold text-ink">
              <Truck className="h-4 w-4 text-leaf-700" />
              Delivery Information
            </p>
            <div className="grid gap-2 text-muted">
              <div className="flex justify-between gap-4">
                <span>Inside Dhaka</span>
                <span className="font-semibold text-ink">{currency(80)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Outside Dhaka</span>
                <span className="font-semibold text-ink">{currency(130)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Store pickup</span>
                <span className="font-semibold text-ink">Free</span>
              </div>
            </div>
            <p className="inline-flex items-start gap-2 text-muted">
              <MapPin className="mt-0.5 h-4 w-4 text-muted" />
              {deliveryNote ?? "Delivery charge can vary for heavy food and litter bags."}
            </p>
            <p className="inline-flex items-start gap-2 text-muted">
              <PackageCheck className="mt-0.5 h-4 w-4 text-muted" />
              Stock is confirmed before dispatch.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <SectionHeading title="Reviews" description="Approved customer reviews for this product." />
        <div className="grid gap-3">
          {reviews.map((review) => (
            <motion.div key={review.id} whileHover={{ y: -3 }}>
            <Card>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{review.title ?? "Customer review"}</p>
                    <p className="mt-1 text-sm text-muted">{review.comment ?? "No comment provided."}</p>
                  </div>
                  <span className="text-sm text-muted">{shortDate(review.created_at)}</span>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
          {reviews.length === 0 ? <p className="rounded-lg border border-border bg-panel p-6 text-center text-muted">No reviews yet.</p> : null}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading title="Related Products" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(related.data?.data ?? []).filter((item) => item.id !== product.data.id).slice(0, 4).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
      {recentlyViewed.length > 0 ? (
        <section className="mt-10">
          <SectionHeading title="Recently Viewed" description="Quickly return to products you opened during this visit." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-panel/90 p-3 shadow-lift backdrop-blur lg:hidden">
        <Button className="w-full" disabled={!canShop || product.data.stock_quantity === 0 || cart.add.isPending} onClick={() => cart.add.mutate({ productId: product.data.id, quantity })}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart - {currency(product.data.price)}
        </Button>
      </div>
    </PageMotion>
  );
}

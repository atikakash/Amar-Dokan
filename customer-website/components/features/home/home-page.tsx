"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ShopShell } from "@/components/layout/shop-shell";
import { ProductCard } from "@/components/features/products/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageMotion, Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCategories, useProducts } from "@/lib/hooks/use-commerce";
import { currency, productImage } from "@/lib/utils/format";

export function HomePage() {
  const products = useProducts({ per_page: 8, is_active: true, is_featured: true });
  const fallbackProducts = useProducts({ per_page: 8, is_active: true });
  const categories = useCategories({ per_page: 6, is_active: true });
  const rows = products.data?.data.length ? products.data.data : fallbackProducts.data?.data ?? [];
  const heroImage = productImage(rows[0]?.images?.[0]?.url);

  return (
    <ShopShell>
      <PageMotion>
      <section className="premium-gradient relative grid overflow-hidden rounded-2xl border border-white/15 shadow-lift lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-h-[520px] flex-col justify-center p-6 text-white sm:p-10 lg:p-12">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Premium commerce experience
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-6xl">Designed shopping for products people want to trust.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
            Curated discovery, clean product detail pages, smooth checkout paths, and account flows tuned for conversion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products">
              <Button className="border-white bg-white text-leaf-900 hover:bg-white/90">
                Shop Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="secondary" className="border-white/25 bg-white/10 text-white hover:bg-white/15">Browse Categories</Button>
            </Link>
          </div>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 text-xs text-white/78">
            {["Fast checkout", "Verified stock", "Order tracking"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
                <BadgeCheck className="h-4 w-4 text-white" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[360px] p-5 lg:p-8">
          <div className="h-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 shadow-lift backdrop-blur">
            <img src={heroImage} alt="Featured product" className="h-full w-full rounded-xl object-cover" />
          </div>
          <div className="absolute bottom-10 left-8 max-w-xs rounded-2xl border border-white/20 bg-white/85 p-4 text-ink shadow-lift backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wide text-leaf-700">Flash deal</p>
            <p className="mt-1 text-sm font-bold">{rows[0]?.name ?? "Featured product"}</p>
            <p className="mt-2 text-xl font-black">{rows[0] ? currency(rows[0].price) : "$129.00"}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Verified Checkout", note: "Protected customer flows use Sanctum auth.", icon: ShieldCheck },
          { title: "Inventory Aware", note: "Cart actions check live stock from the API.", icon: PackageCheck },
          { title: "Order Tracking", note: "Review order status from your account.", icon: Truck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title}>
            <Card className="h-full transition hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.note}</p>
                </div>
              </CardContent>
            </Card>
            </Reveal>
          );
        })}
      </section>

      <section className="mt-12">
        <SectionHeading
          title="Featured Products"
          description="A fast look at what is available now."
          action={
            <Link href="/products" className="text-sm font-medium text-leaf-700 hover:text-leaf-800">
              View all
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading title="Shop by Category" description="Jump into organized product groups." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories.data?.data ?? []).map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`} className="group overflow-hidden rounded-2xl border border-border/80 bg-panel shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <div className="aspect-[16/8] bg-surface">
                <img src={productImage(category.image)} alt={category.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-ink">{category.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{category.description ?? "Explore products in this category."}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-ink text-white">
          <CardContent>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-white/80"><Clock3 className="h-4 w-4" /> Flash Deals</p>
            <h2 className="mt-3 text-3xl font-black">Limited-time offers with clean, low-friction buying.</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">Deal cards, sharp pricing, trust markers, and cart actions stay visible and focused.</p>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.slice(0, 2).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-3">
        {[
          ["Excellent buying flow", "The product pages feel polished and the cart is simple to understand."],
          ["Trustworthy checkout", "The minimal checkout layout makes it clear what happens next."],
          ["Fast account access", "Orders, wishlist, and profile are easy to reach on mobile."],
        ].map(([title, quote]) => (
          <Card key={title}>
            <CardContent>
              <p className="text-sm leading-6 text-muted">&ldquo;{quote}&rdquo;</p>
              <p className="mt-4 font-bold text-ink">{title}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-border/80 bg-panel p-6 shadow-soft sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <h2 className="text-2xl font-black text-ink">Get curated drops and private offers.</h2>
            <p className="mt-2 text-sm text-muted">A focused newsletter block for high-intent shoppers.</p>
          </div>
          <form className="flex gap-2">
            <input className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-4 focus:ring-leaf-500/10" placeholder="you@example.com" />
            <Button type="button">Subscribe</Button>
          </form>
        </div>
      </section>
      </PageMotion>
    </ShopShell>
  );
}

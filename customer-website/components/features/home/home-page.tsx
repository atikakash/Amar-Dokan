"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, BadgePercent, CheckCircle2, Clock3, Gift, MapPin, PackageCheck, Phone, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { ShopShell } from "@/components/layout/shop-shell";
import { ProductCard } from "@/components/features/products/product-card";
import { Button } from "@/components/ui/button";
import { PageMotion, Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCategories, useProducts } from "@/lib/hooks/use-commerce";
import { currency, productImage } from "@/lib/utils/format";

const featureTiles = [
  { title: "Dhaka Delivery", note: "Inside Dhaka 1-2 days", icon: Truck },
  { title: "Authentic Products", note: "Verified pet essentials", icon: ShieldCheck },
  { title: "Reward Points", note: "Earn points on orders", icon: Gift },
];

const testimonials = [
  ["Fast and careful delivery", "Food arrived fresh, sealed, and faster than expected."],
  ["Good product guidance", "The team helped me pick the right litter for two cats."],
  ["Reliable repeat orders", "My monthly cat food and treats are easy to reorder."],
];

export function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const featuredProducts = useProducts({ per_page: 8, is_active: true, is_featured: true });
  const activeProducts = useProducts({ per_page: 12, is_active: true });
  const categories = useCategories({ per_page: 8, is_active: true });
  const rows = [...(featuredProducts.data?.data ?? []), ...(activeProducts.data?.data ?? [])]
    .filter((product, index, products) => products.findIndex((item) => item.id === product.id) === index)
    .slice(0, 12);
  const categoryRows = categories.data?.data ?? [];
  const saleProducts = rows.filter((product) => product.compare_price).slice(0, 4);
  const heroProduct = rows[0];
  const heroImage = productImage(heroProduct?.images?.[0]?.url);

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribedEmail(newsletterEmail.trim());
    setNewsletterEmail("");
  }

  return (
    <ShopShell>
      <PageMotion>
        <section className="grid gap-4 lg:grid-cols-[260px_1fr_280px]">
          <aside className="rounded-lg border border-border bg-panel p-4 shadow-soft">
            <p className="mb-3 text-sm font-black text-ink">Shop by Category</p>
            <div className="grid gap-1">
              {categoryRows.map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`} className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink">
                  {category.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </aside>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-ink shadow-lift">
            <img src={heroImage} alt={heroProduct?.name ?? "Pet supplies"} className="absolute inset-0 h-full w-full object-cover opacity-72" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/72 to-transparent" />
            <div className="relative flex min-h-[420px] max-w-2xl flex-col justify-center p-6 text-white sm:p-10">
              <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-bold uppercase backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Pet food, litter, treats and care
              </p>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">Daily essentials for happy cats and dogs.</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/78">
                A shopfront built for quick category browsing, flash deals, local delivery clarity, and repeat pet-care orders.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/products">
                  <Button className="bg-berry-500 text-white hover:bg-berry-600">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="secondary" className="border-white/25 bg-white/10 text-white hover:bg-white/15">Browse Categories</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-panel p-4 shadow-soft">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-berry-500">
                <BadgePercent className="h-4 w-4" />
                Flash Deal
              </p>
              <p className="mt-3 text-lg font-black text-ink">{saleProducts[0]?.name ?? "Pet care bundle"}</p>
              <p className="mt-2 text-2xl font-black text-ink">{saleProducts[0] ? currency(saleProducts[0].price) : currency(1450)}</p>
              <p className="mt-1 text-sm text-muted">Limited stock with fast Dhaka delivery.</p>
              <Link href={saleProducts[0] ? `/products/${saleProducts[0].id}` : "/products"} className="mt-4 inline-flex text-sm font-bold text-leaf-700 hover:text-leaf-800">
                View deal
              </Link>
            </div>
            <div className="rounded-lg border border-border bg-leaf-50 p-4 text-leaf-900 shadow-soft">
              <p className="text-sm font-black">Hotline</p>
              <p className="mt-2 inline-flex items-center gap-2 text-lg font-black">
                <Phone className="h-4 w-4" />
                +880 1711-111111
              </p>
              <p className="mt-2 text-xs leading-5">Ask about stock, delivery charge, or pet-food recommendations.</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {featureTiles.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <div className="flex h-full gap-3 rounded-lg border border-border bg-panel p-4 shadow-soft">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface text-leaf-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Featured Categories"
            description="Jump straight into the shelves pet owners visit most."
            action={<Link href="/categories" className="text-sm font-bold text-leaf-700 hover:text-leaf-800">View all</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryRows.slice(0, 8).map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group overflow-hidden rounded-lg border border-border bg-panel shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-[5/3] bg-surface">
                  <img src={productImage(category.image)} alt={category.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-ink">{category.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{category.description ?? "Explore pet products in this category."}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Flash Sale"
            description="Discounted essentials with stock-aware cart actions."
            action={<Link href="/products" className="text-sm font-bold text-leaf-700 hover:text-leaf-800">Shop sale</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(saleProducts.length ? saleProducts : rows.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading title="New Arrivals" description="Fresh picks for food, litter, grooming, and treats." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-lg border border-border bg-panel p-5 shadow-soft">
            <p className="inline-flex items-center gap-2 text-sm font-black text-ink">
              <Clock3 className="h-4 w-4 text-berry-500" />
              Delivery Details
            </p>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              <div className="flex justify-between gap-4 rounded-md bg-surface p-3">
                <span>Inside Dhaka</span>
                <span className="font-bold text-ink">{currency(80)}</span>
              </div>
              <div className="flex justify-between gap-4 rounded-md bg-surface p-3">
                <span>Outside Dhaka</span>
                <span className="font-bold text-ink">{currency(130)}</span>
              </div>
              <div className="flex justify-between gap-4 rounded-md bg-surface p-3">
                <span>Heavy litter/food bags</span>
                <span className="font-bold text-ink">Variable</span>
              </div>
            </div>
            <p className="mt-4 inline-flex items-start gap-2 text-sm leading-6 text-muted">
              <PackageCheck className="mt-0.5 h-4 w-4 text-leaf-700" />
              Orders are packed after stock confirmation from the store team.
            </p>
          </aside>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map(([title, quote]) => (
            <div key={title} className="rounded-lg border border-border bg-panel p-5 shadow-soft">
              <div className="mb-3 flex gap-1 text-amber">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-amber" />
                ))}
              </div>
              <p className="text-sm leading-6 text-muted">&ldquo;{quote}&rdquo;</p>
              <p className="mt-4 font-bold text-ink">{title}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-4 rounded-lg border border-border bg-panel p-6 shadow-soft lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-leaf-700">
              <MapPin className="h-4 w-4" />
              Banani showroom, Dhaka
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">Get pet-care drops and private offers.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">New food arrivals, litter restocks, and monthly offer alerts for repeat shoppers.</p>
          </div>
          <form className="grid gap-2 sm:flex" onSubmit={subscribe}>
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:ring-4 focus:ring-leaf-500/10"
              placeholder="you@example.com"
            />
            <Button className="bg-berry-500 hover:bg-berry-600">Subscribe</Button>
          </form>
          {subscribedEmail ? (
            <p className="inline-flex items-center gap-2 text-sm font-medium text-leaf-700 lg:col-start-2">
              <CheckCircle2 className="h-4 w-4" />
              {subscribedEmail} is on the list.
            </p>
          ) : null}
        </section>
      </PageMotion>
    </ShopShell>
  );
}

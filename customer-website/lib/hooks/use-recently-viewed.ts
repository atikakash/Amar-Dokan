"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/api/types";

const storageKey = "recently-viewed-products";
const limit = 6;

function readRecentProducts() {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(storageKey);
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

function writeRecentProducts(products: Product[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(storageKey, JSON.stringify(products.slice(0, limit)));
}

export function useRecentlyViewed(product?: Product) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setItems(readRecentProducts());
  }, []);

  useEffect(() => {
    if (!product) return;

    setItems((current) => {
      const next = [product, ...current.filter((item) => item.id !== product.id)].slice(0, limit);
      writeRecentProducts(next);

      return next;
    });
  }, [product]);

  return useMemo(() => items.filter((item) => item.id !== product?.id), [items, product?.id]);
}

"use client";

import axios from "axios";
import type { AuthResponse, Category, Coupon, Order, OrderStatus, Paginated, Product, User } from "@/lib/api/types";
import type { ProductPayload } from "@/lib/api/endpoints";

const now = new Date().toISOString();

const adminUser: User = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  phone: "+8801700000001",
  role: "admin",
  email_verified_at: now,
  created_at: now,
};

let categories: Category[] = [
  {
    id: 1,
    parent_id: null,
    name: "Electronics",
    slug: "electronics",
    description: "Phones, audio, and smart devices.",
    image: null,
    is_active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    parent_id: null,
    name: "Fashion",
    slug: "fashion",
    description: "Everyday apparel and accessories.",
    image: null,
    is_active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    parent_id: null,
    name: "Home",
    slug: "home",
    description: "Home, kitchen, and lifestyle goods.",
    image: null,
    is_active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
];

let products: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Nova Wireless Headphones",
    slug: "nova-wireless-headphones",
    sku: "AUD-NOVA-01",
    description: "Noise-cancelling headphones with long battery life.",
    price: "129.00",
    compare_price: "159.00",
    stock_quantity: 18,
    low_stock_threshold: 8,
    is_active: true,
    is_featured: true,
    attributes: { color: "Black", warranty: "1 year" },
    images: [{ id: 1, url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", alt_text: "Headphones", sort_order: 1, is_primary: true }],
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    category_id: 1,
    name: "Pulse Smart Watch",
    slug: "pulse-smart-watch",
    sku: "WCH-PULSE-02",
    description: "Fitness tracking, notifications, and sleep insights.",
    price: "89.00",
    compare_price: null,
    stock_quantity: 4,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: false,
    attributes: { color: "Graphite" },
    images: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    category_id: 2,
    name: "Everyday Canvas Tote",
    slug: "everyday-canvas-tote",
    sku: "BAG-CANVAS-03",
    description: "Durable tote bag for daily carry.",
    price: "34.00",
    compare_price: "42.00",
    stock_quantity: 25,
    low_stock_threshold: 6,
    is_active: true,
    is_featured: true,
    attributes: { material: "Canvas" },
    images: [],
    created_at: now,
    updated_at: now,
  },
];

const customers: User[] = [
  {
    id: 10,
    name: "Nadia Rahman",
    email: "nadia@example.com",
    phone: "+8801711111111",
    role: "customer",
    email_verified_at: now,
    created_at: now,
  },
  {
    id: 11,
    name: "Arif Hasan",
    email: "arif@example.com",
    phone: "+8801811111111",
    role: "customer",
    email_verified_at: null,
    created_at: now,
  },
];

let orders: Order[] = [
  {
    id: 1,
    order_number: "ORD-10001",
    status: "processing",
    payment_status: "paid",
    subtotal: "218.00",
    discount_total: "10.00",
    tax_total: "0.00",
    shipping_total: "5.00",
    total: "213.00",
    coupon_code: "WELCOME10",
    customer_note: null,
    shipping_address: { city: "Dhaka", address: "Banani" },
    billing_address: null,
    user: customers[0],
    items: [
      { id: 1, product_id: 1, product_name: "Nova Wireless Headphones", product_sku: "AUD-NOVA-01", quantity: 1, unit_price: "129.00", total: "129.00" },
      { id: 2, product_id: 2, product_name: "Pulse Smart Watch", product_sku: "WCH-PULSE-02", quantity: 1, unit_price: "89.00", total: "89.00" },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    order_number: "ORD-10002",
    status: "pending",
    payment_status: "unpaid",
    subtotal: "68.00",
    discount_total: "0.00",
    tax_total: "0.00",
    shipping_total: "4.00",
    total: "72.00",
    coupon_code: null,
    customer_note: "Please call before delivery.",
    shipping_address: { city: "Chattogram", address: "Agrabad" },
    billing_address: null,
    user: customers[1],
    items: [{ id: 3, product_id: 3, product_name: "Everyday Canvas Tote", product_sku: "BAG-CANVAS-03", quantity: 2, unit_price: "34.00", total: "68.00" }],
    created_at: now,
    updated_at: now,
  },
];

let coupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME10",
    type: "percent",
    value: "10",
    min_order_amount: "50.00",
    max_discount_amount: "25.00",
    starts_at: now,
    expires_at: "2026-12-31T23:59:59.000Z",
    usage_limit: 500,
    used_count: 42,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    code: "SHIPFREE",
    type: "fixed",
    value: "5.00",
    min_order_amount: "100.00",
    max_discount_amount: null,
    starts_at: now,
    expires_at: null,
    usage_limit: null,
    used_count: 17,
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];

function isLocalPreview() {
  if (typeof window === "undefined") return false;

  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

export function canUseDemoFallback(error: unknown) {
  return isLocalPreview() && axios.isAxiosError(error) && !error.response;
}

function page<T>(data: T[]): Paginated<T> {
  return {
    data,
    meta: {
      current_page: 1,
      from: data.length ? 1 : null,
      last_page: 1,
      per_page: data.length,
      to: data.length || null,
      total: data.length,
    },
  };
}

function withCategories(product: Product): Product {
  return { ...product, category: categories.find((category) => category.id === product.category_id) };
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export const demoApi = {
  login(payload: { email: string; password: string }): AuthResponse {
    if (payload.email !== "admin@example.com" || payload.password !== "password") {
      throw new Error("Use admin@example.com and password for local preview.");
    }

    return { token_type: "Bearer", access_token: "demo-admin-token", user: adminUser };
  },
  profile(): User {
    return adminUser;
  },
  products: {
    list(): Paginated<Product> {
      return page(products.map(withCategories));
    },
    save(payload: ProductPayload & { id?: number }): Product {
      const product: Product = {
        id: payload.id ?? nextId(products),
        category_id: Number(payload.category_id ?? categories[0]?.id ?? 1),
        name: payload.name ?? "Untitled Product",
        slug: payload.slug ?? "untitled-product",
        sku: payload.sku ?? `SKU-${Date.now()}`,
        description: payload.description ?? null,
        price: String(payload.price ?? "0.00"),
        compare_price: payload.compare_price ? String(payload.compare_price) : null,
        stock_quantity: Number(payload.stock_quantity ?? 0),
        low_stock_threshold: Number(payload.low_stock_threshold ?? 5),
        is_active: Boolean(payload.is_active ?? true),
        is_featured: Boolean(payload.is_featured ?? false),
        attributes: null,
        images: (payload.images ?? []).map((image, index) => ({
          id: index + 1,
          url: image.url,
          alt_text: image.alt_text ?? null,
          is_primary: Boolean(image.is_primary),
          sort_order: image.sort_order ?? index + 1,
        })),
        created_at: now,
        updated_at: new Date().toISOString(),
      };

      products = payload.id ? products.map((item) => (item.id === payload.id ? product : item)) : [product, ...products];
      return withCategories(product);
    },
    remove(id: number) {
      products = products.filter((product) => product.id !== id);
    },
  },
  categories: {
    list(): Paginated<Category> {
      return page(categories.map((category) => ({ ...category, parent: categories.find((item) => item.id === category.parent_id) ?? null })));
    },
    save(payload: Partial<Category> & { id?: number }): Category {
      const category: Category = {
        id: payload.id ?? nextId(categories),
        parent_id: payload.parent_id ?? null,
        name: payload.name ?? "Untitled Category",
        slug: payload.slug ?? "untitled-category",
        description: payload.description ?? null,
        image: payload.image ?? null,
        is_active: Boolean(payload.is_active ?? true),
        sort_order: Number(payload.sort_order ?? 0),
        created_at: now,
        updated_at: new Date().toISOString(),
      };

      categories = payload.id ? categories.map((item) => (item.id === payload.id ? category : item)) : [category, ...categories];
      return category;
    },
    remove(id: number) {
      categories = categories.filter((category) => category.id !== id);
    },
  },
  orders: {
    list(): Paginated<Order> {
      return page(orders);
    },
    updateStatus(id: number, status: OrderStatus): Order {
      orders = orders.map((order) => (order.id === id ? { ...order, status, updated_at: new Date().toISOString() } : order));
      return orders.find((order) => order.id === id)!;
    },
  },
  coupons: {
    list(): Paginated<Coupon> {
      return page(coupons);
    },
    save(payload: Partial<Coupon> & { id?: number }): Coupon {
      const coupon: Coupon = {
        id: payload.id ?? nextId(coupons),
        code: payload.code ?? "NEWCODE",
        type: payload.type ?? "percent",
        value: String(payload.value ?? "0"),
        min_order_amount: String(payload.min_order_amount ?? "0"),
        max_discount_amount: payload.max_discount_amount ? String(payload.max_discount_amount) : null,
        starts_at: payload.starts_at ?? null,
        expires_at: payload.expires_at ?? null,
        usage_limit: payload.usage_limit ?? null,
        used_count: payload.used_count ?? 0,
        is_active: Boolean(payload.is_active ?? true),
        created_at: now,
        updated_at: new Date().toISOString(),
      };

      coupons = payload.id ? coupons.map((item) => (item.id === payload.id ? coupon : item)) : [coupon, ...coupons];
      return coupon;
    },
    remove(id: number) {
      coupons = coupons.filter((coupon) => coupon.id !== id);
    },
  },
  customers: {
    list(): Paginated<User> {
      return page(customers);
    },
  },
};

"use client";

import axios from "axios";
import type { ApiFilters, AuthResponse, Category, Coupon, Order, OrderStatus, Paginated, Product, User } from "@/lib/api/types";
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
    name: "Cat Food",
    slug: "cat-food",
    description: "Dry food, wet food, kitten meals, and premium formulas.",
    image: null,
    is_active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    parent_id: null,
    name: "Cat Litter",
    slug: "cat-litter",
    description: "Clumping litter, tofu litter, deodorizer, and trays.",
    image: null,
    is_active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    parent_id: null,
    name: "Accessories",
    slug: "accessories",
    description: "Bowls, collars, carriers, toys, grooming, and care items.",
    image: null,
    is_active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 4,
    parent_id: null,
    name: "Dog Essentials",
    slug: "dog-essentials",
    description: "Food, treats, grooming, and daily care for dogs.",
    image: null,
    is_active: true,
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
  {
    id: 5,
    parent_id: null,
    name: "Health Care",
    slug: "health-care",
    description: "Deworming, supplements, hygiene, and routine wellness.",
    image: null,
    is_active: true,
    sort_order: 5,
    created_at: now,
    updated_at: now,
  },
  {
    id: 6,
    parent_id: null,
    name: "Treats",
    slug: "treats",
    description: "Crunchy bites, creamy treats, and reward snacks.",
    image: null,
    is_active: true,
    sort_order: 6,
    created_at: now,
    updated_at: now,
  },
];

let products: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Reflex Plus Adult Cat Food Salmon 1.5kg",
    slug: "reflex-plus-adult-cat-food-salmon-1-5kg",
    sku: "CAT-REF-SAL-15",
    description: "Complete salmon dry food for adult cats with balanced protein, vitamins, and digestive support.",
    price: "1450.00",
    compare_price: "1650.00",
    stock_quantity: 18,
    low_stock_threshold: 8,
    is_active: true,
    is_featured: true,
    attributes: { weight: "1.5kg", flavour: "Salmon", sold_count: "126", reward_points: "14" },
    images: [{ id: 1, url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119", alt_text: "Cat food bag", sort_order: 1, is_primary: true }],
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    category_id: 2,
    name: "Tofu Cat Litter Green Tea 6L",
    slug: "tofu-cat-litter-green-tea-6l",
    sku: "LIT-TOFU-GT-06",
    description: "Low-dust clumping tofu litter with green tea fragrance and easy disposal.",
    price: "780.00",
    compare_price: "900.00",
    stock_quantity: 4,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    attributes: { size: "6L", scent: "Green Tea", sold_count: "82", reward_points: "8" },
    images: [{ id: 2, url: "https://images.unsplash.com/photo-1570824104453-508955ab713e", alt_text: "Cat litter", sort_order: 1, is_primary: true }],
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    category_id: 3,
    name: "Adjustable Cat Harness and Leash Set",
    slug: "adjustable-cat-harness-and-leash-set",
    sku: "ACC-HARNESS-03",
    description: "Soft breathable harness with secure clips and a matching leash for outdoor walks.",
    price: "520.00",
    compare_price: "650.00",
    stock_quantity: 25,
    low_stock_threshold: 6,
    is_active: true,
    is_featured: true,
    attributes: { sizes: "S, M, L", colors: "Red, Blue, Black", sold_count: "64", reward_points: "5" },
    images: [{ id: 3, url: "https://images.unsplash.com/photo-1545249390-6bdfa286032f", alt_text: "Cat accessory", sort_order: 1, is_primary: true }],
    created_at: now,
    updated_at: now,
  },
  {
    id: 4,
    category_id: 6,
    name: "Creamy Cat Treat Tuna Pack",
    slug: "creamy-cat-treat-tuna-pack",
    sku: "TRT-CREAM-TUNA-04",
    description: "Smooth tuna treat sticks for training, bonding, and picky snack moments.",
    price: "260.00",
    compare_price: null,
    stock_quantity: 20,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    attributes: { flavour: "Tuna", pack: "5 sticks", sold_count: "213", reward_points: "3" },
    images: [{ id: 4, url: "https://images.unsplash.com/photo-1601758064224-c3c94cf1f14f", alt_text: "Pet treats", sort_order: 1, is_primary: true }],
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
    subtotal: "2230.00",
    discount_total: "223.00",
    tax_total: "0.00",
    shipping_total: "80.00",
    total: "2087.00",
    coupon_code: "WELCOME10",
    customer_note: null,
    shipping_address: { city: "Dhaka", address: "Banani" },
    billing_address: null,
    user: customers[0],
    items: [
      { id: 1, product_id: 1, product_name: "Reflex Plus Adult Cat Food Salmon 1.5kg", product_sku: "CAT-REF-SAL-15", quantity: 1, unit_price: "1450.00", total: "1450.00" },
      { id: 2, product_id: 2, product_name: "Tofu Cat Litter Green Tea 6L", product_sku: "LIT-TOFU-GT-06", quantity: 1, unit_price: "780.00", total: "780.00" },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    order_number: "ORD-10002",
    status: "pending",
    payment_status: "unpaid",
    subtotal: "1040.00",
    discount_total: "0.00",
    tax_total: "0.00",
    shipping_total: "130.00",
    total: "1170.00",
    coupon_code: null,
    customer_note: "Please call before delivery.",
    shipping_address: { city: "Chattogram", address: "Agrabad" },
    billing_address: null,
    user: customers[1],
    items: [{ id: 3, product_id: 3, product_name: "Adjustable Cat Harness and Leash Set", product_sku: "ACC-HARNESS-03", quantity: 2, unit_price: "520.00", total: "1040.00" }],
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
    min_order_amount: "500.00",
    max_discount_amount: "250.00",
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
    value: "80.00",
    min_order_amount: "1500.00",
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

function matchesBoolean(value: boolean, filter: string | number | boolean | undefined | null) {
  if (filter === undefined || filter === null || filter === "") return true;

  return value === (filter === true || filter === "true" || filter === 1 || filter === "1");
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
    list(filters?: ApiFilters): Paginated<Product> {
      let rows = products.map(withCategories);

      if (filters?.category_id) {
        rows = rows.filter((product) => product.category_id === Number(filters.category_id));
      }

      if (filters?.is_active !== undefined) {
        rows = rows.filter((product) => matchesBoolean(product.is_active, filters.is_active));
      }

      if (filters?.is_featured !== undefined) {
        rows = rows.filter((product) => matchesBoolean(product.is_featured, filters.is_featured));
      }

      if (filters?.search) {
        const search = String(filters.search).toLowerCase();
        rows = rows.filter((product) =>
          [product.name, product.sku, product.description, product.category?.name]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(search)),
        );
      }

      return page(rows.slice(0, Number(filters?.per_page ?? rows.length)));
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
    list(filters?: ApiFilters): Paginated<Category> {
      let rows = categories.map((category) => ({ ...category, parent: categories.find((item) => item.id === category.parent_id) ?? null }));

      if (filters?.is_active !== undefined) {
        rows = rows.filter((category) => matchesBoolean(category.is_active, filters.is_active));
      }

      if (filters?.search) {
        const search = String(filters.search).toLowerCase();
        rows = rows.filter((category) => category.name.toLowerCase().includes(search));
      }

      return page(rows.slice(0, Number(filters?.per_page ?? rows.length)));
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
    list(filters?: ApiFilters): Paginated<Order> {
      let rows = [...orders];

      if (filters?.status) {
        rows = rows.filter((order) => order.status === filters.status);
      }

      return page(rows.slice(0, Number(filters?.per_page ?? rows.length)));
    },
    updateStatus(id: number, status: OrderStatus): Order {
      orders = orders.map((order) => (order.id === id ? { ...order, status, updated_at: new Date().toISOString() } : order));
      return orders.find((order) => order.id === id)!;
    },
  },
  coupons: {
    list(filters?: ApiFilters): Paginated<Coupon> {
      let rows = [...coupons];

      if (filters?.is_active !== undefined) {
        rows = rows.filter((coupon) => matchesBoolean(coupon.is_active, filters.is_active));
      }

      if (filters?.search) {
        const search = String(filters.search).toLowerCase();
        rows = rows.filter((coupon) => coupon.code.toLowerCase().includes(search));
      }

      return page(rows.slice(0, Number(filters?.per_page ?? rows.length)));
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
    list(filters?: ApiFilters): Paginated<User> {
      let rows = [...customers];

      if (filters?.role) {
        rows = rows.filter((customer) => customer.role === filters.role);
      }

      if (filters?.search) {
        const search = String(filters.search).toLowerCase();
        rows = rows.filter((customer) =>
          [customer.name, customer.email, customer.phone]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(search)),
        );
      }

      return page(rows.slice(0, Number(filters?.per_page ?? rows.length)));
    },
  },
};

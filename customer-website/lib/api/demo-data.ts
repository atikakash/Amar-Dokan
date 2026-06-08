"use client";

import axios from "axios";
import type {
  ApiEnvelope,
  AuthResponse,
  Cart,
  CartItem,
  Category,
  CheckoutPayload,
  CouponValidation,
  Order,
  Paginated,
  Payment,
  PaymentGateway,
  Product,
  User,
  WishlistItem,
} from "@/lib/api/types";

const now = new Date().toISOString();

let currentUser: User = {
  id: 10,
  name: "Customer User",
  email: "customer@example.com",
  phone: "+8801711111111",
  role: "customer",
  email_verified_at: now,
  created_at: now,
};

const categories: Category[] = [
  {
    id: 1,
    parent_id: null,
    name: "Electronics",
    slug: "electronics",
    description: "Phones, audio, and smart devices.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
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
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
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
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    is_active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
];

const products: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Nova Wireless Headphones",
    slug: "nova-wireless-headphones",
    sku: "AUD-NOVA-01",
    description: "Noise-cancelling wireless headphones with soft ear cups and all-day battery life.",
    price: "129.00",
    compare_price: "159.00",
    stock_quantity: 18,
    low_stock_threshold: 8,
    is_active: true,
    is_featured: true,
    attributes: { color: "Black", warranty: "1 year" },
    images: [{ id: 1, url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", alt_text: "Headphones", sort_order: 1, is_primary: true }],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    category_id: 1,
    name: "Pulse Smart Watch",
    slug: "pulse-smart-watch",
    sku: "WCH-PULSE-02",
    description: "Fitness tracking, notifications, sleep insights, and water resistance.",
    price: "89.00",
    compare_price: null,
    stock_quantity: 4,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    attributes: { color: "Graphite" },
    images: [{ id: 2, url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", alt_text: "Smart watch", sort_order: 1, is_primary: true }],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    category_id: 2,
    name: "Everyday Canvas Tote",
    slug: "everyday-canvas-tote",
    sku: "BAG-CANVAS-03",
    description: "Durable tote bag with reinforced handles for daily carry.",
    price: "34.00",
    compare_price: "42.00",
    stock_quantity: 25,
    low_stock_threshold: 6,
    is_active: true,
    is_featured: false,
    attributes: { material: "Canvas" },
    images: [{ id: 3, url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7", alt_text: "Canvas tote", sort_order: 1, is_primary: true }],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 4,
    category_id: 3,
    name: "Ceramic Pour Over Set",
    slug: "ceramic-pour-over-set",
    sku: "HOM-POUR-04",
    description: "A compact ceramic set for slow coffee mornings.",
    price: "48.00",
    compare_price: null,
    stock_quantity: 12,
    low_stock_threshold: 4,
    is_active: true,
    is_featured: true,
    attributes: { material: "Ceramic" },
    images: [{ id: 4, url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd", alt_text: "Pour over coffee", sort_order: 1, is_primary: true }],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
];

let cart: Cart = {
  id: 1,
  status: "active",
  items: [makeCartItem(1, 1, 1), makeCartItem(2, 2, 1)],
  subtotal: 218,
  created_at: now,
  updated_at: now,
};

let wishlist: WishlistItem[] = [
  { id: 1, product_id: 3, product: withCategory(products[2]), created_at: now },
  { id: 2, product_id: 4, product: withCategory(products[3]), created_at: now },
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
    shipping_total: "0.00",
    total: "208.00",
    coupon_code: "WELCOME10",
    customer_note: null,
    shipping_address: { city: "Dhaka", address_line_1: "Banani" },
    billing_address: null,
    user: currentUser,
    items: [
      { id: 1, product_id: 1, product_name: "Nova Wireless Headphones", product_sku: "AUD-NOVA-01", quantity: 1, unit_price: "129.00", total: "129.00" },
      { id: 2, product_id: 2, product_name: "Pulse Smart Watch", product_sku: "WCH-PULSE-02", quantity: 1, unit_price: "89.00", total: "89.00" },
    ],
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

function withCategory(product: Product): Product {
  return { ...product, category: categories.find((category) => category.id === product.category_id) };
}

function makeCartItem(id: number, productId: number, quantity: number): CartItem {
  const product = products.find((item) => item.id === productId)!;
  const unitPrice = Number(product.price);

  return {
    id,
    product_id: productId,
    quantity,
    unit_price: unitPrice.toFixed(2),
    line_total: (unitPrice * quantity).toFixed(2),
    product: withCategory(product),
  };
}

function refreshCart() {
  cart = {
    ...cart,
    subtotal: cart.items.reduce((sum, item) => sum + Number(item.line_total), 0),
    updated_at: new Date().toISOString(),
  };

  return cart;
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export const demoApi = {
  register(payload: { name: string; email: string; phone?: string }): AuthResponse {
    currentUser = {
      ...currentUser,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      email_verified_at: now,
    };

    return { token_type: "Bearer", access_token: "demo-customer-token", user: currentUser };
  },
  login(payload: { email: string; password: string }): AuthResponse {
    if (payload.email !== "customer@example.com" || payload.password !== "password") {
      throw new Error("Use customer@example.com and password for local preview.");
    }

    return { token_type: "Bearer", access_token: "demo-customer-token", user: currentUser };
  },
  profile(): User {
    return currentUser;
  },
  updateProfile(payload: Partial<Pick<User, "name" | "email" | "phone">>): User {
    currentUser = { ...currentUser, ...payload };
    return currentUser;
  },
  categories(): Paginated<Category> {
    return page(categories);
  },
  products(): Paginated<Product> {
    return page(products.map(withCategory));
  },
  product(id: number | string): Product {
    return withCategory(products.find((product) => product.id === Number(id) || product.slug === id) ?? products[0]);
  },
  productReviews(): ApiEnvelope<[]> {
    return { data: [] };
  },
  cart: {
    show(): Cart {
      return refreshCart();
    },
    add(productId: number, quantity: number): Cart {
      const existing = cart.items.find((item) => item.product_id === productId);

      if (existing) {
        existing.quantity += quantity;
        existing.line_total = (Number(existing.unit_price) * existing.quantity).toFixed(2);
      } else {
        cart.items = [...cart.items, makeCartItem(nextId(cart.items), productId, quantity)];
      }

      return refreshCart();
    },
    update(itemId: number, quantity: number): Cart {
      cart.items = cart.items.map((item) =>
        item.id === itemId ? { ...item, quantity, line_total: (Number(item.unit_price) * quantity).toFixed(2) } : item,
      );

      return refreshCart();
    },
    remove(itemId: number): Cart {
      cart.items = cart.items.filter((item) => item.id !== itemId);
      return refreshCart();
    },
    clear() {
      cart.items = [];
      refreshCart();
    },
  },
  wishlist: {
    list(): WishlistItem[] {
      return wishlist;
    },
    add(productId: number) {
      if (wishlist.some((item) => item.product_id === productId)) return;

      const product = products.find((item) => item.id === productId);
      if (product) wishlist = [{ id: nextId(wishlist), product_id: productId, product: withCategory(product), created_at: now }, ...wishlist];
    },
    remove(productId: number) {
      wishlist = wishlist.filter((item) => item.product_id !== productId);
    },
  },
  orders: {
    list(): Paginated<Order> {
      return page(orders);
    },
    create(payload: CheckoutPayload): Order {
      const subtotal = Number(refreshCart().subtotal);
      const discount = payload.coupon_code ? Math.min(10, subtotal * 0.1) : 0;
      const order: Order = {
        id: nextId(orders),
        order_number: `ORD-${10000 + nextId(orders)}`,
        status: "pending",
        payment_status: "unpaid",
        subtotal: subtotal.toFixed(2),
        discount_total: discount.toFixed(2),
        tax_total: String(payload.tax_total ?? 0),
        shipping_total: String(payload.shipping_total ?? 0),
        total: Math.max(0, subtotal - discount + Number(payload.shipping_total ?? 0) + Number(payload.tax_total ?? 0)).toFixed(2),
        coupon_code: payload.coupon_code ?? null,
        customer_note: payload.customer_note ?? null,
        shipping_address: payload.shipping_address,
        billing_address: payload.billing_address ?? null,
        user: currentUser,
        items: cart.items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product?.name ?? "Product",
          product_sku: item.product?.sku ?? "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.line_total,
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      orders = [order, ...orders];
      demoApi.cart.clear();
      return order;
    },
  },
  payments: {
    initiate(orderId: number, gateway: PaymentGateway): Payment {
      const order = orders.find((item) => item.id === orderId);

      return {
        id: orderId,
        order_id: orderId,
        gateway,
        status: "initiated",
        transaction_id: `DEMO-${Date.now()}`,
        gateway_payment_id: null,
        gateway_reference: null,
        amount: order?.total ?? "0.00",
        currency: "USD",
        checkout_url: null,
        paid_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order,
      };
    },
  },
  coupons: {
    validate(code: string, subtotal: number): CouponValidation {
      if (code.toUpperCase() !== "WELCOME10") {
        throw new Error("Try WELCOME10 for the local preview.");
      }

      return {
        coupon: { id: 1, code: "WELCOME10", type: "percent", value: "10" },
        discount: Math.min(10, subtotal * 0.1),
      };
    },
  },
};

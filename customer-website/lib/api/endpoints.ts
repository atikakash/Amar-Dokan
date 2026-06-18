"use client";

import { api } from "@/lib/api/client";
import { canUseDemoFallback, demoApi } from "@/lib/api/demo-data";
import type {
  ApiEnvelope,
  ApiFilters,
  AuthResponse,
  Cart,
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

function params(filters?: ApiFilters) {
  return {
    params: Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    ),
  };
}

async function withDemoFallback<T>(request: () => Promise<T>, fallback: () => T | Promise<T>) {
  try {
    return await request();
  } catch (error) {
    if (canUseDemoFallback(error)) {
      return fallback();
    }

    throw error;
  }
}

export const authApi = {
  async register(payload: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<AuthResponse>>("/auth/register", payload);
        return data.data;
      },
      () => demoApi.register(payload),
    );
  },
  async login(payload: { email: string; password: string }) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
        return data.data;
      },
      () => demoApi.login(payload),
    );
  },
  async profile() {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<ApiEnvelope<User>>("/auth/profile");
        return data.data;
      },
      () => demoApi.profile(),
    );
  },
  async updateProfile(payload: Partial<Pick<User, "name" | "email" | "phone">> & { password?: string; password_confirmation?: string }) {
    return withDemoFallback(
      async () => {
        const { data } = await api.put<ApiEnvelope<User>>("/auth/profile", payload);
        return data.data;
      },
      () => demoApi.updateProfile(payload),
    );
  },
  async logout() {
    await withDemoFallback(
      async () => {
        await api.post("/auth/logout");
      },
      () => undefined,
    );
  },
  async resendVerification() {
    await withDemoFallback(
      async () => {
        await api.post("/auth/email/verification-notification");
      },
      () => undefined,
    );
  },
};

export const catalogApi = {
  async categories(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Category>>("/categories", params(filters));
        return data;
      },
      () => demoApi.categories(filters),
    );
  },
  async products(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Product>>("/products", params(filters));
        return data;
      },
      () => demoApi.products(filters),
    );
  },
  async product(id: number | string) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<ApiEnvelope<Product>>(`/products/${id}`);
        return data.data;
      },
      () => demoApi.product(id),
    );
  },
  async productReviews(productId: number | string) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get(`/products/${productId}/reviews`);
        return data;
      },
      () => demoApi.productReviews(),
    );
  },
};

export const cartApi = {
  async show() {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<ApiEnvelope<Cart>>("/cart");
        return data.data;
      },
      () => demoApi.cart.show(),
    );
  },
  async add(product_id: number, quantity: number) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<Cart>>("/cart/items", { product_id, quantity });
        return data.data;
      },
      () => demoApi.cart.add(product_id, quantity),
    );
  },
  async update(itemId: number, quantity: number) {
    return withDemoFallback(
      async () => {
        const { data } = await api.put<ApiEnvelope<Cart>>(`/cart/items/${itemId}`, { quantity });
        return data.data;
      },
      () => demoApi.cart.update(itemId, quantity),
    );
  },
  async remove(itemId: number) {
    return withDemoFallback(
      async () => {
        const { data } = await api.delete<ApiEnvelope<Cart>>(`/cart/items/${itemId}`);
        return data.data;
      },
      () => demoApi.cart.remove(itemId),
    );
  },
  async clear() {
    await withDemoFallback(
      async () => {
        await api.delete("/cart");
      },
      () => demoApi.cart.clear(),
    );
  },
};

export const wishlistApi = {
  async list() {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<WishlistItem> | ApiEnvelope<WishlistItem[]>>("/wishlist");
        return Array.isArray(data.data) ? data.data : [];
      },
      () => demoApi.wishlist.list(),
    );
  },
  async add(product_id: number) {
    await withDemoFallback(
      async () => {
        await api.post("/wishlist", { product_id });
      },
      () => demoApi.wishlist.add(product_id),
    );
  },
  async remove(productId: number) {
    await withDemoFallback(
      async () => {
        await api.delete(`/wishlist/${productId}`);
      },
      () => demoApi.wishlist.remove(productId),
    );
  },
};

export const ordersApi = {
  async list(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Order>>("/orders", params(filters));
        return data;
      },
      () => demoApi.orders.list(),
    );
  },
  async create(payload: CheckoutPayload) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<Order>>("/orders", payload);
        return data.data;
      },
      () => demoApi.orders.create(payload),
    );
  },
};

export const paymentsApi = {
  async initiate(payload: {
    order_id: number;
    gateway: PaymentGateway;
    currency?: string;
    success_url?: string;
    cancel_url?: string;
    metadata?: Record<string, string>;
  }) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<Payment>>("/payments/initiate", payload);
        return data.data;
      },
      () => demoApi.payments.initiate(payload.order_id, payload.gateway),
    );
  },
  async show(paymentId: number) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<ApiEnvelope<Payment>>(`/payments/${paymentId}`);
        return data.data;
      },
      () => demoApi.payments.initiate(paymentId, "stripe"),
    );
  },
};

export const couponsApi = {
  async validate(code: string, subtotal: number) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<CouponValidation>>("/coupons/validate", { code, subtotal });
        return data.data;
      },
      () => demoApi.coupons.validate(code, subtotal),
    );
  },
};

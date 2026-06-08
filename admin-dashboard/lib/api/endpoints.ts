"use client";

import { api } from "@/lib/api/client";
import { canUseDemoFallback, demoApi } from "@/lib/api/demo-data";
import type {
  ApiEnvelope,
  ApiFilters,
  AuthResponse,
  Category,
  Coupon,
  Order,
  OrderStatus,
  Paginated,
  Product,
  User,
} from "@/lib/api/types";

export type ProductPayload = Omit<Partial<Product>, "images"> & {
  images?: Array<{ url: string; alt_text?: string; is_primary?: boolean; sort_order?: number }>;
};

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
  async logout() {
    await withDemoFallback(
      async () => {
        await api.post("/auth/logout");
      },
      () => undefined,
    );
  },
};

export const productsApi = {
  async list(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Product>>("/products", params(filters));
        return data;
      },
      () => demoApi.products.list(),
    );
  },
  async create(payload: ProductPayload) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<Product>>("/products", payload);
        return data.data;
      },
      () => demoApi.products.save(payload),
    );
  },
  async update(id: number, payload: ProductPayload) {
    return withDemoFallback(
      async () => {
        const { data } = await api.put<ApiEnvelope<Product>>(`/products/${id}`, payload);
        return data.data;
      },
      () => demoApi.products.save({ ...payload, id }),
    );
  },
  async remove(id: number) {
    await withDemoFallback(
      async () => {
        await api.delete(`/products/${id}`);
      },
      () => demoApi.products.remove(id),
    );
  },
};

export const categoriesApi = {
  async list(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Category>>("/categories", params(filters));
        return data;
      },
      () => demoApi.categories.list(),
    );
  },
  async create(payload: Partial<Category>) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<Category>>("/categories", payload);
        return data.data;
      },
      () => demoApi.categories.save(payload),
    );
  },
  async update(id: number, payload: Partial<Category>) {
    return withDemoFallback(
      async () => {
        const { data } = await api.put<ApiEnvelope<Category>>(`/categories/${id}`, payload);
        return data.data;
      },
      () => demoApi.categories.save({ ...payload, id }),
    );
  },
  async remove(id: number) {
    await withDemoFallback(
      async () => {
        await api.delete(`/categories/${id}`);
      },
      () => demoApi.categories.remove(id),
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
  async updateStatus(id: number, status: OrderStatus) {
    return withDemoFallback(
      async () => {
        const { data } = await api.patch<ApiEnvelope<Order>>(`/orders/${id}/status`, { status });
        return data.data;
      },
      () => demoApi.orders.updateStatus(id, status),
    );
  },
};

export const couponsApi = {
  async list(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<Coupon>>("/coupons", params(filters));
        return data;
      },
      () => demoApi.coupons.list(),
    );
  },
  async create(payload: Partial<Coupon>) {
    return withDemoFallback(
      async () => {
        const { data } = await api.post<ApiEnvelope<Coupon>>("/coupons", payload);
        return data.data;
      },
      () => demoApi.coupons.save(payload),
    );
  },
  async update(id: number, payload: Partial<Coupon>) {
    return withDemoFallback(
      async () => {
        const { data } = await api.put<ApiEnvelope<Coupon>>(`/coupons/${id}`, payload);
        return data.data;
      },
      () => demoApi.coupons.save({ ...payload, id }),
    );
  },
  async remove(id: number) {
    await withDemoFallback(
      async () => {
        await api.delete(`/coupons/${id}`);
      },
      () => demoApi.coupons.remove(id),
    );
  },
};

export const customersApi = {
  async list(filters?: ApiFilters) {
    return withDemoFallback(
      async () => {
        const { data } = await api.get<Paginated<User>>("/users", params({ role: "customer", ...filters }));
        return data;
      },
      () => demoApi.customers.list(),
    );
  },
};

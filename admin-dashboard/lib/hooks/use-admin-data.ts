"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, couponsApi, customersApi, ordersApi, productsApi, type ProductPayload } from "@/lib/api/endpoints";
import type { ApiFilters, Category, Coupon, OrderStatus } from "@/lib/api/types";

export function useProducts(filters?: ApiFilters) {
  return useQuery({ queryKey: ["products", filters], queryFn: () => productsApi.list(filters) });
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  return {
    save: useMutation({
      mutationFn: (payload: ProductPayload & { id?: number }) => {
        const { id, ...body } = payload;
        return id ? productsApi.update(id, body) : productsApi.create(body);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    }),
    remove: useMutation({
      mutationFn: productsApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    }),
  };
}

export function useCategories(filters?: ApiFilters) {
  return useQuery({ queryKey: ["categories", filters], queryFn: () => categoriesApi.list(filters) });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  return {
    save: useMutation({
      mutationFn: (payload: Partial<Category> & { id?: number }) => {
        const { id, ...body } = payload;
        return id ? categoriesApi.update(id, body) : categoriesApi.create(body);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    }),
    remove: useMutation({
      mutationFn: categoriesApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    }),
  };
}

export function useOrders(filters?: ApiFilters) {
  return useQuery({ queryKey: ["orders", filters], queryFn: () => ordersApi.list(filters) });
}

export function useOrderMutations() {
  const queryClient = useQueryClient();

  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => ordersApi.updateStatus(id, status),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    }),
  };
}

export function useCoupons(filters?: ApiFilters) {
  return useQuery({ queryKey: ["coupons", filters], queryFn: () => couponsApi.list(filters) });
}

export function useCouponMutations() {
  const queryClient = useQueryClient();

  return {
    save: useMutation({
      mutationFn: (payload: Partial<Coupon> & { id?: number }) => {
        const { id, ...body } = payload;
        return id ? couponsApi.update(id, body) : couponsApi.create(body);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
    }),
    remove: useMutation({
      mutationFn: couponsApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
    }),
  };
}

export function useCustomers(filters?: ApiFilters) {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customersApi.list(filters),
    retry: false,
  });
}

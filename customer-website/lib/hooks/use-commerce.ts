"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi, catalogApi, couponsApi, ordersApi, paymentsApi, wishlistApi } from "@/lib/api/endpoints";
import type { ApiFilters, CheckoutPayload, PaymentGateway } from "@/lib/api/types";
import { getStoredToken } from "@/lib/state/auth-store";

export function useProducts(filters?: ApiFilters) {
  return useQuery({ queryKey: ["products", filters], queryFn: () => catalogApi.products(filters) });
}

export function useProduct(id: string | number) {
  return useQuery({ queryKey: ["products", id], queryFn: () => catalogApi.product(id), enabled: Boolean(id) });
}

export function useCategories(filters?: ApiFilters) {
  return useQuery({ queryKey: ["categories", filters], queryFn: () => catalogApi.categories(filters) });
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.show,
    enabled: typeof window !== "undefined" && Boolean(getStoredToken()),
    retry: false,
  });
}

export function useCartMutations() {
  const queryClient = useQueryClient();

  return {
    add: useMutation({
      mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => cartApi.add(productId, quantity),
      onSuccess: (cart) => queryClient.setQueryData(["cart"], cart),
    }),
    update: useMutation({
      mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => cartApi.update(itemId, quantity),
      onSuccess: (cart) => queryClient.setQueryData(["cart"], cart),
    }),
    remove: useMutation({
      mutationFn: cartApi.remove,
      onSuccess: (cart) => queryClient.setQueryData(["cart"], cart),
    }),
    clear: useMutation({
      mutationFn: cartApi.clear,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    }),
  };
}

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.list,
    enabled: typeof window !== "undefined" && Boolean(getStoredToken()),
    retry: false,
  });
}

export function useWishlistMutations() {
  const queryClient = useQueryClient();

  return {
    add: useMutation({
      mutationFn: wishlistApi.add,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    }),
    remove: useMutation({
      mutationFn: wishlistApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    }),
  };
}

export function useOrders(filters?: ApiFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => ordersApi.list(filters),
    enabled: typeof window !== "undefined" && Boolean(getStoredToken()),
    retry: false,
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => ordersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function usePaymentInitiation() {
  return useMutation({
    mutationFn: ({ orderId, gateway }: { orderId: number; gateway: PaymentGateway }) =>
      paymentsApi.initiate({
        order_id: orderId,
        gateway,
        success_url: `${window.location.origin}/orders`,
        cancel_url: `${window.location.origin}/checkout`,
        metadata: { client: "customer-website" },
      }),
  });
}

export function useCouponValidation() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) => couponsApi.validate(code, subtotal),
  });
}

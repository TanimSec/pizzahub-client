import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

export interface CreateOrderInput {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
}

export const orderKeys = {
  mine: (status?: string) => ["orders", "mine", status ?? "all"] as const,
  vendor: (status?: string) => ["orders", "vendor", status ?? "all"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
  customerStats: ["stats", "customer"] as const,
  vendorStats: ["stats", "vendor"] as const,
};

export function useMyOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: orderKeys.mine(status),
    queryFn: async () => (await api<{ orders: Order[] }>("/api/orders/my", { params: { status } })).orders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => (await api<{ order: Order }>(`/api/orders/${id}`)).order,
    retry: false,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => api<{ order: Order }>("/api/orders", { method: "POST", body: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ order: Order; message: string }>(`/api/orders/${id}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

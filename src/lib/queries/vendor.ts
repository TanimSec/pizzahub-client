import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ItemStatus, MenuItem, Order, OrderStatus } from "@/lib/types";

export interface VendorStats {
  totalItems: number;
  activeItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  charts: {
    itemsByStatus: { status: string; count: number }[];
    ordersByStatus: { status: string; count: number }[];
    ordersPerMonth: { month: string; count: number }[];
  };
}

export interface ItemInput {
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

export const vendorKeys = {
  stats: ["vendor", "stats"] as const,
  items: (status?: string) => ["vendor", "items", status ?? "all"] as const,
  item: (id: string) => ["vendor", "item", id] as const,
  orders: (status?: string) => ["vendor", "orders", status ?? "all"] as const,
};

export function useVendorStats() {
  return useQuery({
    queryKey: vendorKeys.stats,
    queryFn: () => api<VendorStats>("/api/vendor/stats"),
  });
}

export function useVendorItems(status?: ItemStatus) {
  return useQuery({
    queryKey: vendorKeys.items(status),
    queryFn: async () => (await api<{ items: MenuItem[] }>("/api/vendor/items", { params: { status } })).items,
  });
}

export function useVendorItem(id: string) {
  return useQuery({
    queryKey: vendorKeys.item(id),
    queryFn: async () => (await api<{ item: MenuItem }>(`/api/vendor/items/${id}`)).item,
    retry: false,
  });
}

function useInvalidateVendor() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["vendor"] });
}

export function useCreateItem() {
  const invalidate = useInvalidateVendor();
  return useMutation({
    mutationFn: (input: ItemInput) => api<{ item: MenuItem }>("/api/vendor/items", { method: "POST", body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateItem(id: string) {
  const invalidate = useInvalidateVendor();
  return useMutation({
    mutationFn: (input: Partial<ItemInput>) => api<{ item: MenuItem }>(`/api/vendor/items/${id}`, { method: "PATCH", body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteItem() {
  const invalidate = useInvalidateVendor();
  return useMutation({
    mutationFn: (id: string) => api(`/api/vendor/items/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });
}

export function useSetAvailability() {
  const invalidate = useInvalidateVendor();
  return useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      api<{ item: MenuItem }>(`/api/vendor/items/${id}/availability`, { method: "PATCH", body: { available } }),
    onSuccess: invalidate,
  });
}

export function useVendorOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: vendorKeys.orders(status),
    queryFn: async () => (await api<{ orders: Order[] }>("/api/vendor/orders", { params: { status } })).orders,
  });
}

export function useDecideOrder() {
  const invalidate = useInvalidateVendor();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "accept" | "reject" }) =>
      api<{ order: Order; message: string }>(`/api/vendor/orders/${id}`, { method: "PATCH", body: { action } }),
    onSuccess: invalidate,
  });
}

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppUser, ItemStatus, MenuItem, Transaction, VendorInfo } from "@/lib/types";

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
  charts: {
    usersByRole: { role: string; count: number }[];
    itemsByCategory: { category: string; count: number }[];
    itemsByStatus: { status: string; count: number }[];
    revenuePerMonth: { month: string; revenue: number; count: number }[];
  };
}

export interface AdminUsersResponse {
  users: AppUser[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminUserDetail {
  user: AppUser;
  itemCount: number;
  orderCount: number;
}

export interface AdminItem extends Omit<MenuItem, "vendor"> {
  vendor?: VendorInfo & { email?: string };
}

export interface AdminItemsResponse {
  items: AdminItem[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminTransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pages: number;
}

export function useAdminStats() {
  return useQuery({ queryKey: ["admin", "stats"], queryFn: () => api<AdminStats>("/api/admin/stats") });
}

export function useAdminUsers(params: { q?: string; role?: string; page: number }) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => api<AdminUsersResponse>("/api/admin/users", { params }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUser(id: string | null) {
  return useQuery({
    queryKey: ["admin", "user", id],
    enabled: !!id,
    queryFn: () => api<AdminUserDetail>(`/api/admin/users/${id}`),
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      api<{ message: string }>(`/api/admin/users/${id}/block`, { method: "PATCH", body: { isBlocked } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAdminItems(params: { q?: string; status?: string; category?: string; page: number }) {
  return useQuery({
    queryKey: ["admin", "items", params],
    queryFn: () => api<AdminItemsResponse>("/api/admin/items", { params }),
    placeholderData: keepPreviousData,
  });
}

export function useSetItemStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ItemStatus }) =>
      api<{ item: MenuItem; message: string }>(`/api/admin/items/${id}/status`, { method: "PATCH", body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAdminDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ message: string }>(`/api/admin/items/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAdminTransactions(params: { status?: string; page: number }) {
  return useQuery({
    queryKey: ["admin", "transactions", params],
    queryFn: () => api<AdminTransactionsResponse>("/api/admin/transactions", { params }),
    placeholderData: keepPreviousData,
  });
}

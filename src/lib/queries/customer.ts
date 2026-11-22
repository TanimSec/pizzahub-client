import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CustomerStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
  charts: {
    ordersByStatus: { status: string; count: number }[];
    ordersPerMonth: { month: string; count: number }[];
  };
}

export function useCustomerStats() {
  return useQuery({
    queryKey: ["stats", "customer"],
    queryFn: () => api<CustomerStats>("/api/customer/stats"),
  });
}

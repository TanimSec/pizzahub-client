import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MenuItem } from "@/lib/types";

export interface MenuFilters {
  q?: string;
  category?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: number;
}

export interface MenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export const menuKeys = {
  list: (filters: MenuFilters) => ["menu", "list", filters] as const,
  locations: ["menu", "locations"] as const,
  detail: (id: string) => ["menu", "detail", id] as const,
};

export function useMenuList(filters: MenuFilters) {
  return useQuery({
    queryKey: menuKeys.list(filters),
    queryFn: () => api<MenuResponse>("/api/menu", { auth: false, params: { ...filters, limit: 12 } }),
    placeholderData: keepPreviousData,
  });
}

export function useLocations() {
  return useQuery({
    queryKey: menuKeys.locations,
    queryFn: async () => (await api<{ locations: string[] }>("/api/menu/locations", { auth: false })).locations,
    staleTime: 5 * 60_000,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: menuKeys.detail(id),
    queryFn: async () => (await api<{ item: MenuItem }>(`/api/menu/${id}`)).item,
    retry: false,
  });
}

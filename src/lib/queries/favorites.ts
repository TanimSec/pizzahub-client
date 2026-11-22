import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MenuItem } from "@/lib/types";

const KEY = ["favorites"] as const;

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: KEY,
    enabled,
    queryFn: () => api<{ items: MenuItem[]; ids: string[] }>("/api/users/me/favorites"),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
      api(`/api/users/me/favorites/${id}`, { method: favorite ? "POST" : "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

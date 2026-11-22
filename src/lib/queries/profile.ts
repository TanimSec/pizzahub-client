import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppUser } from "@/lib/types";

export interface ProfileInput {
  name?: string;
  image?: string | null;
  businessName?: string;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api<{ user: AppUser }>("/api/users/me")).user,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileInput) => api<{ user: AppUser; message: string }>("/api/users/me", { method: "PATCH", body: input }),
    onSuccess: ({ user }) => qc.setQueryData(["me"], user),
  });
}

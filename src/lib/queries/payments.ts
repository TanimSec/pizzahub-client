import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Transaction, TxStatus } from "@/lib/types";

export const paymentKeys = {
  mine: ["payments", "mine"] as const,
  session: (id: string) => ["payments", "session", id] as const,
};

export function useMyTransactions() {
  return useQuery({
    queryKey: paymentKeys.mine,
    queryFn: async () => (await api<{ transactions: Transaction[] }>("/api/payments/my-transactions")).transactions,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: () => api<{ url: string; sessionId: string }>("/api/payments/checkout-session", { method: "POST" }),
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ message: string }>("/api/payments/cancel-subscription", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export interface SessionStatus {
  status: TxStatus;
  plan: string;
  amount: number;
  currency: string;
}

// Polls the webhook-recorded status. Premium is never activated from this call.
export function useSessionStatus(sessionId: string | null) {
  return useQuery({
    queryKey: paymentKeys.session(sessionId ?? "none"),
    enabled: !!sessionId,
    queryFn: () => api<SessionStatus>(`/api/payments/session/${sessionId}`),
    refetchInterval: (query) => (query.state.data?.status === "pending" && query.state.dataUpdateCount < 20 ? 2000 : false),
    retry: false,
  });
}

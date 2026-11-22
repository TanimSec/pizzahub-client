"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { PREMIUM_PRICE_LABEL } from "@/lib/constants";
import { errorMessage } from "@/lib/api-error";
import { formatDate, formatPrice } from "@/lib/format";
import { useCancelSubscription, useCheckout, useMyTransactions } from "@/lib/queries/payments";
import { useVendorStats } from "@/lib/queries/vendor";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { DashboardHeading } from "../dashboard-heading";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["Up to 3 active menu items", "Basic vendor dashboard", "Order management"],
  },
  {
    id: "premium",
    name: "Premium",
    price: PREMIUM_PRICE_LABEL,
    features: ["Unlimited active menu items", "Premium vendor badge", "Featured menu placement", "All Free features"],
  },
] as const;

export function SubscriptionView() {
  const { data: stats, isLoading } = useVendorStats();
  const { data: transactions, isLoading: txLoading } = useMyTransactions();
  const checkout = useCheckout();
  const cancel = useCancelSubscription();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const current = stats?.subscriptionPlan ?? "free";

  async function upgrade() {
    try {
      await checkout.mutateAsync();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function handleCancel() {
    try {
      const res = await cancel.mutateAsync();
      toast.success(res.message);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setConfirmCancel(false);
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeading title="Subscription" description="Choose the plan that fits your restaurant. Premium is activated after Stripe confirms your payment." />

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const active = current === plan.id;
          return (
            <Card key={plan.id} className={cn("relative", plan.id === "premium" && "border-primary/50 shadow-md")}>
              {plan.id === "premium" && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                  <Crown className="size-3" /> Best value
                </span>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="font-heading text-3xl font-bold text-foreground">{plan.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : active ? (
                  <Button variant="secondary" disabled className="w-full">
                    Current plan
                  </Button>
                ) : plan.id === "premium" ? (
                  <Button className="w-full" onClick={upgrade} disabled={checkout.isPending}>
                    {checkout.isPending ? <Spinner /> : <Crown />} Upgrade to Premium
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    Included
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {current === "premium" && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Your Premium access runs until <span className="font-semibold text-foreground">{stats?.subscriptionExpiresAt ? formatDate(stats.subscriptionExpiresAt) : "the end of this period"}</span>. Cancelling keeps Premium until then.
            </p>
            <Button variant="outline" onClick={() => setConfirmCancel(true)}>
              Cancel subscription
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Payment history</h2>
        {txLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : !transactions || transactions.length === 0 ? (
          <EmptyState title="No payments yet" description="Your subscription payments will appear here." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{formatDate(t.createdAt)}</TableCell>
                    <TableCell className="capitalize">{t.plan}</TableCell>
                    <TableCell className="font-semibold">{formatPrice(t.amount, t.currency.toUpperCase())}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel your Premium subscription?"
        description="You keep Premium benefits until the end of the current billing period. After that your account returns to the Free plan and extra items are set to inactive."
        confirmLabel="Cancel subscription"
        destructive
        loading={cancel.isPending}
        onConfirm={handleCancel}
      />
    </div>
  );
}

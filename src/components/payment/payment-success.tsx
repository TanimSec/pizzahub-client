"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { ApiError } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";
import { useSessionStatus } from "@/lib/queries/payments";
import { ButtonLink } from "@/components/ui/button-link";
import { PageLoader } from "@/components/shared/spinner";

function Panel({ icon, title, children, tone }: { icon: React.ReactNode; title: string; children: React.ReactNode; tone: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-sm">
      <div className={`flex size-16 items-center justify-center rounded-full ${tone}`}>{icon}</div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {children}
    </div>
  );
}

export function PaymentSuccess({ sessionId }: { sessionId: string | null }) {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, dataUpdateCount } = useSessionStatus(sessionId);

  useEffect(() => {
    if (data?.status === "paid") qc.invalidateQueries({ queryKey: ["vendor"] });
  }, [data?.status, qc]);

  if (!sessionId) {
    return (
      <Panel icon={<AlertTriangle className="size-8" />} title="Missing payment session" tone="bg-destructive/10 text-destructive">
        <p className="text-muted-foreground">We could not find a payment to confirm. If you were charged, your Premium plan will still activate once Stripe confirms it.</p>
        <ButtonLink href="/dashboard/vendor/subscription">Go to Subscription</ButtonLink>
      </Panel>
    );
  }

  if (isLoading) return <PageLoader label="Confirming your payment..." />;

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <Panel icon={<AlertTriangle className="size-8" />} title={notFound ? "Payment not found" : "Could not verify payment"} tone="bg-destructive/10 text-destructive">
        <p className="text-muted-foreground">{notFound ? "This payment session does not belong to your account." : "Please check your subscription page in a moment."}</p>
        <ButtonLink href="/dashboard/vendor/subscription">Go to Subscription</ButtonLink>
      </Panel>
    );
  }

  if (data?.status === "paid") {
    return (
      <Panel icon={<CheckCircle2 className="size-8" />} title="Payment successful" tone="bg-success/15 text-success">
        <p className="text-muted-foreground">
          Thank you! Your <span className="font-semibold capitalize text-foreground">{data.plan}</span> plan is active ({formatPrice(data.amount, data.currency.toUpperCase())}). Unlimited menu items and your Premium badge are ready.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dashboard/vendor/items/new">Add a menu item</ButtonLink>
          <ButtonLink href="/dashboard/vendor/subscription" variant="outline">
            View subscription
          </ButtonLink>
        </div>
      </Panel>
    );
  }

  if (data?.status === "pending") {
    const slow = dataUpdateCount >= 20;
    return (
      <Panel icon={<Clock className="size-8" />} title={slow ? "Still confirming" : "Confirming your payment"} tone="bg-warning/25 text-warning-foreground">
        <p className="text-muted-foreground">
          {slow
            ? "Stripe is taking longer than usual. Your Premium plan activates automatically as soon as the payment is confirmed. You can safely leave this page."
            : "We are waiting for Stripe to verify the payment. This usually takes a few seconds."}
        </p>
        {!slow && <PageLoader label="Checking status..." />}
        <ButtonLink href="/dashboard/vendor/subscription" variant="outline">
          Go to Subscription
        </ButtonLink>
      </Panel>
    );
  }

  return (
    <Panel icon={<AlertTriangle className="size-8" />} title="Payment was not completed" tone="bg-destructive/10 text-destructive">
      <p className="text-muted-foreground">No charge was applied and your plan has not changed. You can try again any time.</p>
      <ButtonLink href="/dashboard/vendor/subscription">Back to Subscription</ButtonLink>
    </Panel>
  );
}

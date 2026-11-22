import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default async function PaymentCancelPage() {
  await requireRole("vendor");
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <XCircle className="size-8" />
        </div>
        <h1 className="text-3xl font-bold">Payment cancelled</h1>
        <p className="text-muted-foreground">You left checkout before paying, so nothing was charged and your plan is unchanged. You can upgrade whenever you are ready.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dashboard/vendor/subscription">Back to Subscription</ButtonLink>
          <ButtonLink href="/dashboard/vendor" variant="outline">
            Go to dashboard
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

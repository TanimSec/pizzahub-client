import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment/payment-success";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Success" };

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  await requireRole("vendor");
  const { session_id } = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <PaymentSuccess sessionId={session_id ?? null} />
    </div>
  );
}

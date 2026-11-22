import type { Metadata } from "next";
import { SubscriptionView } from "@/components/dashboard/vendor/subscription-view";

export const metadata: Metadata = { title: "Subscription" };

export default function SubscriptionPage() {
  return <SubscriptionView />;
}

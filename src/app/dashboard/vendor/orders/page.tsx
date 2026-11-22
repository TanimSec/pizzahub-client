import type { Metadata } from "next";
import { VendorOrdersView } from "@/components/dashboard/vendor/vendor-orders-view";

export const metadata: Metadata = { title: "Customer Orders" };

export default function VendorOrdersPage() {
  return <VendorOrdersView />;
}

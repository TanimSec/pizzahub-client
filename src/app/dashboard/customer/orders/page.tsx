import type { Metadata } from "next";
import { CustomerOrdersView } from "@/components/dashboard/customer/customer-orders-view";

export const metadata: Metadata = { title: "My Orders" };

export default function CustomerOrdersPage() {
  return <CustomerOrdersView />;
}

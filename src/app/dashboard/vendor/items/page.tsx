import type { Metadata } from "next";
import { VendorItemsView } from "@/components/dashboard/vendor/vendor-items-view";

export const metadata: Metadata = { title: "My Menu Items" };

export default function VendorItemsPage() {
  return <VendorItemsView />;
}

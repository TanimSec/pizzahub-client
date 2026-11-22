import type { Metadata } from "next";
import { AdminItemsView } from "@/components/dashboard/admin/admin-items-view";

export const metadata: Metadata = { title: "Manage Menu Items" };

export default function AdminItemsPage() {
  return <AdminItemsView />;
}

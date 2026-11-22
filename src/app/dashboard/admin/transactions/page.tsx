import type { Metadata } from "next";
import { AdminTransactionsView } from "@/components/dashboard/admin/admin-transactions-view";

export const metadata: Metadata = { title: "Transactions" };

export default function AdminTransactionsPage() {
  return <AdminTransactionsView />;
}

import type { Metadata } from "next";
import { AdminUsersView } from "@/components/dashboard/admin/admin-users-view";

export const metadata: Metadata = { title: "Manage Users" };

export default function AdminUsersPage() {
  return <AdminUsersView />;
}

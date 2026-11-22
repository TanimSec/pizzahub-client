import type { ReactNode } from "react";
import { RoleLayout } from "@/components/dashboard/role-layout";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <RoleLayout role="admin">{children}</RoleLayout>;
}

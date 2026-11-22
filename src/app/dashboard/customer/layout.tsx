import type { ReactNode } from "react";
import { RoleLayout } from "@/components/dashboard/role-layout";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  return <RoleLayout role="customer">{children}</RoleLayout>;
}

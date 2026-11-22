import type { ReactNode } from "react";
import { RoleLayout } from "@/components/dashboard/role-layout";

export default function VendorDashboardLayout({ children }: { children: ReactNode }) {
  return <RoleLayout role="vendor">{children}</RoleLayout>;
}

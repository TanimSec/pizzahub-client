import type { ReactNode } from "react";
import type { Role } from "@/lib/types";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

interface Props {
  role: Role;
  user: { name: string; email: string; image?: string | null };
  children: ReactNode;
}

export function DashboardShell({ role, user, children }: Props) {
  return (
    <SidebarProvider>
      <DashboardSidebar role={role} user={user} />
      <SidebarInset className="min-w-0 bg-muted/30">
        <DashboardTopbar user={{ ...user, role }} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

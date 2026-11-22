import type { ReactNode } from "react";
import { requireRole } from "@/lib/session";
import type { Role } from "@/lib/types";
import { DashboardShell } from "./dashboard-shell";

// Authoritative server-side guard: wrong role is redirected to its own dashboard, guests to sign-in.
export async function RoleLayout({ role, children }: { role: Role; children: ReactNode }) {
  const session = await requireRole(role);
  const u = session.user as { name: string; email: string; image?: string | null };
  return (
    <DashboardShell role={role} user={{ name: u.name, email: u.email, image: u.image ?? null }}>
      {children}
    </DashboardShell>
  );
}

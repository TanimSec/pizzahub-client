import { redirect } from "next/navigation";
import { dashboardPath, requireUser } from "@/lib/session";

export default async function DashboardIndex() {
  const session = await requireUser("/dashboard");
  redirect(dashboardPath((session.user as { role?: string }).role));
}

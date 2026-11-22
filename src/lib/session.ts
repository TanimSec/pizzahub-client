import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { Role } from "./types";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export const dashboardPath = (role?: string | null): string =>
  role === "admin" || role === "vendor" || role === "customer" ? `/dashboard/${role}` : "/";

export async function requireUser(callbackUrl = "/dashboard") {
  const session = await getSession();
  if (!session) redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if ((session.user as { isBlocked?: boolean }).isBlocked) redirect("/blocked");
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireUser(dashboardPath(role));
  const actual = (session.user as { role?: string }).role;
  if (actual !== role) redirect(dashboardPath(actual));
  return session;
}

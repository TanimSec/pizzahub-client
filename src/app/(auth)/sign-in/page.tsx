import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeRedirect } from "@/lib/safe-redirect";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return <SignInForm callbackUrl={safeRedirect(callbackUrl)} />;
}

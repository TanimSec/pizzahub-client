import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { safeRedirect } from "@/lib/safe-redirect";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return <SignUpForm callbackUrl={safeRedirect(callbackUrl)} />;
}

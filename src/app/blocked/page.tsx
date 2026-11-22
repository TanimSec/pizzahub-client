import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "Account blocked" };

export default function BlockedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-8" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-bold">Your account is blocked</h1>
        <p className="text-muted-foreground">
          An administrator has restricted this account, so protected features are unavailable. Contact support if you think this is a mistake.
        </p>
      </div>
      <div className="flex gap-3">
        <SignOutButton />
        <ButtonLink href="/" variant="outline">
          Back to Home
        </ButtonLink>
      </div>
    </main>
  );
}

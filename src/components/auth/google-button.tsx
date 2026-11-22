"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.3 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

export function GoogleButton({ callbackURL, role }: { callbackURL: string; role?: "customer" | "vendor" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    if (role) {
      document.cookie = `ph_signup_role=${role}; path=/; max-age=600; SameSite=Lax`;
    }
    const { error } = await signIn.social({ provider: "google", callbackURL });
    if (error) {
      toast.error(error.message ?? "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleClick} disabled={loading}>
      {loading ? <Spinner /> : <GoogleGlyph />} Continue with Google
    </Button>
  );
}

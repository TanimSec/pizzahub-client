"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/token";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await signOut();
    clearToken();
    toast.success("Signed out");
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? <Spinner /> : <LogOut />} Sign out
    </Button>
  );
}

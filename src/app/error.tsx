"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">An unexpected error interrupted this page. You can try again, or head back home.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <ButtonLink href="/" size="lg" variant="outline">
          Back to Home
        </ButtonLink>
      </div>
    </main>
  );
}

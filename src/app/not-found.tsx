import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <p className="font-heading text-8xl font-bold text-primary">404</p>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-bold">This slice is missing</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist or has moved. Let us get you back to the good stuff.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          Back to Home
        </ButtonLink>
        <ButtonLink href="/menu" size="lg" variant="outline">
          Browse Menu
        </ButtonLink>
      </div>
    </main>
  );
}

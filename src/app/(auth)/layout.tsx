import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { PizzaIllustration } from "@/components/home/pizza-illustration";
import { dashboardPath, getSession } from "@/lib/session";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (session) redirect(dashboardPath((session.user as { role?: string }).role));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative rounded-xl bg-background/95 px-4 py-2 w-fit">
          <Logo />
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <PizzaIllustration className="h-auto w-full drop-shadow-2xl" />
        </div>
        <p className="relative max-w-sm font-heading text-2xl leading-snug">
          Hot, fresh pizza from your favorite local kitchens, one tap away.
        </p>
      </aside>
      <main className="flex items-center justify-center px-4 py-12 sm:px-8">{children}</main>
    </div>
  );
}

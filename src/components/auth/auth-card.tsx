import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, description, children, footer }: Props) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex justify-center lg:hidden">
        <Logo />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-8 space-y-5">{children}</div>
      <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
    </div>
  );
}

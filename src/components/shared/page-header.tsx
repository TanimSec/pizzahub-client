import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: Props) {
  return (
    <div className="border-b bg-gradient-to-b from-secondary/60 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{description}</p>}
        {children}
      </div>
    </div>
  );
}

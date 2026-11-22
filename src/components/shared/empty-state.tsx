import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = SearchX, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center", className)}>
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-7" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

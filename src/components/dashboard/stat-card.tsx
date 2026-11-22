import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  label: string;
  value: string | number | undefined;
  icon: LucideIcon;
  hint?: string;
  tone?: "primary" | "accent" | "success" | "warning";
  loading?: boolean;
}

const tones = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-accent-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/25 text-warning-foreground",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "primary", loading }: Props) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? <Skeleton className="mt-1 h-8 w-16" /> : <p className="font-heading text-3xl font-bold leading-tight">{value ?? "—"}</p>}
          {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-warning/25 text-warning-foreground",
  accepted: "bg-success/15 text-success",
  approved: "bg-success/15 text-success",
  paid: "bg-success/15 text-success",
  rejected: "bg-destructive/10 text-destructive",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  canceled: "bg-muted text-muted-foreground",
  inactive: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", styles[status] ?? "bg-muted text-muted-foreground", className)}>
      {status}
    </span>
  );
}

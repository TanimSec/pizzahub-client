import { CheckCircle2, CircleDot, Clock, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const meta: Record<OrderStatus, { label: string; icon: LucideIcon; tone: string }> = {
  pending: { label: "Order placed, waiting for the restaurant", icon: Clock, tone: "bg-warning/25 text-warning-foreground" },
  accepted: { label: "Accepted by the restaurant", icon: CheckCircle2, tone: "bg-success/15 text-success" },
  rejected: { label: "Rejected by the restaurant", icon: XCircle, tone: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelled by the customer", icon: XCircle, tone: "bg-muted text-muted-foreground" },
};

export function OrderTimeline({ history }: { history: Order["statusHistory"] }) {
  const steps = history?.length ? history : [];
  return (
    <ol className="relative space-y-6 border-l-2 border-border pl-8" aria-label="Order status timeline">
      {steps.map((step, i) => {
        const { label, icon: Icon, tone } = meta[step.status];
        const latest = i === steps.length - 1;
        return (
          <li key={`${step.status}-${i}`} className="relative">
            <span className={cn("absolute -left-[2.85rem] flex size-8 items-center justify-center rounded-full ring-4 ring-background", tone)}>
              <Icon className="size-4" />
            </span>
            <p className={cn("font-semibold capitalize", latest ? "text-foreground" : "text-muted-foreground")}>{step.status}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(step.at, "MMM d, yyyy 'at' h:mm a")}</p>
          </li>
        );
      })}
      {steps.length === 0 && (
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CircleDot className="size-4" /> No status updates yet
        </li>
      )}
    </ol>
  );
}

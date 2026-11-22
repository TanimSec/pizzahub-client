import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground",
        className,
      )}
    >
      <Crown className="size-3" /> Premium
    </span>
  );
}

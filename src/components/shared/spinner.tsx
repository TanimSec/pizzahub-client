import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden="true" className={cn("size-4 animate-spin", className)} />;
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-8 animate-spin text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

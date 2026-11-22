import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Props {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, hint, optional, className, children }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Field {
  label: string;
  value: ReactNode;
  wide?: boolean;
}

interface Props {
  media?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  fields?: Field[];
  actions?: ReactNode;
}

/** Stacked card used instead of a wide table on phones and tablets. */
export function RecordCard({ media, title, subtitle, badge, fields, actions }: Props) {
  return (
    <article className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {media}
          <div className="min-w-0">
            <p className="truncate font-semibold">{title}</p>
            {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      {fields && fields.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {fields.map((f) => (
            <div key={f.label} className={cn("min-w-0", f.wide && "col-span-2")}>
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="break-words font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {actions && <div className="flex flex-wrap gap-2 border-t pt-3">{actions}</div>}
    </article>
  );
}

/** Wrapper that is visible only below the breakpoint where tables are shown. */
export function RecordList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-3 sm:grid-cols-2 xl:hidden", className)}>{children}</div>;
}

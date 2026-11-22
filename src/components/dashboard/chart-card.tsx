import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  title: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  children: ReactNode;
}

export function ChartCard({ title, description, loading, empty, children }: Props) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : empty ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">No data yet</div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

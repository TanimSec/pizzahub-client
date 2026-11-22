"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface Props {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  label: string;
  currency?: boolean;
}

export function SimpleAreaChart({ data, xKey, yKey, label, currency }: Props) {
  const config: ChartConfig = { [yKey]: { label, color: "var(--chart-1)" } };
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={data} margin={{ left: -8, right: 8 }}>
        <defs>
          <linearGradient id={`fill-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={`var(--color-${yKey})`} stopOpacity={0.5} />
            <stop offset="95%" stopColor={`var(--color-${yKey})`} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => (currency ? `$${v}` : String(v))} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey={yKey} stroke={`var(--color-${yKey})`} strokeWidth={2} fill={`url(#fill-${yKey})`} />
      </AreaChart>
    </ChartContainer>
  );
}

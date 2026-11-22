"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface Props {
  data: { name: string; value: number }[];
}

export function DonutChart({ data }: Props) {
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.name, { label: d.name, color: `var(--chart-${(i % 5) + 1})` }]),
  );
  return (
    <ChartContainer config={config} className="mx-auto h-64 w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={2}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={`var(--chart-${(i % 5) + 1})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}

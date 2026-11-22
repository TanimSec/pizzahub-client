"use client";

import { CheckCircle2, Clock, ShoppingBag, XCircle } from "lucide-react";
import { useCustomerStats } from "@/lib/queries/customer";
import { errorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "../chart-card";
import { DashboardHeading } from "../dashboard-heading";
import { StatCard } from "../stat-card";

export function CustomerOverview() {
  const { data, isLoading, isError, error, refetch } = useCustomerStats();

  if (isError) {
    return <EmptyState title="Could not load your dashboard" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />;
  }

  const byStatus = (data?.charts.ordersByStatus ?? []).map((r) => ({ name: r.status, value: r.count }));

  return (
    <div className="space-y-6">
      <DashboardHeading
        title="Your orders at a glance"
        description="Follow every order from pending to delivered."
        action={<ButtonLink href="/menu">Order more pizza</ButtonLink>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={data?.total} icon={ShoppingBag} loading={isLoading} />
        <StatCard label="Pending orders" value={data?.pending} icon={Clock} tone="warning" loading={isLoading} />
        <StatCard label="Accepted orders" value={data?.accepted} icon={CheckCircle2} tone="success" loading={isLoading} />
        <StatCard label="Rejected orders" value={data?.rejected} icon={XCircle} tone="accent" loading={isLoading} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Orders per month" description="Your orders in the last 6 months" loading={isLoading} empty={!data?.charts.ordersPerMonth.some((m) => m.count > 0)}>
            <SimpleBarChart data={data?.charts.ordersPerMonth ?? []} xKey="month" series={[{ key: "count", label: "Orders" }]} />
          </ChartCard>
        </div>
        <ChartCard title="Orders by status" loading={isLoading} empty={byStatus.length === 0}>
          <DonutChart data={byStatus} />
        </ChartCard>
      </div>
    </div>
  );
}

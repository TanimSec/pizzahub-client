"use client";

import { CheckCircle2, Clock, Crown, ListChecks, UtensilsCrossed } from "lucide-react";
import { useVendorStats } from "@/lib/queries/vendor";
import { errorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardHeading } from "../dashboard-heading";
import { StatCard } from "../stat-card";
import { ChartCard } from "../chart-card";
import { PlanBanner } from "../plan-banner";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";

export function VendorOverview() {
  const { data, isLoading, isError, error, refetch } = useVendorStats();

  if (isError) {
    return (
      <EmptyState title="Could not load your dashboard" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
    );
  }

  const itemsByStatus = (data?.charts.itemsByStatus ?? []).map((r) => ({ name: r.status, value: r.count }));
  const ordersByStatus = (data?.charts.ordersByStatus ?? []).map((r) => ({ name: r.status, value: r.count }));

  return (
    <div className="space-y-6">
      <DashboardHeading title="Vendor overview" description="Track your menu, orders and subscription at a glance." />
      {data && <PlanBanner plan={data.subscriptionPlan} expiresAt={data.subscriptionExpiresAt} activeItems={data.activeItems} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total menu items" value={data?.totalItems} icon={UtensilsCrossed} loading={isLoading} />
        <StatCard label="Active menu items" value={data?.activeItems} icon={ListChecks} tone="success" loading={isLoading} />
        <StatCard label="Pending orders" value={data?.pendingOrders} icon={Clock} tone="warning" loading={isLoading} />
        <StatCard label="Accepted orders" value={data?.acceptedOrders} icon={CheckCircle2} tone="success" loading={isLoading} />
        <StatCard label="Current plan" value={data ? (data.subscriptionPlan === "premium" ? "Premium" : "Free") : undefined} icon={Crown} tone="accent" loading={isLoading} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Orders per month" description="Customer orders received in the last 6 months" loading={isLoading} empty={!data?.charts.ordersPerMonth.some((m) => m.count > 0)}>
            <SimpleBarChart data={data?.charts.ordersPerMonth ?? []} xKey="month" series={[{ key: "count", label: "Orders" }]} />
          </ChartCard>
        </div>
        <ChartCard title="Orders by status" loading={isLoading} empty={ordersByStatus.length === 0}>
          <DonutChart data={ordersByStatus} />
        </ChartCard>
      </div>
      <ChartCard title="Menu items by status" description="Approval status of everything you have submitted" loading={isLoading} empty={itemsByStatus.length === 0}>
        <DonutChart data={itemsByStatus} />
      </ChartCard>
    </div>
  );
}

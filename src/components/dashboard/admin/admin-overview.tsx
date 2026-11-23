"use client";

import { Clock, Receipt, Store, UserCog, Users, UtensilsCrossed } from "lucide-react";
import { useAdminStats } from "@/lib/queries/admin";
import { errorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "../chart-card";
import { DashboardHeading } from "../dashboard-heading";
import { StatCard } from "../stat-card";

export function AdminOverview() {
  const { data, isLoading, isError, error, refetch } = useAdminStats();

  if (isError) {
    return <EmptyState title="Could not load platform stats" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />;
  }

  const usersByRole = (data?.charts.usersByRole ?? []).map((r) => ({ name: r.role, value: r.count }));
  const byCategory = (data?.charts.itemsByCategory ?? []).map((r) => ({ category: r.category, count: r.count }));
  const hasRevenue = data?.charts.revenuePerMonth.some((m) => m.revenue > 0);

  return (
    <div className="space-y-6">
      <DashboardHeading title="Platform overview" description="Monitor users, menu items and subscription revenue." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total registered users" value={data?.totalUsers} icon={Users} loading={isLoading} />
        <StatCard label="Total vendors" value={data?.totalVendors} icon={Store} tone="accent" loading={isLoading} />
        <StatCard label="Total customers" value={data?.totalCustomers} icon={UserCog} tone="success" loading={isLoading} />
        <StatCard label="Total menu items" value={data?.totalMenuItems} icon={UtensilsCrossed} loading={isLoading} />
        <StatCard label="Pending menu items" value={data?.pendingMenuItems} icon={Clock} tone="warning" loading={isLoading} />
        <StatCard label="Total transactions" value={data?.totalTransactions} icon={Receipt} tone="success" loading={isLoading} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <ChartCard title="Subscription revenue" description="Paid transactions over the last 6 months" loading={isLoading} empty={!hasRevenue}>
            <SimpleAreaChart data={data?.charts.revenuePerMonth ?? []} xKey="month" yKey="revenue" label="Revenue" currency />
          </ChartCard>
        </div>
        <ChartCard title="Users by role" loading={isLoading} empty={usersByRole.length === 0}>
          <DonutChart data={usersByRole} />
        </ChartCard>
      </div>
      <ChartCard title="Menu items by category" loading={isLoading} empty={byCategory.length === 0}>
        <SimpleBarChart data={byCategory} xKey="category" series={[{ key: "count", label: "Items" }]} />
      </ChartCard>
    </div>
  );
}

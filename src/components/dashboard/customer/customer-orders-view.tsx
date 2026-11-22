"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ORDER_STATUSES } from "@/lib/constants";
import { errorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { useCancelOrder, useMyOrders } from "@/lib/queries/orders";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ItemImage } from "@/components/menu/item-image";
import { DashboardHeading } from "../dashboard-heading";

type Filter = "all" | OrderStatus;

export function CustomerOrdersView() {
  const { data: orders, isLoading, isError, error, refetch } = useMyOrders();
  const cancel = useCancelOrder();
  const [filter, setFilter] = useState<Filter>("all");
  const [cancelling, setCancelling] = useState<Order | null>(null);

  const visible = useMemo(() => (orders ?? []).filter((o) => filter === "all" || o.status === filter), [orders, filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  async function confirmCancel() {
    if (!cancelling) return;
    try {
      await cancel.mutateAsync(cancelling._id);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setCancelling(null);
    }
  }

  const filters: Filter[] = ["all", ...ORDER_STATUSES];

  return (
    <div className="space-y-6">
      <DashboardHeading title="My orders" description="Track your orders and cancel pending ones." action={<ButtonLink href="/menu">Order more pizza</ButtonLink>} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
            )}
          >
            {f} <span className="opacity-70">({counts[f] ?? 0})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load your orders" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : visible.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "You have not ordered yet" : `No ${filter} orders`}
          description="Browse the menu and place your first order."
          action={filter === "all" ? <ButtonLink href="/menu">Explore Pizza Menu</ButtonLink> : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Delivery date</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ItemImage src={order.item?.images[0]} alt={order.item?.itemName ?? "Item"} sizes="48px" className="size-12 shrink-0 rounded-lg" />
                      <span className="max-w-[10rem] truncate font-medium">{order.item?.itemName ?? "Removed item"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.vendor?.businessName || order.vendor?.name || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(order.deliveryDate)}</TableCell>
                  <TableCell className="max-w-[13rem] text-muted-foreground">{order.deliveryAddress}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" render={<Link href={`/dashboard/customer/orders/${order._id}`} />} nativeButton={false}>
                        <Eye /> Details
                      </Button>
                      {order.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setCancelling(order)}>
                          <XCircle /> Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelling}
        onOpenChange={(o) => !o && setCancelling(null)}
        title="Cancel this order?"
        description={`Your pending order for ${cancelling?.item?.itemName ?? "this item"} will be cancelled. Accepted or rejected orders cannot be cancelled.`}
        confirmLabel="Cancel order"
        destructive
        loading={cancel.isPending}
        onConfirm={confirmCancel}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { ORDER_STATUSES } from "@/lib/constants";
import { errorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { useDecideOrder, useVendorOrders } from "@/lib/queries/vendor";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { initials } from "@/components/layout/user-menu";
import { ItemImage } from "@/components/menu/item-image";
import { DashboardHeading } from "../dashboard-heading";

type Filter = "all" | OrderStatus;

export function VendorOrdersView() {
  const { data: orders, isLoading, isError, error, refetch } = useVendorOrders();
  const decide = useDecideOrder();
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, setPending] = useState<{ order: Order; action: "accept" | "reject" } | null>(null);

  const visible = useMemo(() => (orders ?? []).filter((o) => filter === "all" || o.status === filter), [orders, filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  async function confirm() {
    if (!pending) return;
    try {
      const res = await decide.mutateAsync({ id: pending.order._id, action: pending.action });
      toast.success(res.message);
      setPending(null);
    } catch (err) {
      toast.error(errorMessage(err));
      setPending(null);
    }
  }

  const filters: Filter[] = ["all", ...ORDER_STATUSES];

  return (
    <div className="space-y-6">
      <DashboardHeading title="Customer orders" description="Review incoming orders. Pending orders can be accepted or rejected once." />

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
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load orders" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : visible.length === 0 ? (
        <EmptyState title="No orders here" description="Orders from customers will show up in this list." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={order.customer?.image ?? undefined} alt="" />
                        <AvatarFallback>{initials(order.customer?.name ?? "C")}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{order.customer?.name ?? "Customer"}</p>
                        <p className="truncate text-xs text-muted-foreground">{order.customer?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ItemImage src={order.item?.images[0]} alt={order.item?.itemName ?? "Item"} sizes="48px" className="size-12 shrink-0 rounded-lg" />
                      <span className="max-w-[10rem] truncate font-medium">{order.item?.itemName ?? "Removed item"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(order.deliveryDate)}</TableCell>
                  <TableCell className="max-w-[14rem] text-muted-foreground">{order.deliveryAddress}</TableCell>
                  <TableCell className="max-w-[12rem] text-muted-foreground">{order.message || "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" disabled={order.status !== "pending" || decide.isPending} onClick={() => setPending({ order, action: "accept" })}>
                        <Check /> Accept
                      </Button>
                      <Button size="sm" variant="outline" disabled={order.status !== "pending" || decide.isPending} onClick={() => setPending({ order, action: "reject" })}>
                        <X /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        title={pending?.action === "accept" ? "Accept this order?" : "Reject this order?"}
        description={`${pending?.action === "accept" ? "Accept" : "Reject"} the order for ${pending?.order.item?.itemName ?? "this item"} from ${pending?.order.customer?.name ?? "the customer"}. This can only be done once.`}
        confirmLabel={pending?.action === "accept" ? "Accept order" : "Reject order"}
        destructive={pending?.action === "reject"}
        loading={decide.isPending}
        onConfirm={confirm}
      />
    </div>
  );
}

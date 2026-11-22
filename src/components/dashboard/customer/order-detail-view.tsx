"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarDays, MapPin, MessageSquare, SearchX, Store, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ApiError, errorMessage } from "@/lib/api-error";
import { formatDate, formatPrice } from "@/lib/format";
import { useCancelOrder, useOrder } from "@/lib/queries/orders";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ItemImage } from "@/components/menu/item-image";
import { OrderTimeline } from "@/components/orders/order-timeline";

export function OrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError, error } = useOrder(id);
  const cancel = useCancelOrder();

  if (isLoading) return <Skeleton className="h-[28rem] w-full" />;
  if (isError || !order) {
    const missing = error instanceof ApiError && error.status === 404;
    return (
      <EmptyState
        icon={missing ? SearchX : AlertTriangle}
        title={missing ? "Order not found" : "Could not load this order"}
        description={missing ? "It does not exist or belongs to another account." : errorMessage(error)}
        action={<ButtonLink href="/dashboard/customer/orders">Back to my orders</ButtonLink>}
      />
    );
  }

  async function handleCancel() {
    try {
      await cancel.mutateAsync(id);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/customer/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back to my orders
      </Link>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Order details</h1>
          <StatusBadge status={order.status} />
        </div>
        {order.status === "pending" && (
          <Button variant="outline" className="text-destructive" onClick={handleCancel} disabled={cancel.isPending}>
            <XCircle /> Cancel order
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <ItemImage src={order.item?.images[0]} alt={order.item?.itemName ?? "Item"} sizes="112px" className="size-24 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{order.item?.itemName ?? "Removed item"}</p>
                <p className="text-sm text-muted-foreground">{order.item?.category}</p>
                {order.item && <p className="mt-1 font-bold text-primary">{formatPrice(order.item.price)}</p>}
              </div>
            </div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex gap-3">
                <Store className="mt-0.5 size-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Vendor</dt>
                  <dd className="font-medium">{order.vendor?.businessName || order.vendor?.name || "—"}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 size-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Delivery date</dt>
                  <dd className="font-medium">{formatDate(order.deliveryDate)}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Delivery address</dt>
                  <dd className="font-medium">{order.deliveryAddress}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="mt-0.5 size-4 text-primary" />
                <div>
                  <dt className="text-muted-foreground">Special instructions</dt>
                  <dd className="font-medium">{order.message || "None"}</dd>
                </div>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">Requested on {formatDate(order.createdAt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline history={order.statusHistory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, PackagePlus, Pencil, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ITEM_STATUSES } from "@/lib/constants";
import { errorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";
import type { ItemStatus, MenuItem } from "@/lib/types";
import { useDeleteItem, useSetAvailability, useVendorItems } from "@/lib/queries/vendor";
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
import { ItemDetailsDialog } from "./item-details-dialog";

type Filter = "all" | ItemStatus;

export function VendorItemsView() {
  const { data: items, isLoading, isError, error, refetch } = useVendorItems();
  const setAvailability = useSetAvailability();
  const deleteItem = useDeleteItem();
  const [filter, setFilter] = useState<Filter>("all");
  const [viewing, setViewing] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);

  const visible = useMemo(() => (items ?? []).filter((i) => filter === "all" || i.status === filter), [items, filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items?.length ?? 0 };
    for (const i of items ?? []) c[i.status] = (c[i.status] ?? 0) + 1;
    return c;
  }, [items]);

  async function toggle(item: MenuItem) {
    const available = item.status !== "approved";
    try {
      await setAvailability.mutateAsync({ id: item._id, available });
      toast.success(available ? "Item is now available to customers" : "Item hidden from customers");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteItem.mutateAsync(deleting._id);
      toast.success("Menu item deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  const filters: Filter[] = ["all", ...ITEM_STATUSES];

  return (
    <div className="space-y-6">
      <DashboardHeading
        title="My menu items"
        description="Manage everything you sell. Only approved, available items are visible to customers."
        action={
          <ButtonLink href="/dashboard/vendor/items/new">
            <PackagePlus /> Add item
          </ButtonLink>
        }
      />

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
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load your items" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : visible.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "No menu items yet" : `No ${filter} items`}
          description={filter === "all" ? "Add your first pizza to start receiving orders." : "Items with this status will appear here."}
          action={
            filter === "all" ? (
              <ButtonLink href="/dashboard/vendor/items/new">
                <PackagePlus /> Add menu item
              </ButtonLink>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <ItemImage src={item.images[0]} alt={item.itemName} sizes="64px" className="size-14 rounded-lg" />
                  </TableCell>
                  <TableCell className="max-w-[14rem] truncate font-medium">{item.itemName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="font-semibold">{formatPrice(item.price)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label={`View ${item.itemName}`} onClick={() => setViewing(item)}>
                        <Eye />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Edit ${item.itemName}`} render={<Link href={`/dashboard/vendor/items/${item._id}/edit`} />} nativeButton={false}>
                        <Pencil />
                      </Button>
                      {(item.status === "approved" || item.status === "inactive") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={item.status === "approved" ? `Make ${item.itemName} unavailable` : `Make ${item.itemName} available`}
                          title={item.status === "approved" ? "Hide from customers" : "Make available"}
                          disabled={setAvailability.isPending}
                          onClick={() => toggle(item)}
                        >
                          <Power className={item.status === "approved" ? "text-success" : "text-muted-foreground"} />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" aria-label={`Delete ${item.itemName}`} onClick={() => setDeleting(item)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ItemDetailsDialog item={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this menu item?"
        description={`"${deleting?.itemName}" will be permanently removed. Items with active orders cannot be deleted.`}
        confirmLabel="Delete item"
        destructive
        loading={deleteItem.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

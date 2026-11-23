"use client";

import { useState } from "react";
import { Check, ChevronDown, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, ITEM_STATUSES } from "@/lib/constants";
import { errorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";
import { useAdminDeleteItem, useAdminItems, useSetItemStatus, type AdminItem } from "@/lib/queries/admin";
import type { ItemStatus } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Pager } from "@/components/shared/pager";
import { StatusBadge } from "@/components/shared/status-badge";
import { FilterSelect } from "@/components/menu/filter-select";
import { ItemImage } from "@/components/menu/item-image";
import { DashboardHeading } from "../dashboard-heading";
import { RecordCard, RecordList } from "../record-card";

const STATUS_OPTIONS = [{ value: "all", label: "All statuses" }, ...ITEM_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))];
const CATEGORY_OPTIONS = [{ value: "all", label: "All categories" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];

export function AdminItemsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const q = useDebounce(search);
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminItems({
    q: q || undefined,
    status: status === "all" ? undefined : status,
    category: category === "all" ? undefined : category,
    page,
  });
  const setItemStatus = useSetItemStatus();
  const remove = useAdminDeleteItem();
  const [deleting, setDeleting] = useState<AdminItem | null>(null);

  async function changeStatus(item: AdminItem, next: ItemStatus) {
    try {
      const res = await setItemStatus.mutateAsync({ id: item._id, status: next });
      toast.success(res.message);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting._id);
      toast.success("Menu item deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(null);
    }
  }

  const reset = () => setPage(1);

  return (
    <div className="space-y-6">
      <DashboardHeading title="Manage menu items" description="Review pending submissions, change the status of published items or remove inappropriate ones." />

      <div className="grid gap-4 rounded-2xl border bg-card p-4 lg:grid-cols-[1fr_13rem_16rem]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              reset();
            }}
            placeholder="Search by name, location or description"
            aria-label="Search menu items"
            className="h-11 pl-10"
          />
        </div>
        <FilterSelect id="status" label="" value={status} options={STATUS_OPTIONS} onChange={(v) => { setStatus(v); reset(); }} />
        <FilterSelect id="category" label="" value={category} options={CATEGORY_OPTIONS} onChange={(v) => { setCategory(v); reset(); }} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load menu items" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No menu items found" description="Adjust the search or filters." />
      ) : (
        <>
          <div className={`hidden overflow-x-auto rounded-2xl border bg-card xl:block ${isFetching ? "opacity-70" : ""}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ItemImage src={item.images[0]} alt={item.itemName} sizes="48px" className="size-12 shrink-0 rounded-lg" />
                        <div className="min-w-0">
                          <p className="max-w-[12rem] truncate font-medium">{item.itemName}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.vendor?.businessName || item.vendor?.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                    <TableCell className="font-semibold">{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {item.status === "pending" ? (
                          <>
                            <Button size="sm" disabled={setItemStatus.isPending} onClick={() => changeStatus(item, "approved")}>
                              <Check /> Approve
                            </Button>
                            <Button size="sm" variant="outline" disabled={setItemStatus.isPending} onClick={() => changeStatus(item, "rejected")}>
                              <X /> Reject
                            </Button>
                          </>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button size="sm" variant="outline" disabled={setItemStatus.isPending} />}>
                              Change status <ChevronDown />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {ITEM_STATUSES.filter((s) => s !== item.status).map((s) => (
                                <DropdownMenuItem key={s} className="capitalize" onClick={() => changeStatus(item, s)}>
                                  Mark {s}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
          <RecordList className={isFetching ? "opacity-70" : ""}>
            {data.items.map((item) => (
              <RecordCard
                key={item._id}
                media={<ItemImage src={item.images[0]} alt={item.itemName} sizes="64px" className="size-14 shrink-0 rounded-xl" />}
                title={item.itemName}
                subtitle={item.vendor?.businessName || item.vendor?.name || "Unknown vendor"}
                badge={<StatusBadge status={item.status} />}
                fields={[
                  { label: "Category", value: item.category },
                  { label: "Price", value: formatPrice(item.price) },
                  { label: "Location", value: item.location, wide: true },
                ]}
                actions={
                  <>
                    {item.status === "pending" ? (
                      <>
                        <Button size="sm" className="flex-1" disabled={setItemStatus.isPending} onClick={() => changeStatus(item, "approved")}>
                          <Check /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" disabled={setItemStatus.isPending} onClick={() => changeStatus(item, "rejected")}>
                          <X /> Reject
                        </Button>
                      </>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button size="sm" variant="outline" disabled={setItemStatus.isPending} />}>
                          Change status <ChevronDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {ITEM_STATUSES.filter((st) => st !== item.status).map((st) => (
                            <DropdownMenuItem key={st} className="capitalize" onClick={() => changeStatus(item, st)}>
                              Mark {st}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleting(item)}>
                      <Trash2 /> Delete
                    </Button>
                  </>
                }
              />
            ))}
          </RecordList>
          <Pager page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this menu item?"
        description={`"${deleting?.itemName}" will be permanently removed and any pending orders for it will be rejected.`}
        confirmLabel="Delete item"
        destructive
        loading={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

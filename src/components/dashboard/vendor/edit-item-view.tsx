"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, SearchX } from "lucide-react";
import { toast } from "sonner";
import { useUpdateItem, useVendorItem } from "@/lib/queries/vendor";
import { ApiError, errorMessage } from "@/lib/api-error";
import type { ItemValues } from "@/lib/validators";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardHeading } from "../dashboard-heading";
import { ItemForm } from "./item-form";

export function EditItemView({ id }: { id: string }) {
  const router = useRouter();
  const { data: item, isLoading, isError, error } = useVendorItem(id);
  const updateItem = useUpdateItem(id);

  if (isLoading) return <Skeleton className="mx-auto h-[32rem] max-w-3xl" />;
  if (isError || !item) {
    const missing = error instanceof ApiError && error.status === 404;
    return (
      <EmptyState
        icon={missing ? SearchX : AlertTriangle}
        title={missing ? "Menu item not found" : "Could not load this item"}
        description={missing ? "It may have been deleted, or it belongs to another vendor." : errorMessage(error)}
        action={<ButtonLink href="/dashboard/vendor/items">Back to my items</ButtonLink>}
      />
    );
  }

  async function handleSubmit(values: ItemValues) {
    await updateItem.mutateAsync(values);
    toast.success(item?.status === "approved" ? "Item updated and sent for re-approval" : "Item updated");
    router.push("/dashboard/vendor/items");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <DashboardHeading title="Edit menu item" description="Changes to an approved or rejected item require admin approval again." />
      <ItemForm
        defaultValues={{
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          price: item.price,
          location: item.location,
          images: item.images,
        }}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancelHref="/dashboard/vendor/items"
      />
    </div>
  );
}

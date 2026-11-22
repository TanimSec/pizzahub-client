"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateItem } from "@/lib/queries/vendor";
import type { ItemValues } from "@/lib/validators";
import { DashboardHeading } from "../dashboard-heading";
import { ItemForm } from "./item-form";

export function NewItemView() {
  const router = useRouter();
  const createItem = useCreateItem();

  async function handleSubmit(values: ItemValues) {
    await createItem.mutateAsync(values);
    toast.success("Menu item submitted. It will go live once an admin approves it.");
    router.push("/dashboard/vendor/items");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <DashboardHeading title="Add menu item" description="New items start as pending until an admin approves them." />
      <ItemForm submitLabel="Submit for approval" onSubmit={handleSubmit} onCancelHref="/dashboard/vendor/items" />
    </div>
  );
}

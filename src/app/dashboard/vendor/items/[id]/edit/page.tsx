import type { Metadata } from "next";
import { EditItemView } from "@/components/dashboard/vendor/edit-item-view";

export const metadata: Metadata = { title: "Edit Menu Item" };

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditItemView id={id} />;
}

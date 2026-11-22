import type { Metadata } from "next";
import { NewItemView } from "@/components/dashboard/vendor/new-item-view";

export const metadata: Metadata = { title: "Add Menu Item" };

export default function NewItemPage() {
  return <NewItemView />;
}

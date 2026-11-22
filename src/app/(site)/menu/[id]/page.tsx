import type { Metadata } from "next";
import { ItemDetails } from "@/components/menu/item-details";
import { requireUser } from "@/lib/session";
import type { Role } from "@/lib/types";

export const metadata: Metadata = { title: "Menu Item" };

export default async function MenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser(`/menu/${id}`);
  const user = session.user as { id: string; role?: string };
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ItemDetails id={id} role={(user.role ?? "customer") as Role} userId={user.id} />
    </div>
  );
}

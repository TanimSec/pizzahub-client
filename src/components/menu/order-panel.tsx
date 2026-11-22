import { Info } from "lucide-react";
import type { MenuItem, Role } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";
import { OrderDialog } from "./order-dialog";

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border bg-secondary/60 p-4 text-sm text-secondary-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" /> <span>{children}</span>
    </p>
  );
}

export function OrderPanel({ item, role, userId }: { item: MenuItem; role: Role; userId: string }) {
  if (item.status !== "approved") {
    return <Notice>This item is currently {item.status} and cannot be ordered by customers.</Notice>;
  }
  if (role === "customer") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <OrderDialog item={item} />
        <FavoriteButton itemId={item._id} />
      </div>
    );
  }
  if (role === "vendor") {
    return <Notice>{item.vendorId === userId ? "This is your own menu item, so you cannot order it." : "Vendors cannot place customer orders. Sign in with a customer account to order."}</Notice>;
  }
  return <Notice>Admin accounts cannot place customer orders.</Notice>;
}

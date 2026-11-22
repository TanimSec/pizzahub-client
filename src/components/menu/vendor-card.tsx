import { Store } from "lucide-react";
import type { VendorInfo } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/components/layout/user-menu";
import { PremiumBadge } from "./premium-badge";

export function VendorCard({ vendor }: { vendor?: VendorInfo }) {
  const name = vendor?.businessName || vendor?.name || "Local vendor";
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <Avatar size="lg" className="size-12">
        <AvatarImage src={vendor?.image ?? undefined} alt={name} />
        <AvatarFallback className="bg-secondary">
          <Store className="size-5 text-primary" /> <span className="sr-only">{initials(name)}</span>
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sold by</p>
        <p className="truncate font-semibold">{name}</p>
        {vendor?.isPremium && <PremiumBadge className="mt-1" />}
      </div>
    </div>
  );
}

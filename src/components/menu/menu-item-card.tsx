import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ItemImage } from "./item-image";
import { PremiumBadge } from "./premium-badge";

export function MenuItemCard({ item, priority }: { item: MenuItem; priority?: boolean }) {
  const vendorName = item.vendor?.businessName || item.vendor?.name || "Local vendor";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/menu/${item._id}`} className="relative block" aria-label={`View ${item.itemName}`}>
        <ItemImage src={item.images[0]} alt={item.itemName} priority={priority} className="aspect-[4/3] w-full" />
        {item.vendor?.isPremium && <PremiumBadge className="absolute left-3 top-3 shadow" />}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold leading-snug text-foreground">{item.itemName}</h3>
          <span className="shrink-0 text-lg font-bold text-primary">{formatPrice(item.price)}</span>
        </div>
        <Badge variant="secondary" className="w-fit">
          {item.category}
        </Badge>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{item.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <Store className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{vendorName}</span>
          </li>
        </ul>
        <ButtonLink href={`/menu/${item._id}`} variant="outline" className="mt-auto w-full">
          View Details
        </ButtonLink>
      </div>
    </article>
  );
}

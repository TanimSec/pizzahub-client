"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, MapPin, SearchX } from "lucide-react";
import { useMenuItem } from "@/lib/queries/menu";
import { ApiError, errorMessage } from "@/lib/api-error";
import { formatPrice, formatDate } from "@/lib/format";
import type { Role } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ImageGallery } from "./image-gallery";
import { OrderPanel } from "./order-panel";
import { VendorCard } from "./vendor-card";

function DetailsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2" aria-busy="true" aria-label="Loading item">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-48" />
      </div>
    </div>
  );
}

export function ItemDetails({ id, role, userId }: { id: string; role: Role; userId: string }) {
  const { data: item, isLoading, isError, error, refetch } = useMenuItem(id);

  if (isLoading) return <DetailsSkeleton />;

  if (isError || !item) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <EmptyState
        icon={notFound ? SearchX : AlertTriangle}
        title={notFound ? "Menu item not found" : "We couldn't load this item"}
        description={notFound ? "This item does not exist, was removed, or is not available right now." : errorMessage(error)}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            {!notFound && <Button onClick={() => refetch()}>Try again</Button>}
            <ButtonLink href="/menu" variant={notFound ? "default" : "outline"}>
              Back to menu
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/menu" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="size-4" /> Back to menu
      </Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery images={item.images} alt={item.itemName} />
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary">{item.category}</Badge>
            <h1 className="text-3xl font-bold sm:text-4xl">{item.itemName}</h1>
            <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-primary" /> {item.location}
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
          <VendorCard vendor={item.vendor} />
          <p className="text-xs text-muted-foreground">Listed on {formatDate(item.createdAt)}</p>
          <OrderPanel item={item} role={role} userId={userId} />
        </div>
      </div>
    </div>
  );
}

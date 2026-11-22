"use client";

import type { MenuItem } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/format";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageGallery } from "@/components/menu/image-gallery";
import { StatusBadge } from "@/components/shared/status-badge";

interface Props {
  item: MenuItem | null;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailsDialog({ item, onOpenChange }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {item && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{item.itemName}</DialogTitle>
              <DialogDescription>
                {item.category} · {item.location}
              </DialogDescription>
            </DialogHeader>
            <ImageGallery images={item.images} alt={item.itemName} />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Price</dt>
                <dd className="font-semibold">{formatPrice(item.price)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={item.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-semibold">{formatDate(item.createdAt)}</dd>
              </div>
            </dl>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            {item.status === "rejected" && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                This item was rejected and is hidden from customers. Edit it to resubmit for review.
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

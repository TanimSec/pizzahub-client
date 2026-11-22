"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { errorMessage } from "@/lib/api-error";
import { useFavorites, useToggleFavorite } from "@/lib/queries/favorites";
import { Button } from "@/components/ui/button";

export function FavoriteButton({ itemId }: { itemId: string }) {
  const { data } = useFavorites();
  const toggle = useToggleFavorite();
  const isFavorite = !!data?.ids.includes(itemId);

  async function handleClick() {
    try {
      await toggle.mutateAsync({ id: itemId, favorite: !isFavorite });
      toast.success(isFavorite ? "Removed from favorites" : "Saved to favorites");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={handleClick} disabled={toggle.isPending} aria-pressed={isFavorite} className="w-full sm:w-auto">
      <Heart className={cn(isFavorite && "fill-primary text-primary")} /> {isFavorite ? "Saved" : "Save to favorites"}
    </Button>
  );
}

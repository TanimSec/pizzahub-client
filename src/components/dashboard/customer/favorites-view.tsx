"use client";

import { Heart } from "lucide-react";
import { errorMessage } from "@/lib/api-error";
import { useFavorites } from "@/lib/queries/favorites";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { MenuGridSkeleton } from "@/components/menu/menu-skeleton";
import { DashboardHeading } from "../dashboard-heading";

export function FavoritesView() {
  const { data, isLoading, isError, error, refetch } = useFavorites();

  return (
    <div className="space-y-6">
      <DashboardHeading title="Favorites" description="Pizzas and sides you saved for later." />
      {isLoading ? (
        <MenuGridSkeleton count={4} />
      ) : isError ? (
        <EmptyState title="Could not load favorites" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap Save to favorites on any menu item and it will show up here."
          action={<ButtonLink href="/menu">Browse the menu</ButtonLink>}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data.items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

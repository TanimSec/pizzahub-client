"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, SearchX } from "lucide-react";
import { useMenuList, type MenuFilters } from "@/lib/queries/menu";
import { errorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Pager } from "@/components/shared/pager";
import { MenuFiltersBar } from "./menu-filters";
import { MenuGridSkeleton } from "./menu-skeleton";
import { MenuItemCard } from "./menu-item-card";

const KEYS = ["q", "category", "location", "minPrice", "maxPrice", "sort"] as const;

export function MenuBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters = useMemo<MenuFilters>(() => {
    const f: MenuFilters = { page: Number(params.get("page")) || 1 };
    for (const key of KEYS) {
      const v = params.get(key);
      if (v) f[key] = v;
    }
    return f;
  }, [params]);

  const update = useCallback(
    (patch: Partial<MenuFilters>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "" || (k === "page" && v === 1)) next.delete(k);
        else next.set(k, String(v));
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useMenuList(filters);

  return (
    <div className="space-y-8">
      <MenuFiltersBar filters={filters} onChange={update} onReset={() => router.replace(pathname, { scroll: false })} />

      {isLoading ? (
        <MenuGridSkeleton />
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="We couldn't load the menu"
          description={errorMessage(error)}
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No items match your search"
          description="Try a different keyword, or clear some filters to see more pizza."
          action={<Button variant="outline" onClick={() => router.replace(pathname, { scroll: false })}>Clear filters</Button>}
        />
      ) : (
        data && (
          <>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Showing {data.items.length} of {data.total} {data.total === 1 ? "item" : "items"}
            </p>
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isFetching ? "opacity-70 transition-opacity" : ""}`}>
              {data.items.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
            <Pager page={data.page} pages={data.pages} onChange={(page) => update({ page })} />
          </>
        )
      )}
    </div>
  );
}

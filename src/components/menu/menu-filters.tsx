"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { useLocations, type MenuFilters } from "@/lib/queries/menu";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterSelect } from "./filter-select";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

interface Props {
  filters: MenuFilters;
  onChange: (patch: Partial<MenuFilters>) => void;
  onReset: () => void;
}

export function MenuFiltersBar({ filters, onChange, onReset }: Props) {
  const { data: locations = [] } = useLocations();
  const [search, setSearch] = useState(filters.q ?? "");
  const debounced = useDebounce(search);

  useEffect(() => {
    if ((filters.q ?? "") !== debounced) onChange({ q: debounced || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    setSearch(filters.q ?? "");
  }, [filters.q]);

  const categoryOptions = [{ value: "all", label: "All categories" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];
  const locationOptions = [{ value: "all", label: "All locations" }, ...locations.map((l) => ({ value: l, label: l }))];
  const hasFilters = !!(filters.q || filters.category || filters.location || filters.minPrice || filters.maxPrice);

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pizzas, sides, desserts or restaurants"
          aria-label="Search menu"
          className="h-12 pl-10"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FilterSelect
          id="category"
          label="Category"
          value={filters.category ?? "all"}
          options={categoryOptions}
          onChange={(v) => onChange({ category: v === "all" ? undefined : v, page: 1 })}
        />
        <FilterSelect
          id="location"
          label="Location"
          value={filters.location ?? "all"}
          options={locationOptions}
          onChange={(v) => onChange({ location: v === "all" ? undefined : v, page: 1 })}
        />
        <FilterSelect id="sort" label="Sort by" value={filters.sort ?? "newest"} options={SORTS} onChange={(v) => onChange({ sort: v === "newest" ? undefined : v, page: 1 })} />
        <div className="space-y-1.5">
          <Label htmlFor="minPrice" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Min price
          </Label>
          <Input id="minPrice" type="number" min={0} inputMode="decimal" placeholder="$0" className="h-11" value={filters.minPrice ?? ""} onChange={(e) => onChange({ minPrice: e.target.value || undefined, page: 1 })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxPrice" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Max price
          </Label>
          <Input id="maxPrice" type="number" min={0} inputMode="decimal" placeholder="Any" className="h-11" value={filters.maxPrice ?? ""} onChange={(e) => onChange({ maxPrice: e.target.value || undefined, page: 1 })} />
        </div>
      </div>
      {hasFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw /> Clear all filters
        </Button>
      )}
    </div>
  );
}

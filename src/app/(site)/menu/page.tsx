import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { MenuGridSkeleton } from "@/components/menu/menu-skeleton";

export const metadata: Metadata = {
  title: "Browse Menu",
  description: "Search and filter pizzas, sides and desserts from local pizzerias.",
};

export default function MenuPage() {
  return (
    <>
      <PageHeader title="Browse the Menu" description="Search by name, filter by category or location and sort by price to find your perfect pizza." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={<MenuGridSkeleton />}>
          <MenuBrowser />
        </Suspense>
      </div>
    </>
  );
}

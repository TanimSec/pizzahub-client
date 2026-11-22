import { ArrowRight } from "lucide-react";
import { Pizza } from "lucide-react";
import { publicGet } from "@/lib/server-api";
import type { MenuItem } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Reveal, stagger } from "@/components/motion/reveal";

async function loadFeatured(): Promise<MenuItem[]> {
  try {
    const { items } = await publicGet<{ items: MenuItem[] }>("/api/menu/featured", 60);
    return items;
  } catch {
    return [];
  }
}

export async function FeaturedItems() {
  const items = await loadFeatured();
  return (
    <section className="py-16 sm:py-20" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="featured-heading"
          eyebrow="Fresh from the oven"
          title="Featured Menu Items"
          description="Handpicked favorites from our best local pizzerias, ready to be at your door."
        />
        {items.length === 0 ? (
          <EmptyState
            className="mt-12"
            icon={Pizza}
            title="Menu is warming up"
            description="Featured items will appear here as soon as vendors publish their menus."
          />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <Reveal key={item._id} delay={stagger(i)} className="h-full">
                <MenuItemCard item={item} priority={i < 4} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <ButtonLink href="/menu" variant="outline" size="lg">
            View Full Menu <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

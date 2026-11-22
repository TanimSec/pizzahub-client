import Link from "next/link";
import { Beef, Cake, Carrot, Pizza, Sparkles, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, stagger } from "@/components/motion/reveal";
import { publicGet } from "@/lib/server-api";

const icons: Record<Category, LucideIcon> = {
  "Classic Pizzas": Pizza,
  "Vegetarian Pizzas": Carrot,
  "Meat Lovers": Beef,
  "Specialty / Gourmet Pizzas": Sparkles,
  "Sides & Appetizers": UtensilsCrossed,
  "Beverages & Desserts": Cake,
};

async function loadCounts(): Promise<{ name: Category; count: number }[]> {
  try {
    const { categories } = await publicGet<{ categories: { name: Category; count: number }[] }>("/api/menu/categories", 60);
    return categories;
  } catch {
    return (Object.keys(icons) as Category[]).map((name) => ({ name, count: 0 }));
  }
}

export async function Categories() {
  const categories = await loadCounts();
  return (
    <section className="bg-secondary/40 py-16 sm:py-20" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="categories-heading"
          eyebrow="Craving something?"
          title="Explore Pizza Categories"
          description="From timeless classics to gourmet creations, find exactly what you feel like eating."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, count }, i) => {
            const Icon = icons[name];
            return (
              <Reveal key={name} delay={stagger(i)} className="h-full">
                <Link
                  href={`/menu?category=${encodeURIComponent(name)}`}
                  className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-7" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold">{name}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

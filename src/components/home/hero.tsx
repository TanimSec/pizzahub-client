import { ArrowRight, Clock, ShieldCheck, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PizzaIllustration } from "./pizza-illustration";

const perks = [
  { icon: Clock, label: "Fast local delivery" },
  { icon: Star, label: "Top-rated shops" },
  { icon: ShieldCheck, label: "Verified vendors" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full bg-accent/25 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-primary">
            <span className="size-2 rounded-full bg-primary" /> Now delivering from local pizza shops
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza Delivered to Your Door
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Browse menus from the best pizzerias near you, pick your favorites and place an order in under a minute.
            Stone-baked, loaded with toppings, and on its way while it&apos;s still sizzling.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink href="/menu" size="lg">
              Explore Pizza Menu <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/sign-up" size="lg" variant="outline">
              Become a Vendor
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            {perks.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <Icon className="size-4 text-primary" /> {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          <PizzaIllustration className="h-auto w-full drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}

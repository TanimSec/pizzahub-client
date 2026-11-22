import { ClipboardCheck, PackageCheck, Search, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { stagger } from "@/lib/stagger";

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: "Browse the menu", text: "Search and filter pizzas, sides and desserts from restaurants near you." },
  { icon: ClipboardCheck, title: "Place your order", text: "Pick a delivery date, add your address and any special instructions." },
  { icon: PackageCheck, title: "Track and enjoy", text: "Follow your order status from pending to accepted, then dig in." },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="how-heading" eyebrow="Three easy steps" title="How PizzaHub Works" description="From craving to doorstep in minutes." />
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={stagger(i, 0.1)} className="h-full">
              <li className="relative h-full rounded-2xl border bg-card p-7 text-center">
                <span className="absolute -top-4 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="mx-auto mb-4 mt-2 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="size-8" />
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

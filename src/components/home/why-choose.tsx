import { BadgePercent, ChefHat, CreditCard, MapPinned, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { stagger } from "@/lib/stagger";

const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ChefHat, title: "Local pizzerias you can trust", text: "Every restaurant is verified, so you order from real neighborhood kitchens." },
  { icon: Truck, title: "Hot delivery, on your schedule", text: "Choose the delivery date and address that suit you and add notes for the chef." },
  { icon: BadgePercent, title: "Fresh menus, fair prices", text: "Vendors set their own prices and update menus any time, so you always see what is available." },
  { icon: ShieldCheck, title: "Reviewed before it is listed", text: "Admins approve every menu item before it appears, keeping the marketplace clean." },
  { icon: MapPinned, title: "Search by area and craving", text: "Filter by category, location and price, then sort to find the perfect slice fast." },
  { icon: CreditCard, title: "Simple, secure checkout", text: "Vendors upgrade through Stripe, and your account data stays protected end to end." },
];

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="why-heading"
          eyebrow="The PizzaHub difference"
          title="Why Choose PizzaHub?"
          description="Built for pizza lovers and the restaurants that feed them."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={stagger(i)} className="h-full">
              <div className="h-full rounded-2xl border bg-card p-6 shadow-sm">
                <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

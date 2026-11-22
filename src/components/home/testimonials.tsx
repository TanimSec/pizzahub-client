import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, stagger } from "@/components/motion/reveal";

const reviews = [
  { name: "Maria L.", role: "Customer", text: "Ordering was effortless and the pizza arrived exactly when I asked. The special-instructions box is a lifesaver." },
  { name: "Giuseppe R.", role: "Restaurant owner", text: "Listing my menu took minutes and Premium put us on the homepage. Orders doubled within a month." },
  { name: "Aisha K.", role: "Customer", text: "I love filtering by area and sorting by price. Found a great vegetarian place two streets away." },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="reviews-heading" eyebrow="Loved by locals" title="Customer Testimonials" description="Hear from the people who order and cook with PizzaHub." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={stagger(i, 0.1)} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm">
                <Quote className="size-8 text-accent" />
                <blockquote className="mt-3 flex-1 leading-relaxed text-foreground/90">{r.text}</blockquote>
                <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className="size-4 fill-accent text-accent" />
                  ))}
                </div>
                <figcaption className="mt-3 text-sm">
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-muted-foreground"> · {r.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

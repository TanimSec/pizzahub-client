import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand() {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <div aria-hidden="true" className="absolute -left-10 -top-10 size-56 rounded-full bg-accent/30 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-16 -right-10 size-64 rounded-full bg-background/10 blur-2xl" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl">
              Own a pizzeria? Put your menu in front of hungry customers.
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-primary-foreground/85">
              Join PizzaHub, publish your menu and manage orders from one dashboard. Upgrade to Premium for a featured spot on the homepage.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/sign-up" size="lg" variant="secondary">
                Start Selling <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/menu" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                Browse the Menu
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

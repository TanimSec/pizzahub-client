import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from "@/components/brand/social-icons";

const explore = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = [
  { label: "Classic Pizzas", href: "/menu?category=Classic%20Pizzas" },
  { label: "Vegetarian Pizzas", href: "/menu?category=Vegetarian%20Pizzas" },
  { label: "Meat Lovers", href: "/menu?category=Meat%20Lovers" },
  { label: "Sides & Appetizers", href: "/menu?category=Sides%20%26%20Appetizers" },
];

const socials = [
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YouTubeIcon },
];

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-primary";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Discover local pizza shops, browse fresh menus and get your favorites delivered hot to your door.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border bg-background text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Explore" className="space-y-4">
          <h3 className="font-heading text-lg font-semibold">Explore</h3>
          <ul className="space-y-2.5">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Categories" className="space-y-4">
          <h3 className="font-heading text-lg font-semibold">Popular Categories</h3>
          <ul className="space-y-2.5">
            {categories.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          <h3 className="font-heading text-lg font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {SITE.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-primary" /> {SITE.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-primary" /> {SITE.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} PizzaHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

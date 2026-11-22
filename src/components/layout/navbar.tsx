"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { navLinksFor } from "@/lib/nav";
import type { Role } from "@/lib/types";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu, type NavUser } from "./user-menu";
import { MobileNav } from "./mobile-nav";

export function Navbar({ initialUser }: { initialUser: NavUser | null }) {
  const pathname = usePathname();
  const { data, isPending } = useSession();

  const live = data?.user as { name: string; email: string; image?: string | null; role?: string } | undefined;
  const user: NavUser | null = isPending
    ? initialUser
    : live
      ? { name: live.name, email: live.email, image: live.image, role: (live.role ?? "customer") as Role }
      : null;

  const links = navLinksFor(user?.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  active ? "bg-secondary text-primary" : "text-foreground/80",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href="/sign-in" variant="ghost">
                Sign In
              </ButtonLink>
              <ButtonLink href="/sign-up">Sign Up</ButtonLink>
            </div>
          )}
          <MobileNav links={links} signedIn={!!user} />
        </div>
      </div>
    </header>
  );
}

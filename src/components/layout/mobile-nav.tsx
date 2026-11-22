"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "@/components/brand/logo";

export function MobileNav({ links, signedIn }: { links: NavLink[]; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2 font-heading text-xl">
            <LogoMark className="size-7" /> PizzaHub
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <SheetClose
                key={link.href}
                render={
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                      active ? "bg-secondary text-primary" : "text-foreground",
                    )}
                  />
                }
              >
                {link.label}
              </SheetClose>
            );
          })}
        </nav>
        {!signedIn && (
          <div className="mt-auto flex flex-col gap-2 border-t p-4">
            <ButtonLink href="/sign-in" variant="outline" onClick={() => setOpen(false)}>
              Sign In
            </ButtonLink>
            <ButtonLink href="/sign-up" onClick={() => setOpen(false)}>
              Sign Up
            </ButtonLink>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

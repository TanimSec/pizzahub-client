import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-9", className)}>
      <path d="M20 37 4.5 9.5a26 26 0 0 1 31 0L20 37Z" fill="#F2B84B" />
      <path d="M4.5 9.5a26 26 0 0 1 31 0l-1.8 3.2a22 22 0 0 0-27.4 0L4.5 9.5Z" fill="#B7501F" />
      <circle cx="16" cy="17.5" r="3" fill="#C8102E" />
      <circle cx="24.5" cy="20" r="3" fill="#C8102E" />
      <circle cx="19.5" cy="26.5" r="2.4" fill="#C8102E" />
      <circle cx="21" cy="14" r="1.1" fill="#2F7D4F" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="PizzaHub home" className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Pizza<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}

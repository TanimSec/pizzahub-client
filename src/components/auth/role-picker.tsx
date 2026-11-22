"use client";

import { ChefHat, ShoppingBag, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SignupRole = "customer" | "vendor";

const options: { value: SignupRole; title: string; text: string; icon: LucideIcon }[] = [
  { value: "customer", title: "Customer", text: "Order pizza and track deliveries", icon: ShoppingBag },
  { value: "vendor", title: "Vendor", text: "Restaurant owner selling on PizzaHub", icon: ChefHat },
];

export function RolePicker({ value, onChange }: { value: SignupRole; onChange: (role: SignupRole) => void }) {
  return (
    <div role="radiogroup" aria-label="Account role" className="grid grid-cols-2 gap-3">
      {options.map(({ value: v, title, text, icon: Icon }) => {
        const selected = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(v)}
            className={cn(
              "flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-colors",
              selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
            )}
          >
            <Icon className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")} />
            <span className="font-semibold">{title}</span>
            <span className="text-xs leading-snug text-muted-foreground">{text}</span>
          </button>
        );
      })}
    </div>
  );
}

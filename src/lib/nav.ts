import type { Role } from "./types";

export interface NavLink {
  label: string;
  href: string;
}

const base: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
];

const byRole: Record<Role, NavLink[]> = {
  customer: [
    { label: "My Orders", href: "/dashboard/customer/orders" },
    { label: "Favorites", href: "/dashboard/customer/favorites" },
  ],
  vendor: [
    { label: "My Menu", href: "/dashboard/vendor/items" },
    { label: "Customer Orders", href: "/dashboard/vendor/orders" },
  ],
  admin: [
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "Manage Items", href: "/dashboard/admin/items" },
  ],
};

export function navLinksFor(role?: Role | null): NavLink[] {
  return role ? [...base, ...byRole[role]] : base;
}

export const profilePath = (role: Role): string => `/dashboard/${role}/profile`;

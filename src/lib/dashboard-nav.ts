import {
  CreditCard,
  Heart,
  LayoutDashboard,
  ListOrdered,
  PackagePlus,
  Receipt,
  ShoppingBag,
  Store,
  UserCog,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./types";

export interface DashboardLink {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const dashboardNav: Record<Role, DashboardLink[]> = {
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard, exact: true },
    { label: "My Menu Items", href: "/dashboard/vendor/items", icon: UtensilsCrossed, exact: true },
    { label: "Add Menu Item", href: "/dashboard/vendor/items/new", icon: PackagePlus },
    { label: "Customer Orders", href: "/dashboard/vendor/orders", icon: ListOrdered },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Profile Settings", href: "/dashboard/vendor/profile", icon: UserCog },
  ],
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
    { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { label: "Profile Settings", href: "/dashboard/customer/profile", icon: UserCog },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Menu Items", href: "/dashboard/admin/items", icon: Store },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "Profile Settings", href: "/dashboard/admin/profile", icon: UserCog },
  ],
};

export const roleLabel: Record<Role, string> = {
  vendor: "Vendor",
  customer: "Customer",
  admin: "Admin",
};

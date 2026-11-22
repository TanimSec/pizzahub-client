import type { Category } from "./constants";

export type Role = "vendor" | "customer" | "admin";
export type ItemStatus = "pending" | "approved" | "rejected" | "inactive";
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type TxStatus = "pending" | "paid" | "failed" | "canceled";

export interface VendorInfo {
  _id: string;
  name: string;
  image?: string | null;
  businessName?: string | null;
  email?: string;
  isPremium?: boolean;
}

export interface MenuItem {
  _id: string;
  vendorId: string;
  itemName: string;
  category: Category;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  vendor?: VendorInfo;
}

export interface Order {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string }[];
  createdAt: string;
  item?: MenuItem;
  vendor?: VendorInfo;
  customer?: { _id: string; name: string; email: string; image?: string | null };
}

export interface Transaction {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId?: string;
  status: TxStatus;
  createdAt: string;
  vendor?: VendorInfo;
}

export interface Paginated<T> {
  total: number;
  page: number;
  pages: number;
  items?: T[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  businessName: string | null;
  isBlocked: boolean;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  createdAt?: string | null;
}

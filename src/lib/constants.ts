export const SITE = {
  name: "PizzaHub",
  tagline: "Hot & Fresh Pizza Delivered to Your Door",
  email: "hello@pizzahub.example",
  phone: "+1 (555) 014-7788",
  address: "128 Crust Street, Brooklyn, NY",
};

export const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const FREE_ITEM_LIMIT = 3;

export const ORDER_STATUSES = ["pending", "accepted", "rejected", "cancelled"] as const;
export const ITEM_STATUSES = ["pending", "approved", "rejected", "inactive"] as const;

export const PREMIUM_PRICE_LABEL = process.env.NEXT_PUBLIC_PREMIUM_PRICE_LABEL ?? "$9.99 / month";

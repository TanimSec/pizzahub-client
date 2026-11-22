import { format } from "date-fns";

export const formatPrice = (value: number, currency = "USD"): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

export const formatDate = (value: string | Date, pattern = "MMM d, yyyy"): string => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : format(d, pattern);
};

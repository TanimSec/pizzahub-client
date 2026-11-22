import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine((v) => /[A-Z]/.test(v), "Include at least one uppercase letter")
  .refine((v) => /[a-z]/.test(v), "Include at least one lowercase letter");

export const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(60),
    email: z.email("Enter a valid email address"),
    password: passwordSchema,
    role: z.enum(["customer", "vendor"]),
    businessName: z.string().trim().max(80).optional(),
  })
  .refine((v) => v.role !== "vendor" || (v.businessName && v.businessName.length >= 2), {
    path: ["businessName"],
    message: "Restaurant name is required for vendors",
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export const todayString = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const orderSchema = z.object({
  deliveryDate: z
    .string()
    .min(1, "Choose a delivery date")
    .refine((v) => v >= todayString(), "Delivery date cannot be in the past"),
  deliveryAddress: z.string().trim().min(5, "Enter a complete delivery address").max(300),
  message: z.string().trim().max(500, "Keep the message under 500 characters").optional(),
});

export type OrderValues = z.infer<typeof orderSchema>;

export const itemSchema = z.object({
  itemName: z.string().trim().min(2, "Item name is too short").max(80),
  category: z.string().min(1, "Choose a category"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  price: z.number({ error: "Enter a valid price" }).positive("Price must be greater than 0").max(1000, "Price cannot exceed $1000"),
  location: z.string().trim().min(2, "Enter the area or city").max(80),
  images: z.array(z.string()).min(1, "Upload at least one image").max(5),
});

export type ItemValues = z.infer<typeof itemSchema>;

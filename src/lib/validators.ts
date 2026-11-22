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

import { z } from "zod";
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["customer", "business"]).optional().default("customer"),
    phone: z.string().optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60).optional(),
    phone: z.string().optional(),
    pushToken: z.string().optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];

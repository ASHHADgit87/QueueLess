import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "business"]),
  phone: z.string().optional(),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  category: z.string().trim().min(2, "Category is required"),
  description: z.string().max(500).optional(),
  address: z.string().trim().min(5, "Address is required"),
  openingHours: z.string().optional(),
});
export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;

export const createQueueSchema = z.object({
  name: z.string().trim().min(2, "Queue name is required").max(60),
  avgServiceTimeMins: z.coerce.number().min(1).max(180).optional(),
});
export type CreateQueueFormValues = z.infer<typeof createQueueSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});
export type ReviewFormValues = z.infer<typeof reviewSchema>;

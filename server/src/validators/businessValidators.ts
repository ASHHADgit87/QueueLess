import { z } from "zod";

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    category: z.string().trim().min(2),
    description: z.string().max(500).optional(),
    address: z.string().trim().min(5),
    openingHours: z.string().optional(),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateBusinessSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    category: z.string().trim().min(2).optional(),
    description: z.string().max(500).optional(),
    address: z.string().trim().min(5).optional(),
    openingHours: z.string().optional(),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

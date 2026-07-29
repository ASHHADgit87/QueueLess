import { z } from "zod";

export const createQueueSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    avgServiceTimeMins: z.number().min(1).max(180).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateQueueSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60).optional(),
    status: z.enum(["active", "paused", "closed"]).optional(),
    avgServiceTimeMins: z.number().min(1).max(180).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const walkInSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(60),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

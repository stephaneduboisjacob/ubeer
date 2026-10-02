import { z } from "zod";

export const orderStatuses = [
  "pending_payment",
  "paid",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
  "failed",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const regionCheckSchema = coordinateSchema;

export const checkoutSchema = z.object({
  regionId: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(24) })).min(1),
  ageVerified: z.literal(true),
  customerEmail: z.string().email().max(254),
});

export const waitlistSchema = z.object({
  email: z.string().email().max(254),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(12).max(200) });

export type Coordinate = z.infer<typeof coordinateSchema>;

import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const venueSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  city: z.string().min(2),
  address: z.string().min(2),
  category: z.enum(["Wedding", "Sport", "Celebration", "Diaspora", "Conference", "Other"]),
  capacity: z.coerce.number().int().positive(),
  priceFrom: z.coerce.number().nonnegative(),
  phone: z.string().min(3),
  email: z.string().email(),
  imageUrl: z.string().min(1),
  galleryImages: z.array(z.string().min(1)).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  sports: z.array(z.string().min(2)).optional(),
  courtCount: z.coerce.number().int().positive().optional().nullable(),
  parking: z.boolean().optional(),
  lockerRooms: z.boolean().optional(),
  floodlights: z.boolean().optional(),
  reservationsEnabled: z.boolean().optional(),
  workingHours: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().optional().nullable()
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  type: z.enum(["GENERAL", "WEDDING", "SPORT", "DIASPORA", "CELEBRATION", "CONFERENCE"]).default("GENERAL"),
  message: z.string().min(5)
});

export const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  eventDate: z.preprocess(emptyToUndefined, z.string().optional()),
  guests: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
  desiredTime: z.preprocess(emptyToUndefined, z.string().optional()),
  message: z.string().min(5),
  venueId: z.string().min(1)
});

export const reviewSchema = z.object({
  name: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5),
  venueId: z.string().min(1)
});

export const forumPostSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(10),
  city: z.preprocess(emptyToUndefined, z.string().optional())
});

export const roleSchema = z.object({
  role: z.enum(["USER", "OWNER", "ADMIN"])
});

export const userStatusSchema = z.object({
  isActive: z.boolean()
});

export const adminCreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  role: z.enum(["USER", "OWNER", "ADMIN"]).default("USER")
});

export const bookingStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

import { z } from "zod";

// Baby Profile schema for Supabase
export const insertBabyProfileSchema = z.object({
  userId: z.string(),
  babyName: z.string().min(1, "Baby name is required"),
  birthDate: z.string(), // Date as ISO string
  gender: z.string().min(1, "Gender is required"),
  photoUrl: z.string().nullable().optional(),
  bloodGroup: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const babyProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  babyName: z.string(),
  birthDate: z.string(),
  gender: z.string(),
  photoUrl: z.string().nullable(),
  bloodGroup: z.string().nullable(),
  contactNumber: z.string().nullable(),
});

export type InsertBabyProfile = z.infer<typeof insertBabyProfileSchema>;
export type BabyProfile = z.infer<typeof babyProfileSchema>;

// Vaccine schema for Supabase
export const insertVaccineSchema = z.object({
  userId: z.string(),
  vaccineName: z.string().min(1, "Vaccine name is required"),
  dueDate: z.string(), // Date as ISO string
  status: z.string().min(1, "Status is required"),
});

export const vaccineSchema = z.object({
  id: z.string(),
  userId: z.string(),
  vaccineName: z.string(),
  dueDate: z.string(),
  status: z.string(),
});

export type InsertVaccine = z.infer<typeof insertVaccineSchema>;
export type Vaccine = z.infer<typeof vaccineSchema>;

// Growth Record schema for Supabase
export const insertGrowthRecordSchema = z.object({
  userId: z.string(),
  date: z.string(), // Date as ISO string
  height: z.number().int().positive(),
  weight: z.number().int().positive(),
});

export const growthRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  height: z.number(),
  weight: z.number(),
});

export type InsertGrowthRecord = z.infer<typeof insertGrowthRecordSchema>;
export type GrowthRecord = z.infer<typeof growthRecordSchema>;

// Chat Message schema for Supabase
export const insertChatMessageSchema = z.object({
  userId: z.string(),
  role: z.string().min(1, "Role is required"),
  content: z.string().min(1, "Content is required"),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.string(),
  content: z.string(),
  timestamp: z.string(), // ISO string from Supabase
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Feedback schema for Supabase
export const insertFeedbackSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  rating: z.number().min(1).max(5),
  message: z.string().min(1, "Message is required"),
});

export const feedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  rating: z.number(),
  message: z.string(),
  createdAt: z.string(),
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
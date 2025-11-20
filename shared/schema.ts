import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const babyProfiles = pgTable("baby_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  babyName: text("baby_name").notNull(),
  birthDate: date("birth_date").notNull(),
  gender: text("gender").notNull(),
  photoUrl: text("photo_url"),
});

export const insertBabyProfileSchema = createInsertSchema(babyProfiles).omit({
  id: true,
});

export type InsertBabyProfile = z.infer<typeof insertBabyProfileSchema>;
export type BabyProfile = typeof babyProfiles.$inferSelect;

export const vaccines = pgTable("vaccines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  vaccineName: text("vaccine_name").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull(),
});

export const insertVaccineSchema = createInsertSchema(vaccines).omit({
  id: true,
});

export type InsertVaccine = z.infer<typeof insertVaccineSchema>;
export type Vaccine = typeof vaccines.$inferSelect;

export const growthRecords = pgTable("growth_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: date("date").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
});

export const insertGrowthRecordSchema = createInsertSchema(growthRecords).omit({
  id: true,
});

export type InsertGrowthRecord = z.infer<typeof insertGrowthRecordSchema>;
export type GrowthRecord = typeof growthRecords.$inferSelect;

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

import {
  type User,
  type InsertUser,
  type BabyProfile,
  type InsertBabyProfile,
  type Vaccine,
  type InsertVaccine,
  type GrowthRecord,
  type InsertGrowthRecord,
  type ChatMessage,
  type InsertChatMessage,
  users,
  babyProfiles,
  vaccines,
  growthRecords,
  chatMessages,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getBabyProfile(userId: string): Promise<BabyProfile | undefined>;
  createBabyProfile(profile: InsertBabyProfile): Promise<BabyProfile>;
  updateBabyProfile(userId: string, profile: Partial<BabyProfile>): Promise<BabyProfile>;

  getVaccines(userId: string): Promise<Vaccine[]>;
  getVaccine(id: string): Promise<Vaccine | undefined>;
  createVaccine(vaccine: InsertVaccine): Promise<Vaccine>;
  updateVaccine(id: string, vaccine: Partial<Vaccine>): Promise<Vaccine>;
  deleteVaccine(id: string, userId: string): Promise<void>;

  getGrowthRecords(userId: string): Promise<GrowthRecord[]>;
  createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord>;
  updateGrowthRecord(id: string, record: Partial<GrowthRecord>): Promise<GrowthRecord>;
  deleteGrowthRecord(id: string, userId: string): Promise<void>;

  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private babyProfiles: Map<string, BabyProfile>;
  private vaccines: Map<string, Vaccine>;
  private growthRecords: Map<string, GrowthRecord>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.babyProfiles = new Map();
    this.vaccines = new Map();
    this.growthRecords = new Map();
    this.chatMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBabyProfile(userId: string): Promise<BabyProfile | undefined> {
    return Array.from(this.babyProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createBabyProfile(insertProfile: InsertBabyProfile): Promise<BabyProfile> {
    const id = randomUUID();
    const profile: BabyProfile = { ...insertProfile, id };
    this.babyProfiles.set(id, profile);
    return profile;
  }

  async updateBabyProfile(
    userId: string,
    updates: Partial<BabyProfile>
  ): Promise<BabyProfile> {
    const existing = await this.getBabyProfile(userId);
    if (!existing) {
      throw new Error("Profile not found");
    }
    const updated = { ...existing, ...updates };
    this.babyProfiles.set(existing.id, updated);
    return updated;
  }

  async getVaccines(userId: string): Promise<Vaccine[]> {
    return Array.from(this.vaccines.values()).filter(
      (vaccine) => vaccine.userId === userId
    );
  }

  async getVaccine(id: string): Promise<Vaccine | undefined> {
    return this.vaccines.get(id);
  }

  async createVaccine(insertVaccine: InsertVaccine): Promise<Vaccine> {
    const id = randomUUID();
    const vaccine: Vaccine = { ...insertVaccine, id };
    this.vaccines.set(id, vaccine);
    return vaccine;
  }

  async updateVaccine(id: string, updates: Partial<Vaccine>): Promise<Vaccine> {
    const existing = this.vaccines.get(id);
    if (!existing) {
      throw new Error("Vaccine not found");
    }
    const updated = { ...existing, ...updates };
    this.vaccines.set(id, updated);
    return updated;
  }

  async deleteVaccine(id: string, userId: string): Promise<void> {
    this.vaccines.delete(id);
  }

  async getGrowthRecords(userId: string): Promise<GrowthRecord[]> {
    return Array.from(this.growthRecords.values()).filter(
      (record) => record.userId === userId
    );
  }

  async createGrowthRecord(insertRecord: InsertGrowthRecord): Promise<GrowthRecord> {
    const id = randomUUID();
    const record: GrowthRecord = { ...insertRecord, id };
    this.growthRecords.set(id, record);
    return record;
  }

  async updateGrowthRecord(id: string, updates: Partial<GrowthRecord>): Promise<GrowthRecord> {
    const existing = this.growthRecords.get(id);
    if (!existing) {
      throw new Error("Growth record not found");
    }
    const updated = { ...existing, ...updates };
    this.growthRecords.set(id, updated);
    return updated;
  }

  async deleteGrowthRecord(id: string, userId: string): Promise<void> {
    this.growthRecords.delete(id);
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getBabyProfile(userId: string): Promise<BabyProfile | undefined> {
    const [profile] = await db.select().from(babyProfiles).where(eq(babyProfiles.userId, userId));
    return profile || undefined;
  }

  async createBabyProfile(insertProfile: InsertBabyProfile): Promise<BabyProfile> {
    const [profile] = await db.insert(babyProfiles).values(insertProfile).returning();
    return profile;
  }

  async updateBabyProfile(userId: string, updates: Partial<BabyProfile>): Promise<BabyProfile> {
    const [updated] = await db
      .update(babyProfiles)
      .set(updates)
      .where(eq(babyProfiles.userId, userId))
      .returning();
    if (!updated) {
      throw new Error("Profile not found");
    }
    return updated;
  }

  async getVaccines(userId: string): Promise<Vaccine[]> {
    return await db.select().from(vaccines).where(eq(vaccines.userId, userId));
  }

  async getVaccine(id: string): Promise<Vaccine | undefined> {
    const [vaccine] = await db.select().from(vaccines).where(eq(vaccines.id, id));
    return vaccine || undefined;
  }

  async createVaccine(insertVaccine: InsertVaccine): Promise<Vaccine> {
    const [vaccine] = await db.insert(vaccines).values(insertVaccine).returning();
    return vaccine;
  }

  async updateVaccine(id: string, updates: Partial<Vaccine>): Promise<Vaccine> {
    if (!updates.userId) {
      throw new Error("userId is required for security");
    }
    const [updated] = await db
      .update(vaccines)
      .set(updates)
      .where(and(eq(vaccines.id, id), eq(vaccines.userId, updates.userId)))
      .returning();
    if (!updated) {
      throw new Error("Vaccine not found or unauthorized");
    }
    return updated;
  }

  async deleteVaccine(id: string, userId: string): Promise<void> {
    const result = await db
      .delete(vaccines)
      .where(and(eq(vaccines.id, id), eq(vaccines.userId, userId)))
      .returning();
    if (!result.length) {
      throw new Error("Vaccine not found or unauthorized");
    }
  }

  async getGrowthRecords(userId: string): Promise<GrowthRecord[]> {
    return await db.select().from(growthRecords).where(eq(growthRecords.userId, userId));
  }

  async createGrowthRecord(insertRecord: InsertGrowthRecord): Promise<GrowthRecord> {
    const [record] = await db.insert(growthRecords).values(insertRecord).returning();
    return record;
  }

  async updateGrowthRecord(id: string, updates: Partial<GrowthRecord>): Promise<GrowthRecord> {
    if (!updates.userId) {
      throw new Error("userId is required for security");
    }
    const [updated] = await db
      .update(growthRecords)
      .set(updates)
      .where(and(eq(growthRecords.id, id), eq(growthRecords.userId, updates.userId)))
      .returning();
    if (!updated) {
      throw new Error("Growth record not found or unauthorized");
    }
    return updated;
  }

  async deleteGrowthRecord(id: string, userId: string): Promise<void> {
    const result = await db
      .delete(growthRecords)
      .where(and(eq(growthRecords.id, id), eq(growthRecords.userId, userId)))
      .returning();
    if (!result.length) {
      throw new Error("Growth record not found or unauthorized");
    }
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();

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
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  deleteVaccine(id: string): Promise<void>;

  getGrowthRecords(userId: string): Promise<GrowthRecord[]>;
  createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord>;
  deleteGrowthRecord(id: string): Promise<void>;

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

  async deleteVaccine(id: string): Promise<void> {
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

  async deleteGrowthRecord(id: string): Promise<void> {
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

export const storage = new MemStorage();

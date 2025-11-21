import {
  type BabyProfile,
  type InsertBabyProfile,
  type Vaccine,
  type InsertVaccine,
  type GrowthRecord,
  type InsertGrowthRecord,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { supabase } from "./db";

export interface IStorage {
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
  private babyProfiles: Map<string, BabyProfile>;
  private vaccines: Map<string, Vaccine>;
  private growthRecords: Map<string, GrowthRecord>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.babyProfiles = new Map();
    this.vaccines = new Map();
    this.growthRecords = new Map();
    this.chatMessages = new Map();
  }

  async getBabyProfile(userId: string): Promise<BabyProfile | undefined> {
    return Array.from(this.babyProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createBabyProfile(insertProfile: InsertBabyProfile): Promise<BabyProfile> {
    // Generate a random ID (in real implementation, Supabase would generate this)
    const id = Math.random().toString(36).substring(2, 15);
    const profile: BabyProfile = { 
      ...insertProfile, 
      id,
      photoUrl: insertProfile.photoUrl ?? null
    };
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
    // Generate a random ID (in real implementation, Supabase would generate this)
    const id = Math.random().toString(36).substring(2, 15);
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
    // Generate a random ID (in real implementation, Supabase would generate this)
    const id = Math.random().toString(36).substring(2, 15);
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
    // Generate a random ID (in real implementation, Supabase would generate this)
    const id = Math.random().toString(36).substring(2, 15);
    const message: any = {
      ...insertMessage,
      id,
      timestamp: new Date().toISOString(),
    };
    this.chatMessages.set(id, message);
    return message as ChatMessage;
  }
}

export class DatabaseStorage implements IStorage {
  async getBabyProfile(userId: string): Promise<BabyProfile | undefined> {
    const { data, error } = await supabase
      .from('baby_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching baby profile:', error);
      return undefined;
    }
    
    if (!data) return undefined;
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      babyName: data.baby_name,
      birthDate: data.birth_date,
      gender: data.gender,
      photoUrl: data.photo_url,
    };
  }

  async createBabyProfile(insertProfile: InsertBabyProfile): Promise<BabyProfile> {
    // Map camelCase to snake_case for database
    const dbProfile = {
      user_id: insertProfile.userId,
      baby_name: insertProfile.babyName,
      birth_date: insertProfile.birthDate,
      gender: insertProfile.gender,
      photo_url: insertProfile.photoUrl || null,
    };

    const { data, error } = await supabase
      .from('baby_profiles')
      .insert(dbProfile)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating baby profile: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      babyName: data.baby_name,
      birthDate: data.birth_date,
      gender: data.gender,
      photoUrl: data.photo_url,
    };
  }

  async updateBabyProfile(userId: string, updates: Partial<BabyProfile>): Promise<BabyProfile> {
    // Map camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.babyName !== undefined) dbUpdates.baby_name = updates.babyName;
    if (updates.birthDate !== undefined) dbUpdates.birth_date = updates.birthDate;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;

    const { data, error } = await supabase
      .from('baby_profiles')
      .update(dbUpdates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating baby profile: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Profile not found");
    }

    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      babyName: data.baby_name,
      birthDate: data.birth_date,
      gender: data.gender,
      photoUrl: data.photo_url,
    };
  }

  async getVaccines(userId: string): Promise<Vaccine[]> {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching vaccines: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return data.map(v => ({
      id: v.id,
      userId: v.user_id,
      vaccineName: v.vaccine_name,
      dueDate: v.due_date,
      status: v.status,
    }));
  }

  async getVaccine(id: string): Promise<Vaccine | undefined> {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching vaccine:', error);
      return undefined;
    }
    
    if (!data) return undefined;
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      vaccineName: data.vaccine_name,
      dueDate: data.due_date,
      status: data.status,
    };
  }

  async createVaccine(insertVaccine: InsertVaccine): Promise<Vaccine> {
    // Map camelCase to snake_case for database
    const dbVaccine = {
      user_id: insertVaccine.userId,
      vaccine_name: insertVaccine.vaccineName,
      due_date: insertVaccine.dueDate,
      status: insertVaccine.status,
    };

    const { data, error } = await supabase
      .from('vaccines')
      .insert(dbVaccine)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating vaccine: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      vaccineName: data.vaccine_name,
      dueDate: data.due_date,
      status: data.status,
    };
  }

  async updateVaccine(id: string, updates: Partial<Vaccine>): Promise<Vaccine> {
    if (!updates.userId) {
      throw new Error("userId is required for security");
    }
    
    // Map camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.vaccineName !== undefined) dbUpdates.vaccine_name = updates.vaccineName;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { data, error } = await supabase
      .from('vaccines')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', updates.userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating vaccine: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Vaccine not found or unauthorized");
    }
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      vaccineName: data.vaccine_name,
      dueDate: data.due_date,
      status: data.status,
    };
  }

  async deleteVaccine(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('vaccines')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error deleting vaccine: ${error.message}`);
    }
  }

  async getGrowthRecords(userId: string): Promise<GrowthRecord[]> {
    const { data, error } = await supabase
      .from('growth_records')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching growth records: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return data.map(r => ({
      id: r.id,
      userId: r.user_id,
      date: r.date,
      height: r.height,
      weight: r.weight,
    }));
  }

  async createGrowthRecord(insertRecord: InsertGrowthRecord): Promise<GrowthRecord> {
    // Map camelCase to snake_case for database
    const dbRecord = {
      user_id: insertRecord.userId,
      date: insertRecord.date,
      height: insertRecord.height,
      weight: insertRecord.weight,
    };

    const { data, error } = await supabase
      .from('growth_records')
      .insert(dbRecord)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating growth record: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      height: data.height,
      weight: data.weight,
    };
  }

  async updateGrowthRecord(id: string, updates: Partial<GrowthRecord>): Promise<GrowthRecord> {
    if (!updates.userId) {
      throw new Error("userId is required for security");
    }
    
    // Map camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.height !== undefined) dbUpdates.height = updates.height;
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;

    const { data, error } = await supabase
      .from('growth_records')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', updates.userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating growth record: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Growth record not found or unauthorized");
    }
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      height: data.height,
      weight: data.weight,
    };
  }

  async deleteGrowthRecord(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('growth_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error deleting growth record: ${error.message}`);
    }
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Error fetching chat messages: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return data.map(m => ({
      id: m.id,
      userId: m.user_id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    }));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    // Map camelCase to snake_case for database
    const dbMessage = {
      user_id: insertMessage.userId,
      role: insertMessage.role,
      content: insertMessage.content,
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(dbMessage)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating chat message: ${error.message}`);
    }
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      role: data.role,
      content: data.content,
      timestamp: data.timestamp,
    };
  }
}

// Export the Supabase storage implementation
export const storage = new DatabaseStorage();
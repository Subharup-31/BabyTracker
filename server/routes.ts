import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { supabase, createUserSupabaseClient } from "./db";
import { storage } from "./storage";
import { insertBabyProfileSchema, insertVaccineSchema, insertGrowthRecordSchema, insertFeedbackSchema } from "@shared/schema";
import { getPediatricResponse } from "./gemini";
import { registerAdminRoutes } from "./admin-routes";

// Extend Express Request type to include Supabase user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
      userToken?: string;
    }
  }
}

// Middleware to verify Supabase auth token
const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
  
  req.userId = user.id;
  req.user = user;
  req.userToken = token; // Store token for RLS
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Supabase Auth handles all authentication



  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({ 
        user: data.user,
        session: data.session,
        message: "Signup successful. Please check your email for verification."
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ message: error.message });
      }

      res.json({ 
        user: data.user,
        session: data.session
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ 
      userId: req.userId,
      user: req.user
    });
  });

  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await supabase.auth.signOut();
    }
    
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/baby-profile", requireAuth, async (req, res) => {
    try {
      const userClient = createUserSupabaseClient(req.userToken!);
      const { data, error } = await userClient
        .from('baby_profiles')
        .select('*')
        .eq('user_id', req.userId!)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Profile not found" });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      // Map snake_case to camelCase
      const profile = {
        id: data.id,
        userId: data.user_id,
        babyName: data.baby_name,
        birthDate: data.birth_date,
        gender: data.gender,
        photoUrl: data.photo_url,
        bloodGroup: data.blood_group,
        contactNumber: data.contact_number,
      };
      
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/baby-profile", requireAuth, async (req, res) => {
    try {
      const data = insertBabyProfileSchema.parse({
        ...req.body,
        userId: req.userId!,
      });

      const userClient = createUserSupabaseClient(req.userToken!);
      
      // Check if profile already exists
      const { data: existing } = await userClient
        .from('baby_profiles')
        .select('id')
        .eq('user_id', req.userId!)
        .single();

      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      // Create profile with mapped fields
      const dbProfile = {
        user_id: data.userId,
        baby_name: data.babyName,
        birth_date: data.birthDate,
        gender: data.gender,
        photo_url: data.photoUrl || null,
        blood_group: data.bloodGroup || null,
        contact_number: data.contactNumber || null,
      };

      console.log('Attempting to insert profile:', dbProfile);

      const { data: created, error } = await userClient
        .from('baby_profiles')
        .insert(dbProfile)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Error creating baby profile: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }
      
      // Map snake_case to camelCase
      const profile = {
        id: created.id,
        userId: created.user_id,
        babyName: created.baby_name,
        birthDate: created.birth_date,
        gender: created.gender,
        photoUrl: created.photo_url,
        bloodGroup: created.blood_group,
        contactNumber: created.contact_number,
      };

      res.json(profile);
    } catch (error: any) {
      console.error('Profile creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/baby-profile", requireAuth, async (req, res) => {
    try {
      const userClient = createUserSupabaseClient(req.userToken!);
      
      // Map camelCase to snake_case for database
      const dbUpdates: any = {};
      if (req.body.babyName !== undefined) dbUpdates.baby_name = req.body.babyName;
      if (req.body.birthDate !== undefined) dbUpdates.birth_date = req.body.birthDate;
      if (req.body.gender !== undefined) dbUpdates.gender = req.body.gender;
      if (req.body.photoUrl !== undefined) dbUpdates.photo_url = req.body.photoUrl;
      if (req.body.bloodGroup !== undefined) dbUpdates.blood_group = req.body.bloodGroup;
      if (req.body.contactNumber !== undefined) dbUpdates.contact_number = req.body.contactNumber;

      const { data, error } = await userClient
        .from('baby_profiles')
        .update(dbUpdates)
        .eq('user_id', req.userId!)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating baby profile: ${error.message}`);
      }
      
      if (!data) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Map snake_case to camelCase
      const profile = {
        id: data.id,
        userId: data.user_id,
        babyName: data.baby_name,
        birthDate: data.birth_date,
        gender: data.gender,
        photoUrl: data.photo_url,
        bloodGroup: data.blood_group,
        contactNumber: data.contact_number,
      };

      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/vaccines", requireAuth, async (req, res) => {
    try {
      const vaccines = await storage.getVaccines(req.userId!);
      res.json(vaccines);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/vaccines", requireAuth, async (req, res) => {
    try {
      const data = insertVaccineSchema.parse({
        ...req.body,
        userId: req.userId!,
      });

      const vaccine = await storage.createVaccine(data);
      res.json(vaccine);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/vaccines/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const vaccine = await storage.updateVaccine(id, {
        ...req.body,
        userId: req.userId!,
      });
      res.json(vaccine);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  app.delete("/api/vaccines/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteVaccine(id, req.userId!);
      res.json({ message: "Deleted" });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  app.get("/api/growth-records", requireAuth, async (req, res) => {
    try {
      const records = await storage.getGrowthRecords(req.userId!);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/growth-records", requireAuth, async (req, res) => {
    try {
      const data = insertGrowthRecordSchema.parse({
        ...req.body,
        userId: req.userId!,
      });

      const record = await storage.createGrowthRecord(data);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/growth-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const record = await storage.updateGrowthRecord(id, {
        ...req.body,
        userId: req.userId!,
      });
      res.json(record);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  app.delete("/api/growth-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGrowthRecord(id, req.userId!);
      res.json({ message: "Deleted" });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  app.get("/api/chat/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.userId!);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/send", requireAuth, async (req, res) => {
    try {
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ message: "Content is required" });
      }

      const userMessage = await storage.createChatMessage({
        userId: req.userId!,
        role: "user",
        content,
      });

      const aiResponse = await getPediatricResponse(content);

      const aiMessage = await storage.createChatMessage({
        userId: req.userId!,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ userMessage, aiMessage });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Feedback routes
  app.post("/api/feedback", requireAuth, async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/feedback", requireAuth, async (req, res) => {
    try {
      const feedbacks = await storage.getUserFeedbacks(req.userId!);
      res.json(feedbacks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Test endpoint to manually trigger vaccine reminder check
  app.post("/api/test/vaccine-reminders", requireAuth, async (req, res) => {
    try {
      const { checkAndSendVaccineReminders } = await import("./vaccine-reminder");
      await checkAndSendVaccineReminders();
      res.json({ message: "Vaccine reminder check completed. Check server logs for details." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Register admin routes
  registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}

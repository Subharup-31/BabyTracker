import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import { storage } from "./storage";
import { insertUserSchema, insertBabyProfileSchema, insertVaccineSchema, insertGrowthRecordSchema } from "@shared/schema";
import { getPediatricResponse } from "./gemini";
import bcrypt from "bcryptjs";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const MemoryStore = createMemoryStore(session);
  
  app.use(
    session({
      store: new MemoryStore({
        checkPeriod: 86400000,
      }),
      secret: process.env.SESSION_SECRET || "baby-track-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ userId: req.session.userId });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/baby-profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getBabyProfile(req.session.userId!);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/baby-profile", requireAuth, async (req, res) => {
    try {
      const data = insertBabyProfileSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const existing = await storage.getBabyProfile(req.session.userId!);
      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const profile = await storage.createBabyProfile(data);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/baby-profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.updateBabyProfile(req.session.userId!, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/vaccines", requireAuth, async (req, res) => {
    try {
      const vaccines = await storage.getVaccines(req.session.userId!);
      res.json(vaccines);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/vaccines", requireAuth, async (req, res) => {
    try {
      const data = insertVaccineSchema.parse({
        ...req.body,
        userId: req.session.userId,
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
      const existing = await storage.getVaccine(id);

      if (!existing || existing.userId !== req.session.userId) {
        return res.status(404).json({ message: "Vaccine not found" });
      }

      const vaccine = await storage.updateVaccine(id, req.body);
      res.json(vaccine);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/vaccines/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getVaccine(id);

      if (!existing || existing.userId !== req.session.userId) {
        return res.status(404).json({ message: "Vaccine not found" });
      }

      await storage.deleteVaccine(id);
      res.json({ message: "Deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/growth-records", requireAuth, async (req, res) => {
    try {
      const records = await storage.getGrowthRecords(req.session.userId!);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/growth-records", requireAuth, async (req, res) => {
    try {
      const data = insertGrowthRecordSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const record = await storage.createGrowthRecord(data);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/growth-records/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGrowthRecord(id);
      res.json({ message: "Deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.session.userId!);
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
        userId: req.session.userId!,
        role: "user",
        content,
      });

      const aiResponse = await getPediatricResponse(content);

      const aiMessage = await storage.createChatMessage({
        userId: req.session.userId!,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ userMessage, aiMessage });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

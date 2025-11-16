import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema, insertCampusEventSchema, insertPromotionSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Transaction routes - Protected
  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId,
      });
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
      }
    }
  });

  app.delete("/api/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const transaction = await storage.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      if (transaction.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      await storage.deleteTransaction(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // Budget routes - Protected
  app.get("/api/budgets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const budgets = await storage.getBudgets(userId);
      res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBudgetSchema.parse({
        ...req.body,
        userId,
      });
      const budget = await storage.createBudget(validatedData);
      res.status(201).json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid budget data", details: error.errors });
      } else {
        console.error("Error creating budget:", error);
        res.status(500).json({ error: "Failed to create budget" });
      }
    }
  });

  // Campus Events routes - Protected
  app.get("/api/campus-events", isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getCampusEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching campus events:", error);
      res.status(500).json({ error: "Failed to fetch campus events" });
    }
  });

  app.get("/api/campus-events/upcoming", isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ error: "Failed to fetch upcoming events" });
    }
  });

  app.post("/api/campus-events", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCampusEventSchema.parse(req.body);
      const event = await storage.createCampusEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid event data", details: error.errors });
      } else {
        console.error("Error creating campus event:", error);
        res.status(500).json({ error: "Failed to create campus event" });
      }
    }
  });

  // AI-only endpoint for external chatbot backend to fetch campus events
  // Secured with AI_API_KEY environment variable
  app.get("/api/ai/campus-events", async (req, res) => {
    try {
      // Check for AI_API_KEY in Authorization header
      const authHeader = req.headers.authorization;
      const expectedKey = process.env.AI_API_KEY;
      
      if (!expectedKey) {
        console.error("AI_API_KEY not configured");
        return res.status(500).json({ error: "Server configuration error" });
      }
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
      }
      
      const providedKey = authHeader.substring(7); // Remove "Bearer " prefix
      if (providedKey !== expectedKey) {
        return res.status(401).json({ error: "Invalid API key" });
      }
      
      // Parse query parameters
      const limit = parseInt(req.query.limit as string) || 10;
      const daysAhead = parseInt(req.query.days_ahead as string) || 30;
      
      // Get upcoming events
      const allUpcomingEvents = await storage.getUpcomingEvents();
      
      // Filter by days_ahead
      const now = new Date();
      const maxDate = new Date(now);
      maxDate.setDate(maxDate.getDate() + daysAhead);
      
      const filteredEvents = allUpcomingEvents
        .filter(event => new Date(event.date) <= maxDate)
        .slice(0, limit);
      
      // Return events with cleaned up data
      const eventsForAI = filteredEvents.map(event => ({
        id: event.id,
        name: event.name,
        category: event.category,
        date: event.date,
        location: event.location,
        description: event.description,
        organizer: event.organizer,
        isFree: event.isFree === 1,
      }));
      
      res.json({
        events: eventsForAI,
        count: eventsForAI.length,
        query: {
          limit,
          days_ahead: daysAhead,
        }
      });
    } catch (error) {
      console.error("Error fetching AI campus events:", error);
      res.status(500).json({ error: "Failed to fetch campus events" });
    }
  });

  // Promotion routes - Protected
  app.get("/api/promotions", isAuthenticated, async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  app.get("/api/promotions/saved", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedPromotions = await storage.getSavedPromotions(userId);
      res.json(savedPromotions);
    } catch (error) {
      console.error("Error fetching saved promotions:", error);
      res.status(500).json({ error: "Failed to fetch saved promotions" });
    }
  });

  app.post("/api/promotions/:id/save", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const promotion = await storage.getPromotion(id);
      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      
      const savedPromotion = await storage.savePromotion(userId, id);
      res.status(201).json(savedPromotion);
    } catch (error) {
      console.error("Error saving promotion:", error);
      res.status(500).json({ error: "Failed to save promotion" });
    }
  });

  app.post("/api/promotions/:id/redeem", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const redeemedPromotion = await storage.redeemPromotion(userId, id);
      if (!redeemedPromotion) {
        return res.status(404).json({ error: "Saved promotion not found" });
      }
      
      res.json(redeemedPromotion);
    } catch (error) {
      console.error("Error redeeming promotion:", error);
      res.status(500).json({ error: "Failed to redeem promotion" });
    }
  });

  app.delete("/api/promotions/:id/unsave", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.unsavePromotion(userId, id);
      res.status(204).send();
    } catch (error) {
      console.error("Error unsaving promotion:", error);
      res.status(500).json({ error: "Failed to unsave promotion" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

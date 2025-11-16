import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema, insertCampusEventSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import OpenAI from "openai";

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

  // AI Chat endpoint - Protected
  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const { message, financial_context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `You are a friendly financial advisor for college students at Rutgers University-Newark. You help students manage their campus wallet, including meal plans, dining dollars, and campus card balances. 

Current student financial context:
- Meal Plan Balance: $${financial_context?.meal_plan_balance || 0}
- Dining Dollars: $${financial_context?.dining_dollars || 0}
- Campus Card Balance: $${financial_context?.campus_card_balance || 0}

Provide helpful, concise advice about budgeting, spending habits, and financial decisions. Keep responses friendly and under 3 sentences unless more detail is specifically requested.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      
      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error("Error in chat endpoint:", error);
      if (error.status === 401) {
        res.status(500).json({ error: "OpenAI API authentication failed" });
      } else {
        res.status(500).json({ error: "Failed to generate response" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

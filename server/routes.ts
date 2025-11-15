import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema, insertCampusEventSchema } from "@shared/schema";
import { z } from "zod";

const DEMO_USER_ID = "demo-user-001";

export async function registerRoutes(app: Express): Promise<Server> {
  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(DEMO_USER_ID);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
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

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await storage.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      if (transaction.userId !== DEMO_USER_ID) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      await storage.deleteTransaction(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // Budget routes
  app.get("/api/budgets", async (req, res) => {
    try {
      const budgets = await storage.getBudgets(DEMO_USER_ID);
      res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const validatedData = insertBudgetSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
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

  // Campus Events routes
  app.get("/api/campus-events", async (req, res) => {
    try {
      const events = await storage.getCampusEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching campus events:", error);
      res.status(500).json({ error: "Failed to fetch campus events" });
    }
  });

  app.get("/api/campus-events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ error: "Failed to fetch upcoming events" });
    }
  });

  app.post("/api/campus-events", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}

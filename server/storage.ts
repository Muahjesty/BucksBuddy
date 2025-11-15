import { 
  type User, 
  type InsertUser,
  type Transaction,
  type InsertTransaction,
  type Budget,
  type InsertBudget,
  type CampusEvent,
  type InsertCampusEvent,
  users,
  transactions,
  budgets,
  campusEvents
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, gte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  
  // Budget methods
  getBudgets(userId: string): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: string): Promise<void>;
  
  // Campus Events methods
  getCampusEvents(): Promise<CampusEvent[]>;
  getUpcomingEvents(): Promise<CampusEvent[]>;
  getCampusEvent(id: string): Promise<CampusEvent | undefined>;
  createCampusEvent(event: InsertCampusEvent): Promise<CampusEvent>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Transaction methods
  async getTransactions(userId: string, limit: number = 100): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return result[0];
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async deleteTransaction(id: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  // Budget methods
  async getBudgets(userId: string): Promise<Budget[]> {
    return await db.select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
  }

  async getBudget(id: string): Promise<Budget | undefined> {
    const result = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);
    return result[0];
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const result = await db.insert(budgets).values(budget).returning();
    return result[0];
  }

  async updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget | undefined> {
    const result = await db.update(budgets)
      .set(budget)
      .where(eq(budgets.id, id))
      .returning();
    return result[0];
  }

  async deleteBudget(id: string): Promise<void> {
    await db.delete(budgets).where(eq(budgets.id, id));
  }

  // Campus Events methods
  async getCampusEvents(): Promise<CampusEvent[]> {
    return await db.select().from(campusEvents).orderBy(campusEvents.date);
  }

  async getUpcomingEvents(): Promise<CampusEvent[]> {
    const now = new Date();
    return await db.select()
      .from(campusEvents)
      .where(gte(campusEvents.date, now))
      .orderBy(campusEvents.date);
  }

  async getCampusEvent(id: string): Promise<CampusEvent | undefined> {
    const result = await db.select().from(campusEvents).where(eq(campusEvents.id, id)).limit(1);
    return result[0];
  }

  async createCampusEvent(event: InsertCampusEvent): Promise<CampusEvent> {
    const result = await db.insert(campusEvents).values(event).returning();
    return result[0];
  }
}

export const storage = new DbStorage();

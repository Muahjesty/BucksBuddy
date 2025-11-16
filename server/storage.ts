import { 
  type User, 
  type UpsertUser,
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
import { eq, desc, gte, and, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User methods - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  // User methods - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
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
    const userBudgets = await db.select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
    
    // Calculate spent amount for each budget based on transactions
    const budgetsWithSpent = await Promise.all(
      userBudgets.map(async (budget: Budget) => {
        const spent = await this.calculateBudgetSpent(userId, budget.category, budget.period);
        return {
          ...budget,
          spent: spent.toFixed(2),
        };
      })
    );
    
    return budgetsWithSpent;
  }
  
  private async calculateBudgetSpent(
    userId: string,
    category: string,
    period: string
  ): Promise<number> {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now; // Upper bound is current time
    
    if (period === "Weekly") {
      // Get start of current week (Sunday)
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Monthly - get start of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
    }
    
    // Sum transactions in this category within the period (startDate <= date <= now)
    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.category, category),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );
    
    return Number(result[0]?.total || 0);
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

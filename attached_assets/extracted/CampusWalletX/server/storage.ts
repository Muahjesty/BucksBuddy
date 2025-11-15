import { 
  users, balances, transactions, budgets, rewards, campusEvents,
  type User, type InsertUser,
  type Balance,
  type Transaction, type InsertTransaction,
  type Budget, type InsertBudget,
  type Reward,
  type CampusEvent, type InsertCampusEvent
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Balance operations
  getBalance(userId: string): Promise<Balance | undefined>;
  createBalance(userId: string): Promise<Balance>;
  updateBalance(userId: string, updates: Partial<Balance>): Promise<Balance>;

  // Transaction operations
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]>;
  getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Budget operations
  getBudgets(userId: string): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, updates: Partial<Budget>): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;

  // Reward operations
  getRewards(userId: string): Promise<Reward | undefined>;
  createRewards(userId: string): Promise<Reward>;
  updateRewards(userId: string, updates: Partial<Reward>): Promise<Reward>;

  // Campus Events operations
  getCampusEvents(limit?: number): Promise<CampusEvent[]>;
  getCampusEventsByCategory(category: string): Promise<CampusEvent[]>;
  createCampusEvent(event: InsertCampusEvent): Promise<CampusEvent>;
}

export class DatabaseStorage implements IStorage {
  db = pool;
  // User operations
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

  // Balance operations
  async getBalance(userId: string): Promise<Balance | undefined> {
    const [balance] = await db.select().from(balances).where(eq(balances.userId, userId));
    return balance || undefined;
  }

  async createBalance(userId: string): Promise<Balance> {
    const [balance] = await db.insert(balances).values({
      userId,
      mealPlanBalance: 14,
      diningDollars: "300.00",
      campusCardBalance: "150.00"
    }).returning();
    return balance;
  }

  async updateBalance(userId: string, updates: Partial<Balance>): Promise<Balance> {
    const [balance] = await db
      .update(balances)
      .set(updates)
      .where(eq(balances.userId, userId))
      .returning();
    return balance;
  }

  // Transaction operations
  async getTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.category, category)))
      .orderBy(desc(transactions.date));
  }

  async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  // Budget operations
  async getBudgets(userId: string): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.userId, userId));
  }

  async getBudget(id: string): Promise<Budget | undefined> {
    const [budget] = await db.select().from(budgets).where(eq(budgets.id, id));
    return budget || undefined;
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const [newBudget] = await db.insert(budgets).values(budget).returning();
    return newBudget;
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    const [budget] = await db
      .update(budgets)
      .set(updates)
      .where(eq(budgets.id, id))
      .returning();
    return budget;
  }

  async deleteBudget(id: string): Promise<void> {
    await db.delete(budgets).where(eq(budgets.id, id));
  }

  // Reward operations
  async getRewards(userId: string): Promise<Reward | undefined> {
    const [reward] = await db.select().from(rewards).where(eq(rewards.userId, userId));
    return reward || undefined;
  }

  async createRewards(userId: string): Promise<Reward> {
    const [reward] = await db.insert(rewards).values({ userId }).returning();
    return reward;
  }

  async updateRewards(userId: string, updates: Partial<Reward>): Promise<Reward> {
    const [reward] = await db
      .update(rewards)
      .set(updates)
      .where(eq(rewards.userId, userId))
      .returning();
    return reward;
  }

  // Campus Events operations
  async getCampusEvents(limit: number = 20): Promise<CampusEvent[]> {
    return await db.select().from(campusEvents).orderBy(campusEvents.date).limit(limit);
  }

  async getCampusEventsByCategory(category: string): Promise<CampusEvent[]> {
    return await db
      .select()
      .from(campusEvents)
      .where(eq(campusEvents.category, category))
      .orderBy(campusEvents.date);
  }

  async createCampusEvent(event: InsertCampusEvent): Promise<CampusEvent> {
    const [newEvent] = await db.insert(campusEvents).values(event).returning();
    return newEvent;
  }
}

export const storage = new DatabaseStorage();

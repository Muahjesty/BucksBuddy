import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const balances = pgTable("balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  mealPlanBalance: integer("meal_plan_balance").notNull().default(0),
  diningDollars: decimal("dining_dollars", { precision: 10, scale: 2 }).notNull().default("0"),
  campusCardBalance: decimal("campus_card_balance", { precision: 10, scale: 2 }).notNull().default("0"),
});

export type Balance = typeof balances.$inferSelect;

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  merchant: text("merchant").notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  type: text("type").notNull(), // "debit" or "credit"
  paymentMethod: text("payment_method"), // "meal_plan", "dining_dollars", "campus_card"
  tapSessionId: varchar("tap_session_id"), // linked tap session if tap-and-pay
  terminalId: varchar("terminal_id"), // merchant terminal used for payment
  verificationCode: text("verification_code"), // optional verification code
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  date: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  limit: decimal("limit", { precision: 10, scale: 2 }).notNull(),
  spent: decimal("spent", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  spent: true,
});

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  points: integer("points").notNull().default(0),
  level: text("level").notNull().default("Bronze"),
  achievements: text("achievements").array().notNull().default(sql`ARRAY[]::text[]`),
});

export type Reward = typeof rewards.$inferSelect;

export const campusEvents = pgTable("campus_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"),
});

export const insertCampusEventSchema = createInsertSchema(campusEvents).omit({
  id: true,
});

export type InsertCampusEvent = z.infer<typeof insertCampusEventSchema>;
export type CampusEvent = typeof campusEvents.$inferSelect;

// Tap & Pay Sessions
export const tapSessions = pgTable("tap_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull().unique(), // signed one-time token
  balanceSource: text("balance_source").notNull(), // "meal_plan", "dining_dollars", "campus_card"
  amountCap: decimal("amount_cap", { precision: 10, scale: 2 }).notNull(), // max amount allowed
  status: text("status").notNull().default("pending"), // "pending", "authorized", "captured", "expired"
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTapSessionSchema = createInsertSchema(tapSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertTapSession = z.infer<typeof insertTapSessionSchema>;
export type TapSession = typeof tapSessions.$inferSelect;

// Merchant Terminals
export const merchantTerminals = pgTable("merchant_terminals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantName: text("merchant_name").notNull(),
  campusLocation: text("campus_location").notNull(),
  category: text("category").notNull(), // "dining", "bookstore", "laundry", etc.
  capabilities: text("capabilities").array().notNull().default(sql`ARRAY[]::text[]`), // "qr", "nfc", etc.
  apiKey: text("api_key").notNull().unique(), // for merchant terminal authentication
  lastHeartbeat: timestamp("last_heartbeat"),
  active: integer("active").notNull().default(1), // 1 = active, 0 = inactive
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMerchantTerminalSchema = createInsertSchema(merchantTerminals).omit({
  id: true,
  createdAt: true,
});

export type InsertMerchantTerminal = z.infer<typeof insertMerchantTerminalSchema>;
export type MerchantTerminal = typeof merchantTerminals.$inferSelect;

// Merchant Data Sources (for web scraping)
export const merchantSources = pgTable("merchant_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceType: text("source_type").notNull(), // "dining_menu", "merchant_hours", "pricing"
  scrapeInterval: integer("scrape_interval").notNull().default(60), // minutes
  lastScrapedAt: timestamp("last_scraped_at"),
  active: integer("active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMerchantSourceSchema = createInsertSchema(merchantSources).omit({
  id: true,
  createdAt: true,
});

export type InsertMerchantSource = z.infer<typeof insertMerchantSourceSchema>;
export type MerchantSource = typeof merchantSources.$inferSelect;

// Scraped Items (raw scraped data)
export const scrapedItems = pgTable("scraped_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceId: varchar("source_id").notNull(),
  merchantName: text("merchant_name"),
  itemName: text("item_name").notNull(),
  itemPrice: decimal("item_price", { precision: 10, scale: 2 }),
  itemCategory: text("item_category"),
  itemDescription: text("item_description"),
  availability: text("availability"), // "available", "sold_out", "limited"
  metadata: text("metadata"), // JSON string for additional data
  scrapedAt: timestamp("scraped_at").notNull().defaultNow(),
});

export const insertScrapedItemSchema = createInsertSchema(scrapedItems).omit({
  id: true,
  scrapedAt: true,
});

export type InsertScrapedItem = z.infer<typeof insertScrapedItemSchema>;
export type ScrapedItem = typeof scrapedItems.$inferSelect;

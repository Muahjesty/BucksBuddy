import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  major: text("major"),
  classYear: integer("class_year"),
  residenceType: text("residence_type"),
  interests: text("interests").array(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  merchant: text("merchant").notNull(),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  limit: decimal("limit", { precision: 10, scale: 2 }).notNull(),
  period: text("period").notNull(),
  spent: decimal("spent", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  achievements: text("achievements").array(),
});

export const campusEvents = pgTable("campus_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  organizer: text("organizer"),
  isFree: integer("is_free").notNull().default(1),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true });
export const insertCampusEventSchema = createInsertSchema(campusEvents).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertCampusEvent = z.infer<typeof insertCampusEventSchema>;
export type CampusEvent = typeof campusEvents.$inferSelect;

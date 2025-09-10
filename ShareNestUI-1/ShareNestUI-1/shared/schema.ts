import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  location: text("location"),
  profilePicture: text("profile_picture"),
  communityScore: integer("community_score").default(0),
  itemsDonated: integer("items_donated").default(0),
  itemsBorrowed: integer("items_borrowed").default(0),
  itemsRequested: integer("items_requested").default(0),
  co2Saved: decimal("co2_saved", { precision: 10, scale: 2 }).default("0"),
  moneySaved: decimal("money_saved", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(), // 'new', 'good', 'fair'
  images: text("images").array(),
  availability: text("availability").notNull(), // 'permanent', 'temporary', 'rental'
  location: text("location").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: text("status").default("available"), // 'available', 'borrowed', 'unavailable'
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  co2Impact: decimal("co2_impact", { precision: 8, scale: 3 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  urgency: text("urgency").notNull(), // 'low', 'medium', 'high'
  location: text("location").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: text("status").default("active"), // 'active', 'fulfilled', 'expired'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").references(() => items.id),
  requestId: varchar("request_id").references(() => requests.id),
  borrowerId: varchar("borrower_id").references(() => users.id).notNull(),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'borrow', 'donate', 'return'
  status: text("status").default("pending"), // 'pending', 'active', 'completed', 'cancelled'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  actualReturnDate: timestamp("actual_return_date"),
  co2Saved: decimal("co2_saved", { precision: 8, scale: 3 }).default("0"),
  moneySaved: decimal("money_saved", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const impactStats = pgTable("impact_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalItemsShared: integer("total_items_shared").default(0),
  totalCo2Saved: decimal("total_co2_saved", { precision: 12, scale: 3 }).default("0"),
  totalMoneySaved: decimal("total_money_saved", { precision: 12, scale: 2 }).default("0"),
  activeMembers: integer("active_members").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  name: true,
  location: true,
  profilePicture: true,
});

export const insertItemSchema = createInsertSchema(items).pick({
  title: true,
  description: true,
  category: true,
  condition: true,
  images: true,
  availability: true,
  location: true,
  estimatedValue: true,
});

export const insertRequestSchema = createInsertSchema(requests).pick({
  title: true,
  description: true,
  category: true,
  urgency: true,
  location: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  itemId: true,
  requestId: true,
  borrowerId: true,
  ownerId: true,
  type: true,
  startDate: true,
  endDate: true,
  co2Saved: true,
  moneySaved: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Request = typeof requests.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ImpactStats = typeof impactStats.$inferSelect;

// Categories enum for consistency
export const CATEGORIES = [
  "Electronics",
  "Furniture", 
  "Books & Media",
  "Clothing",
  "Sports & Recreation",
  "Kitchen & Dining",
  "Home & Garden",
  "Toys & Games"
] as const;

export const CONDITIONS = ["new", "good", "fair"] as const;
export const URGENCY_LEVELS = ["low", "medium", "high"] as const;
export const AVAILABILITY_TYPES = ["permanent", "temporary", "rental"] as const;

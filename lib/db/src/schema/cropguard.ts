import { boolean, integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cropguardUsersTable = pgTable("cropguard_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  role: text("role").notNull().default("farmer"),
  village: text("village").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cropguardFieldsTable = pgTable("cropguard_fields", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("demo-farmer-01"),
  name: text("name").notNull(),
  crop: text("crop").notNull(),
  acres: numeric("acres", { precision: 8, scale: 2 }).notNull(),
  village: text("village").notNull(),
  lastScanned: text("last_scanned").notNull().default("Not scanned yet"),
});

export const cropguardDetectionsTable = pgTable("cropguard_detections", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("demo-farmer-01"),
  fieldId: integer("field_id"),
  crop: text("crop").notNull(),
  disease: text("disease").notNull(),
  diseaseHindi: text("disease_hindi").notNull(),
  type: text("type").notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 4 }).notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  sampleId: text("sample_id"),
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cropguardCommunityPostsTable = pgTable("cropguard_community_posts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("demo-farmer-01"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  crop: text("crop").notNull(),
  author: text("author").notNull(),
  replies: integer("replies").notNull().default(0),
  expertAnswered: boolean("expert_answered").notNull().default(false),
  postedAt: text("posted_at").notNull(),
});

export const insertCropguardUserSchema = createInsertSchema(cropguardUsersTable).omit({ createdAt: true });
export const insertCropguardFieldSchema = createInsertSchema(cropguardFieldsTable).omit({ id: true });
export const insertCropguardDetectionSchema = createInsertSchema(cropguardDetectionsTable).omit({ id: true, detectedAt: true });
export const insertCropguardCommunityPostSchema = createInsertSchema(cropguardCommunityPostsTable).omit({ id: true });

export type InsertCropguardUser = z.infer<typeof insertCropguardUserSchema>;
export type InsertCropguardField = z.infer<typeof insertCropguardFieldSchema>;
export type InsertCropguardDetection = z.infer<typeof insertCropguardDetectionSchema>;
export type InsertCropguardCommunityPost = z.infer<typeof insertCropguardCommunityPostSchema>;
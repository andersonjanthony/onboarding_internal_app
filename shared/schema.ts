import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  industry: text("industry"),
  primaryContactName: text("primary_contact_name").notNull(),
  primaryContactEmail: text("primary_contact_email").notNull(),
  salesforceEdition: text("salesforce_edition"),
  numberOfUsers: text("number_of_users"),
  complianceRequirements: text("compliance_requirements").array(),
  servicePackage: text("service_package"),
  zohoContractId: text("zoho_contract_id"),
  zohoMeetingUrl: text("zoho_meeting_url"),
  currentStep: text("current_step").notNull().default("1"),
  contractSigned: boolean("contract_signed").notNull().default(false),
  systemDetailsComplete: boolean("system_details_complete").notNull().default(false),
  kickoffScheduled: boolean("kickoff_scheduled").notNull().default(false),
  resourcesAccessed: boolean("resources_accessed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectMilestones = pgTable("project_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  title: text("title").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // 'kickoff', 'review', 'delivery'
  completed: boolean("completed").notNull().default(false),
});

export const integrationStatus = pgTable("integration_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  slackConnected: boolean("slack_connected").notNull().default(false),
  zohoConnected: boolean("zoho_connected").notNull().default(false),
  n8nConnected: boolean("n8n_connected").notNull().default(false),
  slackWebhookUrl: text("slack_webhook_url"),
  n8nWebhookUrl: text("n8n_webhook_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertProjectMilestoneSchema = createInsertSchema(projectMilestones).omit({
  id: true,
});

export const insertIntegrationStatusSchema = createInsertSchema(integrationStatus).omit({
  id: true,
});

export const updateClientSchema = insertClientSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type InsertProjectMilestone = z.infer<typeof insertProjectMilestoneSchema>;
export type IntegrationStatus = typeof integrationStatus.$inferSelect;
export type InsertIntegrationStatus = z.infer<typeof insertIntegrationStatusSchema>;

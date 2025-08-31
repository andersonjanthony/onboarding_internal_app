import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, updateClientSchema, insertProjectMilestoneSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Get client by ID
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  // Create new client
  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  // Update client
  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const validatedData = updateClientSchema.parse(req.body);
      const client = await storage.updateClient(req.params.id, validatedData);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  // Get project milestones for client
  app.get("/api/clients/:id/milestones", async (req, res) => {
    try {
      const milestones = await storage.getProjectMilestones(req.params.id);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  // Create project milestone
  app.post("/api/clients/:id/milestones", async (req, res) => {
    try {
      const validatedData = insertProjectMilestoneSchema.parse({
        ...req.body,
        clientId: req.params.id,
      });
      const milestone = await storage.createProjectMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid milestone data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create milestone" });
    }
  });

  // Get integration status for client
  app.get("/api/clients/:id/integrations", async (req, res) => {
    try {
      const status = await storage.getIntegrationStatus(req.params.id);
      if (!status) {
        return res.status(404).json({ message: "Integration status not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration status" });
    }
  });

  // Update integration status
  app.patch("/api/clients/:id/integrations", async (req, res) => {
    try {
      const status = await storage.updateIntegrationStatus(req.params.id, req.body);
      if (!status) {
        return res.status(404).json({ message: "Integration status not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration status" });
    }
  });

  // Webhook endpoints for integrations
  app.post("/api/webhooks/slack", async (req, res) => {
    try {
      // Handle Slack webhook
      console.log("Slack webhook received:", req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to process Slack webhook" });
    }
  });

  app.post("/api/webhooks/n8n", async (req, res) => {
    try {
      // Handle n8n webhook
      console.log("n8n webhook received:", req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to process n8n webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

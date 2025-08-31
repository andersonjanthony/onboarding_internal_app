import { type User, type InsertUser, type Client, type InsertClient, type UpdateClient, type ProjectMilestone, type InsertProjectMilestone, type IntegrationStatus, type InsertIntegrationStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, updates: UpdateClient): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  
  getProjectMilestones(clientId: string): Promise<ProjectMilestone[]>;
  createProjectMilestone(milestone: InsertProjectMilestone): Promise<ProjectMilestone>;
  updateProjectMilestone(id: string, completed: boolean): Promise<ProjectMilestone | undefined>;
  
  getIntegrationStatus(clientId: string): Promise<IntegrationStatus | undefined>;
  createIntegrationStatus(status: InsertIntegrationStatus): Promise<IntegrationStatus>;
  updateIntegrationStatus(clientId: string, updates: Partial<IntegrationStatus>): Promise<IntegrationStatus | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private projectMilestones: Map<string, ProjectMilestone>;
  private integrationStatuses: Map<string, IntegrationStatus>;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.projectMilestones = new Map();
    this.integrationStatuses = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample client
    const sampleClient = await this.createClient({
      name: "Acme Health Systems",
      industry: "Healthcare Technology",
      primaryContactName: "Taylor Morgan",
      primaryContactEmail: "taylor@acmehealth.com",
      salesforceEdition: "Professional",
      numberOfUsers: "150",
      complianceRequirements: ["HIPAA", "SOC 2", "GDPR"],
      servicePackage: "Security Assessment Pro",
      zohoContractId: "",
      zohoMeetingUrl: "",
      currentStep: "1",
      contractSigned: false,
      systemDetailsComplete: false,
      kickoffScheduled: false,
      resourcesAccessed: false,
    });

    // Create sample milestones
    await this.createProjectMilestone({
      clientId: sampleClient.id,
      title: "Kickoff Meeting",
      date: "2025-01-15",
      type: "kickoff",
      completed: false,
    });

    await this.createProjectMilestone({
      clientId: sampleClient.id,
      title: "Security Review",
      date: "2025-01-22",
      type: "review",
      completed: false,
    });

    await this.createProjectMilestone({
      clientId: sampleClient.id,
      title: "Final Delivery",
      date: "2025-01-29",
      type: "delivery",
      completed: false,
    });

    // Create integration status
    await this.createIntegrationStatus({
      clientId: sampleClient.id,
      slackConnected: true,
      zohoConnected: true,
      n8nConnected: true,
      slackWebhookUrl: "",
      n8nWebhookUrl: "",
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.primaryContactEmail === email,
    );
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = randomUUID();
    const newClient: Client = { 
      ...client, 
      id,
      createdAt: new Date(),
    };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: string, updates: UpdateClient): Promise<Client | undefined> {
    const existingClient = this.clients.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient = { ...existingClient, ...updates };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getProjectMilestones(clientId: string): Promise<ProjectMilestone[]> {
    return Array.from(this.projectMilestones.values()).filter(
      (milestone) => milestone.clientId === clientId,
    );
  }

  async createProjectMilestone(milestone: InsertProjectMilestone): Promise<ProjectMilestone> {
    const id = randomUUID();
    const newMilestone: ProjectMilestone = { ...milestone, id };
    this.projectMilestones.set(id, newMilestone);
    return newMilestone;
  }

  async updateProjectMilestone(id: string, completed: boolean): Promise<ProjectMilestone | undefined> {
    const milestone = this.projectMilestones.get(id);
    if (!milestone) return undefined;
    
    const updated = { ...milestone, completed };
    this.projectMilestones.set(id, updated);
    return updated;
  }

  async getIntegrationStatus(clientId: string): Promise<IntegrationStatus | undefined> {
    return Array.from(this.integrationStatuses.values()).find(
      (status) => status.clientId === clientId,
    );
  }

  async createIntegrationStatus(status: InsertIntegrationStatus): Promise<IntegrationStatus> {
    const id = randomUUID();
    const newStatus: IntegrationStatus = { ...status, id };
    this.integrationStatuses.set(id, newStatus);
    return newStatus;
  }

  async updateIntegrationStatus(clientId: string, updates: Partial<IntegrationStatus>): Promise<IntegrationStatus | undefined> {
    const existing = Array.from(this.integrationStatuses.values()).find(
      (status) => status.clientId === clientId,
    );
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.integrationStatuses.set(existing.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

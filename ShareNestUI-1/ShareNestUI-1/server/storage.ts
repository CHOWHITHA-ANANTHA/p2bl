import { type User, type InsertUser, type Item, type InsertItem, type Request, type InsertRequest, type Transaction, type InsertTransaction, type ImpactStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Item methods
  getItem(id: string): Promise<Item | undefined>;
  getItemsByUser(userId: string): Promise<Item[]>;
  getItemsByCategory(category: string): Promise<Item[]>;
  getAvailableItems(): Promise<Item[]>;
  searchItems(query: string, category?: string, location?: string): Promise<Item[]>;
  createItem(item: InsertItem & { userId: string }): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;

  // Request methods
  getRequest(id: string): Promise<Request | undefined>;
  getRequestsByUser(userId: string): Promise<Request[]>;
  getActiveRequests(): Promise<Request[]>;
  searchRequests(query: string): Promise<Request[]>;
  createRequest(request: InsertRequest & { userId: string }): Promise<Request>;
  updateRequest(id: string, updates: Partial<Request>): Promise<Request | undefined>;
  deleteRequest(id: string): Promise<boolean>;

  // Transaction methods
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: string, type?: "borrower" | "owner"): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;

  // Impact methods
  getImpactStats(): Promise<ImpactStats>;
  updateImpactStats(updates: Partial<ImpactStats>): Promise<ImpactStats>;

  // File upload
  saveFile(file: Express.Multer.File): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private items: Map<string, Item>;
  private requests: Map<string, Request>;
  private transactions: Map<string, Transaction>;
  private impactStats: ImpactStats;
  private fileCounter: number;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.requests = new Map();
    this.transactions = new Map();
    this.fileCounter = 1;
    this.impactStats = {
      id: randomUUID(),
      totalItemsShared: 15247,
      totalCo2Saved: "8.2",
      totalMoneySaved: "84000",
      activeMembers: 3421,
      updatedAt: new Date(),
    };

    // Initialize with some sample users and items
    this.initializeData();
  }

  private async initializeData() {
    // Create sample users
    const sampleUsers = [
      { username: "john_doe", email: "john@example.com", name: "John Doe", location: "Downtown District" },
      { username: "sarah_green", email: "sarah@example.com", name: "Sarah Green", location: "Riverside Neighborhood" },
      { username: "mike_share", email: "mike@example.com", name: "Mike Share", location: "University Area" }
    ];

    for (const userData of sampleUsers) {
      await this.createUser(userData);
    }

    // Get created users
    const users = Array.from(this.users.values());

    // Create sample items
    const sampleItems = [
      {
        title: "Coffee Maker",
        description: "Barely used Keurig coffee maker with pods included.",
        category: "Kitchen & Dining",
        condition: "good" as const,
        images: [],
        availability: "permanent" as const,
        location: "0.8 miles away",
        estimatedValue: "50.00",
        co2Impact: "2.1",
        userId: users[0].id
      },
      {
        title: "Children's Books Set",
        description: "Collection of 25 picture books for ages 3-8.",
        category: "Books & Media",
        condition: "new" as const,
        images: [],
        availability: "permanent" as const,
        location: "1.2 miles away",
        estimatedValue: "75.00",
        co2Impact: "1.8",
        userId: users[1].id
      },
      {
        title: "Ergonomic Office Chair",
        description: "Comfortable mesh back chair, height adjustable.",
        category: "Furniture",
        condition: "good" as const,
        images: [],
        availability: "temporary" as const,
        location: "2.1 miles away",
        estimatedValue: "150.00",
        co2Impact: "5.2",
        userId: users[2].id
      },
      {
        title: "Yoga Equipment Set",
        description: "Yoga mat, blocks, and strap. Perfect for beginners.",
        category: "Sports & Recreation",
        condition: "new" as const,
        images: [],
        availability: "permanent" as const,
        location: "0.5 miles away",
        estimatedValue: "40.00",
        co2Impact: "1.5",
        userId: users[0].id
      }
    ];

    for (const itemData of sampleItems) {
      await this.createItem(itemData);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      location: insertUser.location || null,
      profilePicture: insertUser.profilePicture || null,
      communityScore: 0,
      itemsDonated: 0,
      itemsBorrowed: 0,
      itemsRequested: 0,
      co2Saved: "0",
      moneySaved: "0",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Item methods
  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getItemsByUser(userId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.userId === userId);
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.category === category);
  }

  async getAvailableItems(): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.status === "available");
  }

  async searchItems(query: string, category?: string, location?: string): Promise<Item[]> {
    const items = Array.from(this.items.values()).filter(item => item.status === "available");
    
    return items.filter(item => {
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || category === "All Categories" || item.category === category;
      
      const matchesLocation = !location || location === "All Locations" || 
        item.location.toLowerCase().includes(location.toLowerCase());
      
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }

  async createItem(item: InsertItem & { userId: string }): Promise<Item> {
    const id = randomUUID();
    const newItem: Item = {
      ...item,
      id,
      status: "available",
      images: item.images || null,
      estimatedValue: item.estimatedValue || null,
      co2Impact: this.calculateCO2Impact(item.category, parseFloat(item.estimatedValue || "0")),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.set(id, newItem);
    
    // Update user stats
    const user = await this.getUser(item.userId);
    if (user) {
      await this.updateUser(user.id, {
        itemsDonated: (user.itemsDonated || 0) + 1,
        communityScore: (user.communityScore || 0) + 10
      });
    }
    
    return newItem;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  // Request methods
  async getRequest(id: string): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async getRequestsByUser(userId: string): Promise<Request[]> {
    return Array.from(this.requests.values()).filter(request => request.userId === userId);
  }

  async getActiveRequests(): Promise<Request[]> {
    return Array.from(this.requests.values()).filter(request => request.status === "active");
  }

  async searchRequests(query: string): Promise<Request[]> {
    const requests = Array.from(this.requests.values()).filter(request => request.status === "active");
    
    return requests.filter(request => 
      request.title.toLowerCase().includes(query.toLowerCase()) ||
      request.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createRequest(request: InsertRequest & { userId: string }): Promise<Request> {
    const id = randomUUID();
    const newRequest: Request = {
      ...request,
      id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.requests.set(id, newRequest);
    
    // Update user stats
    const user = await this.getUser(request.userId);
    if (user) {
      await this.updateUser(user.id, {
        itemsRequested: (user.itemsRequested || 0) + 1
      });
    }
    
    return newRequest;
  }

  async updateRequest(id: string, updates: Partial<Request>): Promise<Request | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates, updatedAt: new Date() };
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteRequest(id: string): Promise<boolean> {
    return this.requests.delete(id);
  }

  // Transaction methods
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByUser(userId: string, type?: "borrower" | "owner"): Promise<Transaction[]> {
    const transactions = Array.from(this.transactions.values());
    
    if (type === "borrower") {
      return transactions.filter(t => t.borrowerId === userId);
    } else if (type === "owner") {
      return transactions.filter(t => t.ownerId === userId);
    } else {
      return transactions.filter(t => t.borrowerId === userId || t.ownerId === userId);
    }
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      status: "pending",
      startDate: transaction.startDate || null,
      endDate: transaction.endDate || null,
      actualReturnDate: null,
      itemId: transaction.itemId || null,
      requestId: transaction.requestId || null,
      co2Saved: transaction.co2Saved || null,
      moneySaved: transaction.moneySaved || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updates, updatedAt: new Date() };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Impact methods
  async getImpactStats(): Promise<ImpactStats> {
    return this.impactStats;
  }

  async updateImpactStats(updates: Partial<ImpactStats>): Promise<ImpactStats> {
    this.impactStats = { ...this.impactStats, ...updates, updatedAt: new Date() };
    return this.impactStats;
  }

  // File upload
  async saveFile(file: Express.Multer.File): Promise<string> {
    // In a real implementation, this would save to cloud storage
    const filename = `${Date.now()}-${this.fileCounter++}-${file.originalname}`;
    // Return mock URL for demonstration
    return `/uploads/${filename}`;
  }

  // Helper methods
  private calculateCO2Impact(category: string, value: number): string {
    // Simple CO2 calculation based on category and value
    const categoryMultipliers: Record<string, number> = {
      "Electronics": 0.08,
      "Furniture": 0.12,
      "Books & Media": 0.02,
      "Clothing": 0.05,
      "Sports & Recreation": 0.04,
      "Kitchen & Dining": 0.06,
      "Home & Garden": 0.07,
      "Toys & Games": 0.03
    };
    
    const multiplier = categoryMultipliers[category] || 0.05;
    return (value * multiplier).toFixed(3);
  }
}

export const storage = new MemStorage();

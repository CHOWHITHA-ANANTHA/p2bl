import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, insertRequestSchema, insertUserSchema, insertTransactionSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Items routes
  app.get("/api/items", async (req: Request, res: Response) => {
    try {
      const { search, category, location } = req.query;
      const items = await storage.searchItems(
        search as string || "",
        category as string,
        location as string
      );
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post("/api/items", upload.array('images', 5), async (req: Request, res: Response) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      
      // Handle file uploads
      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const imageUrl = await storage.saveFile(file as Express.Multer.File);
          images.push(imageUrl);
        }
      }

      // For demo, use first user as creator
      const users = await storage.getAllUsers();
      const userId = users[0]?.id || "demo-user";

      const item = await storage.createItem({
        ...validatedData,
        images,
        userId,
      });

      // Update impact stats
      const currentStats = await storage.getImpactStats();
      await storage.updateImpactStats({
        totalItemsShared: (currentStats.totalItemsShared || 0) + 1,
      });

      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create item" });
    }
  });

  app.put("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const item = await storage.updateItem(req.params.id, updates);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Requests routes
  app.get("/api/requests", async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      const requests = search 
        ? await storage.searchRequests(search as string)
        : await storage.getActiveRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/requests/:id", async (req: Request, res: Response) => {
    try {
      const request = await storage.getRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  app.post("/api/requests", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      
      // For demo, use first user as creator
      const users = await storage.getAllUsers();
      const userId = users[0]?.id || "demo-user";

      const request = await storage.createRequest({
        ...validatedData,
        userId,
      });

      res.status(201).json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create request" });
    }
  });

  // Suggest matching items for a request
  app.get("/api/requests/:id/matches", async (req: Request, res: Response) => {
    try {
      const request = await storage.getRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      const matchingItems = await storage.searchItems(request.title, request.category);
      res.json(matchingItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to find matches" });
    }
  });

  // Transactions routes
  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);

      // Update item status if it's a borrow transaction
      if (validatedData.itemId) {
        await storage.updateItem(validatedData.itemId, { status: "borrowed" });
      }

      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create transaction" });
    }
  });

  app.get("/api/transactions/user/:userId", async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      const transactions = await storage.getTransactionsByUser(
        req.params.userId,
        type as "borrower" | "owner" | undefined
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Users routes
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });

  // Impact stats routes
  app.get("/api/impact", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getImpactStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch impact stats" });
    }
  });

  // Categories route
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = [
        "Electronics",
        "Furniture", 
        "Books & Media",
        "Clothing",
        "Sports & Recreation",
        "Kitchen & Dining",
        "Home & Garden",
        "Toys & Games"
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

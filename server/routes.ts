import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertBusinessSchema, 
  insertArticleSchema, 
  insertHowToSchema,
  insertClaimRequestSchema,
  insertSaveSchema,
  insertPostSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============ AUTHENTICATION SETUP ============
  await setupAuth(app);

  // ============ AUTH ROUTES ============
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============ BUSINESSES ============
  app.get("/api/businesses", async (req, res) => {
    try {
      const { category, location } = req.query;
      
      let businesses = await storage.getAllBusinesses();
      
      // Apply category filter if provided
      if (category) {
        businesses = businesses.filter(b => b.category === category);
      }
      
      // Apply location filter if provided
      if (location) {
        businesses = businesses.filter(b => b.location === location);
      }
      
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch businesses" });
    }
  });

  app.get("/api/businesses/featured", async (req, res) => {
    try {
      const businesses = await storage.getFeaturedBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured businesses" });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusinessById(id);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch business" });
    }
  });

  app.post("/api/businesses", async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create business" });
    }
  });

  app.patch("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBusinessSchema.partial().parse(req.body);
      const business = await storage.updateBusiness(id, updates);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update business" });
    }
  });

  // ============ ARTICLES ============
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, businessId, userId } = req.query;
      
      let articles;
      if (userId) {
        articles = await storage.getArticlesByUserId(parseInt(userId as string));
      } else if (category) {
        articles = await storage.getArticlesByCategory(category as string);
      } else if (businessId) {
        articles = await storage.getArticlesByBusinessId(parseInt(businessId as string));
      } else {
        articles = await storage.getAllArticles();
      }
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleViews(id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertArticleSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // ============ HOW-TOS ============
  app.get("/api/how-tos", async (req, res) => {
    try {
      const { businessId, userId } = req.query;
      
      let howTos;
      if (userId) {
        howTos = await storage.getHowTosByUserId(parseInt(userId as string));
      } else if (businessId) {
        howTos = await storage.getHowTosByBusinessId(parseInt(businessId as string));
      } else {
        howTos = await storage.getAllHowTos();
      }
      
      res.json(howTos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch how-tos" });
    }
  });

  app.get("/api/how-tos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const howTo = await storage.getHowToById(id);
      
      if (!howTo) {
        return res.status(404).json({ error: "How-to not found" });
      }
      
      res.json(howTo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch how-to" });
    }
  });

  app.post("/api/how-tos", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertHowToSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const howTo = await storage.createHowTo(validatedData);
      res.status(201).json(howTo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create how-to" });
    }
  });

  // ============ POSTS ============
  app.get("/api/posts", async (req, res) => {
    try {
      const { businessId } = req.query;
      
      let posts;
      if (businessId) {
        posts = await storage.getPostsByBusinessId(parseInt(businessId as string));
      } else {
        posts = await storage.getAllPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertPostSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // ============ VENDORS ============
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getAllVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vendor = await storage.getVendorById(id);
      
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  });

  app.get("/api/vendors/:id/products", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const products = await storage.getProductsByVendorId(id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // ============ CLAIM REQUESTS ============
  app.post("/api/claim-requests", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertClaimRequestSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const claimRequest = await storage.createClaimRequest(validatedData);
      res.status(201).json(claimRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create claim request" });
    }
  });

  app.get("/api/claim-requests/:businessId", async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const requests = await storage.getClaimRequestsByBusinessId(businessId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch claim requests" });
    }
  });

  // ============ SAVES ============
  app.get("/api/saves", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const saves = await storage.getSavesByUserId(user.id);
      res.json(saves);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saves" });
    }
  });

  app.post("/api/saves", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertSaveSchema.parse({
        ...req.body,
        userId: user.id,
        sessionId: null,
      });
      const save = await storage.createSave(validatedData);
      res.status(201).json(save);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create save" });
    }
  });

  app.delete("/api/saves/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      await storage.deleteSave(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete save" });
    }
  });

  // ============ UPVOTING ============
  app.post("/api/businesses/:id/upvote", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const business = await storage.upvoteBusiness(id);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      res.status(500).json({ error: "Failed to upvote business" });
    }
  });

  app.post("/api/articles/:id/upvote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.upvoteArticle(id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to upvote article" });
    }
  });

  app.post("/api/how-tos/:id/upvote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const howTo = await storage.upvoteHowTo(id);
      
      if (!howTo) {
        return res.status(404).json({ error: "How-to not found" });
      }
      
      res.json(howTo);
    } catch (error) {
      res.status(500).json({ error: "Failed to upvote how-to" });
    }
  });

  // ============ MIXED FEED (Home Page) ============
  app.get("/api/feed", async (req, res) => {
    try {
      const feed = await storage.getMixedFeed();
      res.json(feed);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  });

  // Admin endpoint to seed production database (one-time use)
  app.post("/api/admin/seed", async (req, res) => {
    try {
      // Check if already seeded
      const existingBusinesses = await storage.getAllBusinesses();
      if (existingBusinesses.length > 0) {
        return res.status(400).json({ 
          error: "Database already contains data. Seeding skipped to prevent duplicates." 
        });
      }

      // Run seed
      const seed = (await import("./seed")).default;
      await seed();
      
      res.json({ 
        success: true, 
        message: "Database seeded successfully with sample businesses, articles, and content." 
        });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

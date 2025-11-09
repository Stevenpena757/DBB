import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { 
  insertBusinessSchema, 
  insertArticleSchema, 
  insertHowToSchema,
  insertClaimRequestSchema,
  insertSaveSchema,
  insertPostSchema,
  insertForumPostSchema,
  insertForumReplySchema
} from "@shared/schema";
import { z } from "zod";
import { createAdminRouter } from "./routes/admin";
import multer from "multer";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============ AUTHENTICATION SETUP ============
  await setupAuth(app);

  // ============ AUTH ROUTES ============
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const claimedBusinesses = await storage.getBusinessesClaimedByUser(user.id);
      res.json({ ...user, claimedBusinesses });
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

  // ============ FILE UPLOADS ============
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'));
      }
    }
  });

  app.post("/api/upload/proof-document", isAuthenticated, upload.single('document'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Create upload directory if it doesn't exist
      const uploadDir = process.env.PRIVATE_OBJECT_DIR || join(process.cwd(), '.private');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `proof_${timestamp}_${safeFilename}`;
      const filePath = join(uploadDir, filename);

      // Write file to storage
      await writeFile(filePath, req.file.buffer);

      // Return only the filename (not a URL)
      res.json({ filename });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Secure download route for proof documents (admin only)
  app.get("/api/admin/proof/:filename", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Validate filename to prevent directory traversal
      if (!filename || filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const uploadDir = process.env.PRIVATE_OBJECT_DIR || join(process.cwd(), '.private');
      const filePath = join(uploadDir, filename);

      // Check if file exists
      if (!existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Read and serve the file
      const { readFile: readFileAsync } = await import('fs/promises');
      const fileBuffer = await readFileAsync(filePath);
      
      // Set appropriate content type
      const ext = filename.toLowerCase().split('.').pop();
      const contentTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png'
      };
      
      res.setHeader('Content-Type', contentTypes[ext || 'pdf'] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(fileBuffer);
    } catch (error) {
      console.error("File download error:", error);
      res.status(500).json({ error: "Failed to download file" });
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

  // ============ FORUM POSTS ============
  app.get("/api/forum", async (req, res) => {
    try {
      const { type, category } = req.query;
      const posts = await storage.getAllForumPosts(
        type as string | undefined,
        category as string | undefined
      );
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum posts" });
    }
  });

  app.get("/api/forum/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getForumPostById(id);
      
      if (!post) {
        return res.status(404).json({ error: "Forum post not found" });
      }
      
      await storage.incrementForumPostViews(id);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum post" });
    }
  });

  app.post("/api/forum", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create forum post" });
    }
  });

  app.post("/api/forum/:id/upvote", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.upvoteForumPost(id);
      
      if (!post) {
        return res.status(404).json({ error: "Forum post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to upvote forum post" });
    }
  });

  // ============ FORUM REPLIES ============
  app.get("/api/forum/:id/replies", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const replies = await storage.getRepliesByPostId(postId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });

  app.post("/api/forum/:id/replies", isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertForumReplySchema.parse({
        ...req.body,
        postId,
        userId: user.id,
      });
      const reply = await storage.createForumReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create reply" });
    }
  });

  app.post("/api/forum/replies/:id/upvote", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const reply = await storage.upvoteForumReply(id);
      
      if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
      }
      
      res.json(reply);
    } catch (error) {
      res.status(500).json({ error: "Failed to upvote reply" });
    }
  });

  app.post("/api/forum/replies/:id/accept", isAuthenticated, async (req: any, res) => {
    try {
      const replyId = parseInt(req.params.id);
      const { postId } = req.body;
      
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const post = await storage.getForumPostById(postId);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      if (post.userId !== user.id) {
        return res.status(403).json({ error: "You can only accept answers on your own questions" });
      }
      
      await storage.acceptAnswer(replyId, postId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to accept answer" });
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

  // ============ ADMIN PANEL ============
  const adminRouter = createAdminRouter(storage);
  app.use("/api/admin", isAuthenticated, isAdmin, adminRouter);

  const httpServer = createServer(app);
  return httpServer;
}

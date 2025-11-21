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
  insertForumReplySchema,
  insertPendingBusinessSchema,
  insertAbuseReportSchema,
  insertBusinessLeadSchema,
  insertQuizSubmissionSchema,
  insertAnalyticsEventSchema,
  insertBeautyBookSchema,
  insertUserGoalSchema,
  insertBusinessReviewSchema,
  insertSubmissionEventSchema,
  insertVerificationRequestSchema,
  insertContentSubmissionSchema
} from "@shared/schema";
import { z } from "zod";
import { createAdminRouter } from "./routes/admin";
import { createStripeRouter } from "./routes/stripe";
import multer from "multer";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { SEO_LANDING_PAGES } from "@shared/seo";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============ HEALTH CHECK ============
  // Simple health check endpoint for deployment health checks
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "Dallas Beauty Book API" });
  });

  // ============ ROBOTS.TXT ============
  app.get("/robots.txt", (_req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /dbb-management-x7k

Sitemap: https://dallasbeautybook.com/sitemap.xml`);
  });

  // ============ SITEMAPS ============
  app.get("/sitemap.xml", (_req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-cities.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-businesses.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-community.xml</loc>
  </sitemap>
</sitemapindex>`);
  });

  app.get("/sitemap-categories.xml", (_req, res) => {
    const categoryPages = SEO_LANDING_PAGES.filter(page => page.category);
    
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryPages.map(page => `  <url>
    <loc>https://dallasbeautybook.com/${page.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`);
  });

  app.get("/sitemap-cities.xml", (_req, res) => {
    const cityPages = SEO_LANDING_PAGES.filter(page => page.city);
    
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityPages.map(page => `  <url>
    <loc>https://dallasbeautybook.com/${page.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`);
  });

  app.get("/sitemap-businesses.xml", async (_req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      
      res.type('application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${businesses.map(business => `  <url>
    <loc>https://dallasbeautybook.com/business/${business.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  });

  app.get("/sitemap-community.xml", async (_req, res) => {
    try {
      const posts = await storage.getAllForumPosts();
      const recentPosts = posts
        .filter(post => post.createdAt !== null)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 500);
      
      res.type('application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dallasbeautybook.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dallasbeautybook.com/explore</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dallasbeautybook.com/forum</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
${recentPosts.map(post => `  <url>
    <loc>https://dallasbeautybook.com/forum/${post.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  });
  
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
      const { category, location, q, sponsored } = req.query;
      
      let businesses;
      
      // Use database-backed search if query provided
      if (q && typeof q === 'string') {
        const searchTerm = q.trim();
        businesses = await storage.searchBusinesses(
          searchTerm,
          category as string | undefined,
          location as string | undefined
        );
      } else {
        // Otherwise get all and filter
        businesses = await storage.getAllBusinesses();
        
        // Apply category filter if provided
        if (category) {
          businesses = businesses.filter(b => b.category === category);
        }
        
        // Apply location filter if provided
        if (location) {
          businesses = businesses.filter(b => b.location === location);
        }
      }
      
      // Filter sponsored only if requested
      if (sponsored === 'true') {
        businesses = businesses.filter(b => b.isSponsored && b.sponsoredUntil && new Date(b.sponsoredUntil) > new Date());
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

  // Get businesses claimed by current user (MUST be before /:id route)
  app.get("/api/businesses/claimed", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      console.log('[BusinessDashboard] Fetching claimed businesses for replitId:', replitId);
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        console.log('[BusinessDashboard] User not found for replitId:', replitId);
        return res.status(401).json({ error: "User not found" });
      }
      
      console.log('[BusinessDashboard] Found user:', user.id, user.username);
      const businesses = await storage.getClaimedBusinessesByUser(user.id);
      console.log('[BusinessDashboard] Claimed businesses count:', businesses.length, businesses.map(b => ({ id: b.id, name: b.name, claimedBy: b.claimedBy })));
      res.json(businesses);
    } catch (error) {
      console.error('[BusinessDashboard] Error fetching claimed businesses:', error);
      res.status(500).json({ error: "Failed to fetch claimed businesses" });
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

  // ============ PENDING BUSINESS LISTINGS ============
  app.post("/api/pending-businesses", async (req: any, res) => {
    try {
      let userId = null;
      
      // If user is authenticated, get their ID
      if (req.user) {
        const replitId = req.user.claims.sub.toString();
        const user = await storage.getUserByReplitId(replitId);
        if (user) {
          userId = user.id;
        }
      }
      
      const validatedData = insertPendingBusinessSchema.parse({
        ...req.body,
        submittedBy: userId,
      });
      
      const pendingBusiness = await storage.createPendingBusiness(validatedData);
      res.status(201).json(pendingBusiness);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Failed to create pending business:", error);
      res.status(500).json({ error: "Failed to submit business listing" });
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

  // ============ BUSINESS DASHBOARD & REVIEWS ============
  // Get followers for a business
  app.get("/api/businesses/:id/followers", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Verify user owns this business
      const business = await storage.getBusinessById(businessId);
      if (!business || business.claimedBy !== user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const followers = await storage.getBusinessFollowers(businessId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch followers" });
    }
  });

  // Get positive reviews (4-5 stars) for a business
  app.get("/api/businesses/:id/positive-reviews", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Verify user owns this business
      const business = await storage.getBusinessById(businessId);
      if (!business || business.claimedBy !== user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const reviews = await storage.getPositiveReviewsByBusiness(businessId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch positive reviews" });
    }
  });

  // Get all reviews for a business
  app.get("/api/businesses/:id/reviews", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByBusiness(businessId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create a review for a business
  app.post("/api/businesses/:id/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validated = insertBusinessReviewSchema.parse({
        ...req.body,
        businessId,
        userId: user.id,
      });
      
      const review = await storage.createBusinessReview(validated);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Send promotions to selected users
  app.post("/api/promotions/send", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const { businessId, userIds, ...promoData } = req.body;
      
      // Verify user owns the business
      const business = await storage.getBusinessById(businessId);
      if (!business || business.claimedBy !== user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Create promotions for each selected user
      const promotions = await Promise.all(
        userIds.map((userId: number) =>
          storage.createUserPromotion({
            userId,
            businessId,
            ...promoData,
          })
        )
      );
      
      res.status(201).json({ count: promotions.length, promotions });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to send promotions" });
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

  // PROTECTED: Admin endpoint to seed production database (one-time use, requires admin auth)
  app.post("/api/admin/seed", isAuthenticated, isAdmin, async (req, res) => {
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

  // ============ RATE LIMITING ============
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  
  const rateLimit = (maxRequests: number, windowMs: number) => {
    return (req: any, res: any, next: any) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const record = rateLimitMap.get(ip);
      
      if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }
      
      if (record.count >= maxRequests) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }
      
      record.count++;
      next();
    };
  };

  // ============ REPORT ENDPOINT ============
  app.post("/api/report", rateLimit(5, 60000), async (req, res) => {
    try {
      const reportSchema = z.object({
        type: z.enum(["business", "user", "post", "comment", "other"]),
        targetId: z.number().optional(),
        reason: z.string().min(10, "Reason must be at least 10 characters"),
        details: z.string().optional()
      });
      
      const data = reportSchema.parse(req.body);
      
      // In a real implementation, you would store this in the database
      // For now, just log it
      console.log("Report received:", data);
      
      res.json({ 
        success: true, 
        message: "Report submitted successfully. We'll review it shortly." 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid report data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit report" });
    }
  });


  // ============ ABUSE REPORTING ============
  app.post("/api/abuse-reports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const reportData = insertAbuseReportSchema.parse({
        ...req.body,
        reportedBy: userId
      });
      
      const report = await storage.createAbuseReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid report data", details: error.errors });
      }
      console.error("Error creating abuse report:", error);
      res.status(500).json({ message: "Failed to create abuse report" });
    }
  });

  // ============ SEO SITEMAPS ============
  app.get("/sitemap.xml", async (_req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-businesses.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-cities.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-categories.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dallasbeautybook.com/sitemap-community.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  app.get("/sitemap-businesses.xml", async (_req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      const urls = businesses.map(b => `  <url>
    <loc>https://dallasbeautybook.com/business/${b.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dallasbeautybook.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urls}
</urlset>`;
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating businesses sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/sitemap-cities.xml", async (_req, res) => {
    const cities = ['Dallas', 'Plano', 'Frisco', 'Fort Worth', 'Arlington', 'Irving', 'McKinney', 'Allen'];
    const urls = cities.map(city => `  <url>
    <loc>https://dallasbeautybook.com/best-beauty-${city.toLowerCase()}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  app.get("/sitemap-categories.xml", async (_req, res) => {
    const landingPages = [
      'best-med-spas-dallas', 'best-med-spas-plano', 'best-med-spas-frisco', 'best-med-spas-fort-worth',
      'best-med-spas-arlington', 'best-med-spas-irving', 'best-med-spas-mckinney', 'best-med-spas-allen',
      'best-botox-clinics-dallas', 'best-botox-clinics-plano', 'best-botox-clinics-frisco', 'best-botox-clinics-fort-worth',
      'best-lip-filler-specialists-dallas', 'best-lip-filler-specialists-plano', 'best-lip-filler-specialists-frisco',
      'best-lash-extensions-dallas', 'best-lash-extensions-plano', 'best-lash-extensions-frisco', 'best-lash-extensions-arlington',
      'best-lash-lifts-dallas', 'best-facial-treatments-dallas', 'best-facial-treatments-plano', 'best-facial-treatments-frisco',
      'best-microneedling-dallas', 'best-chemical-peels-dallas', 'best-acne-facials-dallas',
      'best-laser-hair-removal-dallas', 'best-laser-hair-removal-plano', 'best-laser-hair-removal-frisco', 'best-brazilian-laser-dallas',
      'best-nail-salons-dallas', 'best-nail-salons-plano', 'best-nail-salons-frisco', 'best-mani-pedi-dallas',
      'best-brow-lamination-dallas', 'best-brow-threading-dallas',
      'best-teeth-whitening-dallas', 'best-cosmetic-dentists-dallas', 'best-veneers-dallas',
      'top-beauty-aesthetics-dallas', 'best-aesthetic-clinics-dallas', 'best-wellness-beauty-centers-dallas',
      'best-womens-beauty-services-dallas', 'best-mens-grooming-aesthetics-dallas',
      'best-non-surgical-lifts-dallas', 'best-anti-aging-treatments-dallas', 'best-skin-tightening-dallas',
      'best-ethnic-skincare-dallas', 'best-korean-skincare-facials-dallas', 'best-iv-vitamin-therapy-dallas'
    ];
    
    const urls = landingPages.map(slug => `  <url>
    <loc>https://dallasbeautybook.com/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  app.get("/sitemap-community.xml", async (_req, res) => {
    try {
      const posts = await storage.getAllPosts();
      const forumPosts = await storage.getAllForumPosts();
      
      const postUrls = posts.slice(0, 100).map(p => `  <url>
    <loc>https://dallasbeautybook.com/post/${p.id}</loc>
    <lastmod>${new Date(p.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n');
      
      const forumUrls = forumPosts.slice(0, 100).map(f => `  <url>
    <loc>https://dallasbeautybook.com/forum/${f.id}</loc>
    <lastmod>${new Date(f.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n');
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dallasbeautybook.com/forum</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
${postUrls}
${forumUrls}
</urlset>`;
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating community sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ============ BUSINESS LEADS ============
  app.post("/api/leads", async (req: any, res) => {
    try {
      const leadData = insertBusinessLeadSchema.parse(req.body);
      const lead = await storage.createBusinessLead(leadData);
      
      let userId = null;
      if (req.user?.claims?.sub) {
        const replitId = req.user.claims.sub.toString();
        const user = await storage.getUserByReplitId(replitId);
        userId = user?.id || null;
      }
      
      // Only track analytics if businessId is provided (business-specific leads)
      if (req.body.businessId) {
        await storage.createAnalyticsEvent({
          businessId: req.body.businessId,
          eventType: "lead_form_submit",
          userId,
          sessionId: req.session?.id || null,
          metadata: { source: req.body.source || "profile_page" },
        });
      }
      
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating business lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.get("/api/leads", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const leads = await storage.getAllBusinessLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // ============ BEAUTY BOOKS ============
  app.post("/api/beauty-book", async (req: any, res) => {
    try {
      let userId = null;
      
      // If user is authenticated, get their ID
      if (req.user) {
        const replitId = req.user.claims.sub.toString();
        const user = await storage.getUserByReplitId(replitId);
        if (user) {
          userId = user.id;
        }
      }
      
      const beautyBookData = insertBeautyBookSchema.parse({
        ...req.body,
        userId,
      });
      
      const beautyBook = await storage.createBeautyBook(beautyBookData);
      
      // Return response with beauty book details for recommendations
      res.json({
        status: "ok",
        beautyBookId: beautyBook.id,
        city: beautyBook.city,
        primaryEnhanceArea: Array.isArray(beautyBook.enhanceAreas) && beautyBook.enhanceAreas.length > 0
          ? beautyBook.enhanceAreas[0]
          : null,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Failed to create beauty book:", error);
      res.status(500).json({ error: "Failed to create beauty book" });
    }
  });

  app.get("/api/beauty-book", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const beautyBooks = await storage.getAllBeautyBooks();
      res.json(beautyBooks);
    } catch (error) {
      console.error("Error fetching beauty books:", error);
      res.status(500).json({ error: "Failed to fetch beauty books" });
    }
  });

  app.get("/api/beauty-book/:id", async (req, res) => {
    try {
      const beautyBook = await storage.getBeautyBookById(req.params.id);
      
      if (!beautyBook) {
        return res.status(404).json({ error: "Beauty book not found" });
      }
      
      res.json(beautyBook);
    } catch (error) {
      console.error("Error fetching beauty book:", error);
      res.status(500).json({ error: "Failed to fetch beauty book" });
    }
  });

  app.patch("/api/beauty-book/:uuid/claim", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const { uuid } = req.params;
      
      // Check if beauty book exists
      const beautyBook = await storage.getBeautyBookById(uuid);
      if (!beautyBook) {
        return res.status(404).json({ error: "Beauty book not found" });
      }

      // Security check: Only allow claiming if book is unclaimed OR already belongs to this user
      if (beautyBook.userId && beautyBook.userId !== user.id) {
        return res.status(403).json({ error: "This beauty book belongs to another user" });
      }

      // If already claimed by this user, return success without updating
      if (beautyBook.userId === user.id) {
        return res.json(beautyBook);
      }

      // Claim the beauty book (it's currently unclaimed)
      const claimedBook = await storage.claimBeautyBook(uuid, user.id);
      res.json(claimedBook);
    } catch (error) {
      console.error("Error claiming beauty book:", error);
      res.status(500).json({ error: "Failed to claim beauty book" });
    }
  });

  // ============ ANALYTICS EVENTS ============
  // Note: Analytics are tracked server-side from other endpoints (leads, quiz, etc.)
  // No public POST endpoint to prevent spam and data poisoning attacks
  
  app.get("/api/analytics/:businessId", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const { eventType } = req.query;
      
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      if (business.claimedBy !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const events = await storage.getAnalyticsEventsByBusiness(
        businessId,
        eventType as string | undefined
      );
      res.json(events);
    } catch (error) {
      console.error("Error fetching analytics events:", error);
      res.status(500).json({ error: "Failed to fetch analytics events" });
    }
  });

  // ============ USER PROFILE & FOLLOWS ============
  // Follow business (body-based for testing/admin) - MUST come before /:businessId route
  app.post("/api/follows", isAuthenticated, async (req: any, res) => {
    try {
      const { userId, businessId } = req.body;
      
      if (!userId || !businessId) {
        return res.status(400).json({ error: "userId and businessId are required" });
      }
      
      // Verify the request is authorized (either acting as self or admin)
      const replitId = req.user.claims.sub.toString();
      const currentUser = await storage.getUserByReplitId(replitId);
      
      if (!currentUser) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Allow if acting as self or if admin
      if (currentUser.id !== userId && currentUser.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized: can only follow as yourself unless admin" });
      }
      
      const follow = await storage.followBusiness(userId, businessId);
      res.json(follow);
    } catch (error) {
      console.error('[Follow] Error creating follow:', error);
      res.status(500).json({ error: "Failed to follow business" });
    }
  });

  // Follow/Unfollow Business (path-based for regular use)
  app.post("/api/follows/:businessId", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      const follow = await storage.followBusiness(user.id, businessId);
      res.json(follow);
    } catch (error) {
      console.error("Error following business:", error);
      res.status(500).json({ error: "Failed to follow business" });
    }
  });

  app.delete("/api/follows/:businessId", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      await storage.unfollowBusiness(user.id, businessId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unfollowing business:", error);
      res.status(500).json({ error: "Failed to unfollow business" });
    }
  });

  app.get("/api/follows/check/:businessId", isAuthenticated, async (req: any, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const isFollowing = await storage.isFollowing(user.id, businessId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });

  app.get("/api/profile/follows", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const followedBusinesses = await storage.getUserFollowsWithBusinesses(user.id);
      res.json(followedBusinesses);
    } catch (error) {
      console.error("Error fetching user follows:", error);
      res.status(500).json({ error: "Failed to fetch followed businesses" });
    }
  });

  // User Goals
  app.get("/api/profile/goals", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const goals = await storage.getUserGoals(user.id);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching user goals:", error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/profile/goals", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const goalData = insertUserGoalSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const goal = await storage.createUserGoal(goalData);
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating goal:", error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/profile/goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const updates = insertUserGoalSchema.partial().parse(req.body);
      const goal = await storage.updateUserGoal(goalId, updates);
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating goal:", error);
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  app.post("/api/profile/goals/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const goal = await storage.completeUserGoal(goalId);
      res.json(goal);
    } catch (error) {
      console.error("Error completing goal:", error);
      res.status(500).json({ error: "Failed to complete goal" });
    }
  });

  app.delete("/api/profile/goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      await storage.deleteUserGoal(goalId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ error: "Failed to delete goal" });
    }
  });

  // User Promotions
  app.get("/api/profile/promotions", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const activeOnly = req.query.active === "true";
      const promotions = await storage.getUserPromotions(user.id, activeOnly);
      res.json(promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  app.post("/api/profile/promotions/:id/use", isAuthenticated, async (req: any, res) => {
    try {
      const promoId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const promotion = await storage.markPromotionUsed(promoId);
      res.json(promotion);
    } catch (error) {
      console.error("Error marking promotion as used:", error);
      res.status(500).json({ error: "Failed to mark promotion as used" });
    }
  });

  // User Profile Data
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const [beautyBooks, goals, promotions, followedBusinesses, forumPosts] = await Promise.all([
        storage.getUserBeautyBooks(user.id),
        storage.getUserGoals(user.id),
        storage.getUserPromotions(user.id, true),
        storage.getUserFollowsWithBusinesses(user.id),
        storage.getForumPostsByUserId(user.id),
      ]);
      
      res.json({
        user,
        beautyBooks,
        goals,
        promotions,
        followedBusinesses,
        forumPosts,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // ============ SUBMISSION TRACKING ============
  // Create a new submission event (user submits content, claims business, etc.)
  app.post("/api/submissions", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertSubmissionEventSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const submission = await storage.createSubmissionEvent(validatedData);
      res.json(submission);
    } catch (error: any) {
      console.error("Error creating submission event:", error);
      res.status(400).json({ error: error.message || "Failed to create submission" });
    }
  });

  // Get user's own submissions
  app.get("/api/submissions/me", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const submissions = await storage.getUserSubmissions(user.id);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Get all submissions (admin only)
  app.get("/api/submissions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status, type, verificationLevel } = req.query;
      const submissions = await storage.getAllSubmissions({
        status: status as string,
        submissionType: type as string,
        verificationLevel: verificationLevel as string,
      });
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching all submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Get single submission with details (admin only)
  app.get("/api/submissions/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const submission = await storage.getSubmissionEventById(submissionId);
      
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  // Approve submission (admin only)
  app.patch("/api/submissions/:id/approve", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const admin = await storage.getUserByReplitId(replitId);
      
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }
      
      const { notes } = req.body;
      
      const submission = await storage.approveSubmission(submissionId, admin.id, notes);
      res.json(submission);
    } catch (error: any) {
      console.error("Error approving submission:", error);
      res.status(400).json({ error: error.message || "Failed to approve submission" });
    }
  });

  // Reject submission (admin only)
  app.patch("/api/submissions/:id/reject", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const admin = await storage.getUserByReplitId(replitId);
      
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }
      
      const { notes } = req.body;
      
      const submission = await storage.rejectSubmission(submissionId, admin.id, notes);
      res.json(submission);
    } catch (error: any) {
      console.error("Error rejecting submission:", error);
      res.status(400).json({ error: error.message || "Failed to reject submission" });
    }
  });

  // Request additional information (admin only)
  app.patch("/api/submissions/:id/request-info", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const replitId = req.user.claims.sub.toString();
      const admin = await storage.getUserByReplitId(replitId);
      
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }
      
      const { notes } = req.body;
      
      const submission = await storage.requestSubmissionInfo(submissionId, admin.id, notes);
      res.json(submission);
    } catch (error: any) {
      console.error("Error requesting info:", error);
      res.status(400).json({ error: error.message || "Failed to request info" });
    }
  });

  // Create content submission
  app.post("/api/content-submissions", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const validatedData = insertContentSubmissionSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const content = await storage.createContentSubmission(validatedData);
      res.json(content);
    } catch (error: any) {
      console.error("Error creating content submission:", error);
      res.status(400).json({ error: error.message || "Failed to create content submission" });
    }
  });

  // Get user's content submissions
  app.get("/api/content-submissions/me", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub.toString();
      const user = await storage.getUserByReplitId(replitId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const submissions = await storage.getUserContentSubmissions(user.id);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching content submissions:", error);
      res.status(500).json({ error: "Failed to fetch content submissions" });
    }
  });

  // ============ NEWSLETTER SIGNUPS ============
  // Newsletter signup (public - no auth required)
  app.post("/api/newsletter-signups", async (req, res) => {
    try {
      const { insertNewsletterSignupSchema } = await import("@shared/schema");
      const validatedData = insertNewsletterSignupSchema.parse(req.body);
      
      const signup = await storage.createNewsletterSignup(validatedData);
      res.json(signup);
    } catch (error: any) {
      console.error("Error creating newsletter signup:", error);
      if (error.code === '23505') { // Duplicate email
        return res.status(409).json({ error: "This email is already subscribed" });
      }
      res.status(400).json({ error: error.message || "Failed to subscribe" });
    }
  });

  // Get all newsletter signups (admin only)
  app.get("/api/newsletter-signups", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const subscribedOnly = req.query.subscribed === 'true';
      const signups = await storage.getAllNewsletterSignups(subscribedOnly);
      res.json(signups);
    } catch (error) {
      console.error("Error fetching newsletter signups:", error);
      res.status(500).json({ error: "Failed to fetch newsletter signups" });
    }
  });

  // ============ STRIPE PAYMENTS ============
  // Webhook must be publicly accessible for Stripe's servers
  // Other routes need authentication and ownership validation
  const stripeRouter = createStripeRouter(storage, isAuthenticated);
  app.use("/api/stripe", stripeRouter);

  // ============ ADMIN PANEL ============
  const adminRouter = createAdminRouter(storage);
  app.use("/api/admin", isAuthenticated, isAdmin, adminRouter);

  const httpServer = createServer(app);
  return httpServer;
}

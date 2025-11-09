import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users, businesses, posts, articles, howTos, vendors, vendorProducts, claimRequests, saves,
  type User, type InsertUser,
  type Business, type InsertBusiness,
  type Post, type InsertPost,
  type Article, type InsertArticle,
  type HowTo, type InsertHowTo,
  type Vendor, type InsertVendor,
  type VendorProduct, type InsertVendorProduct,
  type ClaimRequest, type InsertClaimRequest,
  type Save, type InsertSave
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  
  // ============ USERS ============
  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.replitId, replitId)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // ============ BUSINESSES ============
  async getAllBusinesses(): Promise<Business[]> {
    return db.select().from(businesses).orderBy(desc(businesses.createdAt));
  }

  async getBusinessById(id: number): Promise<Business | undefined> {
    const result = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);
    return result[0];
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return db.select().from(businesses).where(eq(businesses.category, category)).orderBy(desc(businesses.createdAt));
  }

  async getBusinessesByLocation(location: string): Promise<Business[]> {
    return db.select().from(businesses).where(eq(businesses.location, location)).orderBy(desc(businesses.createdAt));
  }

  async getFeaturedBusinesses(): Promise<Business[]> {
    return db.select().from(businesses).where(eq(businesses.featured, true)).orderBy(desc(businesses.upvotes));
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const result = await db.insert(businesses).values(business).returning();
    return result[0];
  }

  async updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business | undefined> {
    const result = await db.update(businesses).set(updates).where(eq(businesses.id, id)).returning();
    return result[0];
  }

  // ============ POSTS ============
  async getAllPosts(): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async getPostsByBusinessId(businessId: number): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.businessId, businessId)).orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  // ============ ARTICLES ============
  async getAllArticles(): Promise<Article[]> {
    return db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async getArticlesByBusinessId(businessId: number): Promise<Article[]> {
    return db.select().from(articles).where(eq(articles.businessId, businessId)).orderBy(desc(articles.createdAt));
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return db.select().from(articles).where(eq(articles.category, category)).orderBy(desc(articles.createdAt));
  }

  async getArticlesByUserId(userId: number): Promise<Article[]> {
    return db.select().from(articles).where(eq(articles.userId, userId)).orderBy(desc(articles.createdAt));
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article).returning();
    return result[0];
  }

  async incrementArticleViews(id: number): Promise<void> {
    const article = await this.getArticleById(id);
    if (article) {
      await db.update(articles).set({ views: article.views + 1 }).where(eq(articles.id, id));
    }
  }

  // ============ HOW-TOS ============
  async getAllHowTos(): Promise<HowTo[]> {
    return db.select().from(howTos).orderBy(desc(howTos.createdAt));
  }

  async getHowToById(id: number): Promise<HowTo | undefined> {
    const result = await db.select().from(howTos).where(eq(howTos.id, id)).limit(1);
    return result[0];
  }

  async getHowTosByBusinessId(businessId: number): Promise<HowTo[]> {
    return db.select().from(howTos).where(eq(howTos.businessId, businessId)).orderBy(desc(howTos.createdAt));
  }

  async getHowTosByUserId(userId: number): Promise<HowTo[]> {
    return db.select().from(howTos).where(eq(howTos.userId, userId)).orderBy(desc(howTos.createdAt));
  }

  async createHowTo(howTo: InsertHowTo): Promise<HowTo> {
    const result = await db.insert(howTos).values(howTo).returning();
    return result[0];
  }

  // ============ VENDORS ============
  async getAllVendors(): Promise<Vendor[]> {
    return db.select().from(vendors).orderBy(desc(vendors.createdAt));
  }

  async getVendorById(id: number): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
    return result[0];
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const result = await db.insert(vendors).values(vendor).returning();
    return result[0];
  }

  // ============ VENDOR PRODUCTS ============
  async getProductsByVendorId(vendorId: number): Promise<VendorProduct[]> {
    return db.select().from(vendorProducts).where(eq(vendorProducts.vendorId, vendorId)).orderBy(desc(vendorProducts.createdAt));
  }

  async createVendorProduct(product: InsertVendorProduct): Promise<VendorProduct> {
    const result = await db.insert(vendorProducts).values(product).returning();
    return result[0];
  }

  // ============ CLAIM REQUESTS ============
  async createClaimRequest(request: InsertClaimRequest): Promise<ClaimRequest> {
    const result = await db.insert(claimRequests).values(request).returning();
    return result[0];
  }

  async getClaimRequestsByBusinessId(businessId: number): Promise<ClaimRequest[]> {
    return db.select().from(claimRequests).where(eq(claimRequests.businessId, businessId)).orderBy(desc(claimRequests.createdAt));
  }

  async getClaimRequestsByUserId(userId: number): Promise<ClaimRequest[]> {
    return db.select().from(claimRequests).where(eq(claimRequests.userId, userId)).orderBy(desc(claimRequests.createdAt));
  }

  async updateClaimRequest(id: number, status: string): Promise<ClaimRequest | undefined> {
    const result = await db.update(claimRequests).set({ status }).where(eq(claimRequests.id, id)).returning();
    return result[0];
  }

  async approveClaimRequest(id: number): Promise<void> {
    // Get the claim request
    const request = await db.select().from(claimRequests).where(eq(claimRequests.id, id)).limit(1);
    if (request[0]) {
      // Use transaction to update both claim request and business
      await db.transaction(async (tx) => {
        // Update claim request status
        await tx.update(claimRequests).set({ status: 'approved' }).where(eq(claimRequests.id, id));
        
        // Update business to mark as claimed
        await tx.update(businesses).set({
          isClaimed: true,
          claimedBy: request[0].userId
        }).where(eq(businesses.id, request[0].businessId));
      });
    }
  }

  // ============ SAVES ============
  async getSavesBySessionId(sessionId: string): Promise<Save[]> {
    return db.select().from(saves).where(eq(saves.sessionId, sessionId)).orderBy(desc(saves.createdAt));
  }

  async getSavesByUserId(userId: number): Promise<Save[]> {
    return db.select().from(saves).where(eq(saves.userId, userId)).orderBy(desc(saves.createdAt));
  }

  async createSave(save: InsertSave): Promise<Save> {
    const result = await db.insert(saves).values(save).returning();
    return result[0];
  }

  async deleteSave(id: number): Promise<void> {
    await db.delete(saves).where(eq(saves.id, id));
  }

  async deleteSaveByUserAndItem(userId: number | null, sessionId: string | null, itemType: string, itemId: number): Promise<void> {
    if (userId) {
      await db.delete(saves).where(
        and(
          eq(saves.userId, userId),
          eq(saves.itemType, itemType),
          eq(saves.itemId, itemId)
        )
      );
    } else if (sessionId) {
      await db.delete(saves).where(
        and(
          eq(saves.sessionId, sessionId),
          eq(saves.itemType, itemType),
          eq(saves.itemId, itemId)
        )
      );
    }
  }

  // ============ MIXED FEED ============
  async getMixedFeed(): Promise<Array<Business | Article | HowTo>> {
    // Get recent businesses, articles, and how-tos
    const [recentBusinesses, recentArticles, recentHowTos] = await Promise.all([
      db.select().from(businesses).orderBy(desc(businesses.createdAt)).limit(10),
      db.select().from(articles).orderBy(desc(articles.createdAt)).limit(10),
      db.select().from(howTos).orderBy(desc(howTos.createdAt)).limit(10)
    ]);

    // Combine and sort by creation date
    const mixed: Array<Business | Article | HowTo> = [
      ...recentBusinesses,
      ...recentArticles,
      ...recentHowTos
    ];

    // Sort by createdAt
    mixed.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return mixed.slice(0, 20); // Return top 20
  }

  // ============ UPVOTING ============
  async upvoteBusiness(id: number): Promise<Business | undefined> {
    const business = await this.getBusinessById(id);
    if (business) {
      const result = await db.update(businesses).set({ upvotes: business.upvotes + 1 }).where(eq(businesses.id, id)).returning();
      return result[0];
    }
    return undefined;
  }

  async upvoteArticle(id: number): Promise<Article | undefined> {
    const article = await this.getArticleById(id);
    if (article) {
      const result = await db.update(articles).set({ upvotes: article.upvotes + 1 }).where(eq(articles.id, id)).returning();
      return result[0];
    }
    return undefined;
  }

  async upvoteHowTo(id: number): Promise<HowTo | undefined> {
    const howTo = await this.getHowToById(id);
    if (howTo) {
      const result = await db.update(howTos).set({ upvotes: howTo.upvotes + 1 }).where(eq(howTos.id, id)).returning();
      return result[0];
    }
    return undefined;
  }

  // ============ ADMIN METHODS ============
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const result = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllClaimRequests(): Promise<ClaimRequest[]> {
    return db.select().from(claimRequests).orderBy(desc(claimRequests.createdAt));
  }

  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalBusinesses: number;
    totalArticles: number;
    totalHowTos: number;
    totalVendors: number;
    claimedBusinesses: number;
    pendingClaims: number;
    freeBusinesses: number;
    proBusinesses: number;
    premiumBusinesses: number;
  }> {
    const [
      allUsers,
      allBusinesses,
      allArticles,
      allHowTos,
      allVendors,
      allClaims
    ] = await Promise.all([
      db.select().from(users),
      db.select().from(businesses),
      db.select().from(articles),
      db.select().from(howTos),
      db.select().from(vendors),
      db.select().from(claimRequests)
    ]);

    const claimedBusinesses = allBusinesses.filter(b => b.isClaimed).length;
    const pendingClaims = allClaims.filter(c => c.status === "pending").length;
    const freeBusinesses = allBusinesses.filter(b => b.subscriptionTier === "free").length;
    const proBusinesses = allBusinesses.filter(b => b.subscriptionTier === "pro").length;
    const premiumBusinesses = allBusinesses.filter(b => b.subscriptionTier === "premium").length;

    return {
      totalUsers: allUsers.length,
      totalBusinesses: allBusinesses.length,
      totalArticles: allArticles.length,
      totalHowTos: allHowTos.length,
      totalVendors: allVendors.length,
      claimedBusinesses,
      pendingClaims,
      freeBusinesses,
      proBusinesses,
      premiumBusinesses
    };
  }
}

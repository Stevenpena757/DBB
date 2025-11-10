import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users, businesses, posts, articles, howTos, vendors, vendorProducts, claimRequests, saves,
  forumPosts, forumReplies, pendingBusinesses,
  type User, type InsertUser,
  type Business, type InsertBusiness,
  type Post, type InsertPost,
  type Article, type InsertArticle,
  type HowTo, type InsertHowTo,
  type Vendor, type InsertVendor,
  type VendorProduct, type InsertVendorProduct,
  type ClaimRequest, type InsertClaimRequest,
  type Save, type InsertSave,
  type ForumPost, type InsertForumPost,
  type ForumReply, type InsertForumReply,
  type PendingBusiness, type InsertPendingBusiness
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

  async getBusinessesClaimedByUser(userId: number): Promise<Pick<Business, 'id' | 'name'>[]> {
    return db.select({ id: businesses.id, name: businesses.name }).from(businesses).where(eq(businesses.claimedBy, userId));
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

  // ============ FORUM METHODS ============
  async getAllForumPosts(type?: string, category?: string): Promise<ForumPost[]> {
    let query = db.select().from(forumPosts);
    
    if (type && category) {
      query = query.where(and(eq(forumPosts.type, type), eq(forumPosts.category, category))) as any;
    } else if (type) {
      query = query.where(eq(forumPosts.type, type)) as any;
    } else if (category) {
      query = query.where(eq(forumPosts.category, category)) as any;
    }
    
    return query.orderBy(desc(forumPosts.createdAt)) as any;
  }

  async getForumPostById(id: number): Promise<ForumPost | undefined> {
    const result = await db.select().from(forumPosts).where(eq(forumPosts.id, id)).limit(1);
    return result[0];
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const result = await db.insert(forumPosts).values(post).returning();
    return result[0];
  }

  async updateForumPost(id: number, updates: Partial<InsertForumPost>): Promise<ForumPost | undefined> {
    const result = await db.update(forumPosts).set(updates).where(eq(forumPosts.id, id)).returning();
    return result[0];
  }

  async upvoteForumPost(id: number): Promise<ForumPost | undefined> {
    const post = await this.getForumPostById(id);
    if (post) {
      const result = await db.update(forumPosts).set({ upvotes: post.upvotes + 1 }).where(eq(forumPosts.id, id)).returning();
      return result[0];
    }
    return undefined;
  }

  async incrementForumPostViews(id: number): Promise<void> {
    const post = await this.getForumPostById(id);
    if (post) {
      await db.update(forumPosts).set({ viewCount: post.viewCount + 1 }).where(eq(forumPosts.id, id));
    }
  }

  async getRepliesByPostId(postId: number): Promise<ForumReply[]> {
    return db.select().from(forumReplies).where(eq(forumReplies.postId, postId)).orderBy(desc(forumReplies.createdAt));
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const result = await db.insert(forumReplies).values(reply).returning();
    
    const post = await this.getForumPostById(reply.postId);
    if (post) {
      await db.update(forumPosts).set({ replyCount: post.replyCount + 1 }).where(eq(forumPosts.id, reply.postId));
    }
    
    return result[0];
  }

  async upvoteForumReply(id: number): Promise<ForumReply | undefined> {
    const reply = await db.select().from(forumReplies).where(eq(forumReplies.id, id)).limit(1);
    if (reply[0]) {
      const result = await db.update(forumReplies).set({ upvotes: reply[0].upvotes + 1 }).where(eq(forumReplies.id, id)).returning();
      return result[0];
    }
    return undefined;
  }

  async acceptAnswer(replyId: number, postId: number): Promise<void> {
    await db.update(forumReplies).set({ isAcceptedAnswer: false }).where(eq(forumReplies.postId, postId));
    
    await db.update(forumReplies).set({ isAcceptedAnswer: true }).where(eq(forumReplies.id, replyId));
    
    await db.update(forumPosts).set({ hasAcceptedAnswer: true }).where(eq(forumPosts.id, postId));
  }
  
  // Pending Businesses
  async getAllPendingBusinesses(): Promise<PendingBusiness[]> {
    return await db.select().from(pendingBusinesses)
      .where(eq(pendingBusinesses.status, 'pending'))
      .orderBy(desc(pendingBusinesses.createdAt));
  }
  
  async getPendingBusinessById(id: number): Promise<PendingBusiness | undefined> {
    const results = await db.select().from(pendingBusinesses).where(eq(pendingBusinesses.id, id)).limit(1);
    return results[0];
  }
  
  async createPendingBusiness(business: InsertPendingBusiness): Promise<PendingBusiness> {
    const results = await db.insert(pendingBusinesses).values(business).returning();
    return results[0];
  }
  
  async approvePendingBusiness(id: number, reviewedBy: number, reviewNotes?: string): Promise<Business> {
    const pending = await this.getPendingBusinessById(id);
    if (!pending) {
      throw new Error('Pending business not found');
    }
    
    // Check if already processed
    if (pending.status !== 'pending') {
      throw new Error(`Cannot approve: listing is already ${pending.status}`);
    }
    
    // Create the business from pending data
    const newBusiness: InsertBusiness = {
      name: pending.name,
      description: pending.description,
      category: pending.category,
      location: pending.location,
      address: pending.address,
      phone: pending.phone,
      website: pending.website,
      imageUrl: pending.imageUrl,
      additionalImages: pending.additionalImages,
      services: pending.services,
      instagramHandle: pending.instagramHandle,
      tiktokHandle: pending.tiktokHandle,
      facebookUrl: pending.facebookUrl,
      isClaimed: pending.submittedBy ? true : false,
      claimedBy: pending.submittedBy,
      featured: false,
    };
    
    const businessResults = await db.insert(businesses).values(newBusiness).returning();
    const newBusinessRecord = businessResults[0];
    
    // Update pending business status
    await db.update(pendingBusinesses)
      .set({
        status: 'approved',
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || null,
      })
      .where(eq(pendingBusinesses.id, id));
    
    return newBusinessRecord;
  }
  
  async rejectPendingBusiness(id: number, reviewedBy: number, reviewNotes: string): Promise<PendingBusiness | undefined> {
    const pending = await this.getPendingBusinessById(id);
    if (!pending) {
      throw new Error('Pending business not found');
    }
    
    // Check if already processed
    if (pending.status !== 'pending') {
      throw new Error(`Cannot reject: listing is already ${pending.status}`);
    }
    
    const results = await db.update(pendingBusinesses)
      .set({
        status: 'rejected',
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes,
      })
      .where(eq(pendingBusinesses.id, id))
      .returning();
    
    return results[0];
  }
}

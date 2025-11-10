import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Categories for DFW Health, Beauty & Aesthetics
export const categories = [
  "Hair Salon",
  "Nail Salon", 
  "Med Spa",
  "Medical Aesthetics",
  "Dermatology",
  "Plastic Surgery",
  "Massage Therapy",
  "Wellness Spa",
  "Fitness Studio",
  "Yoga Studio",
  "Beauty Supply",
  "Skincare",
  "Makeup Artist",
  "Lash & Brow",
  "Barbershop",
  "Tanning Salon",
] as const;

export const dfwLocations = [
  "Dallas",
  "Fort Worth",
  "Plano",
  "Irving",
  "Garland",
  "Arlington",
  "McKinney",
  "Frisco",
  "Richardson",
  "Grand Prairie",
  "Denton",
  "Carrollton",
  "Allen",
  "Lewisville",
  "Flower Mound",
] as const;

// Subscription tiers for monetization
export const subscriptionTiers = ["free", "pro", "premium"] as const;

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - for authentication via Replit Auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").notNull().unique(), // From Replit Auth
  username: text("username").notNull(),
  email: text("email"),
  profileImage: text("profile_image"),
  role: text("role").default("user").notNull(), // "user", "business_owner", "admin"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type UserWithClaimedBusinesses = User & {
  claimedBusinesses: Array<{ id: number; name: string }>;
};
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;

// Businesses table
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  services: text("services").array(), // List of services offered
  rating: integer("rating").default(0).notNull(), // Average rating (0-5 scale, store as 0-50 for decimal precision)
  reviewCount: integer("review_count").default(0).notNull(),
  isClaimed: boolean("is_claimed").default(false).notNull(),
  claimedBy: integer("claimed_by").references(() => users.id),
  instagramHandle: text("instagram_handle"),
  tiktokHandle: text("tiktok_handle"),
  facebookUrl: text("facebook_url"),
  featured: boolean("featured").default(false).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  // Monetization fields
  subscriptionTier: text("subscription_tier").default("free").notNull(), // "free", "pro", "premium"
  isSponsored: boolean("is_sponsored").default(false).notNull(),
  sponsoredUntil: timestamp("sponsored_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Business = typeof businesses.$inferSelect;
export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  upvotes: true,
  rating: true,
  reviewCount: true,
  subscriptionTier: true,
  isSponsored: true,
  sponsoredUntil: true,
  createdAt: true,
});
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

// Pending Businesses table - for new listings awaiting approval
export const pendingBusinesses = pgTable("pending_businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  services: text("services").array(),
  instagramHandle: text("instagram_handle"),
  tiktokHandle: text("tiktok_handle"),
  facebookUrl: text("facebook_url"),
  submittedBy: integer("submitted_by").references(() => users.id),
  status: text("status").default("pending").notNull(), // "pending", "approved", "rejected"
  reviewNotes: text("review_notes"), // Admin notes about approval/rejection
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PendingBusiness = typeof pendingBusinesses.$inferSelect;
export const insertPendingBusinessSchema = createInsertSchema(pendingBusinesses).omit({
  id: true,
  status: true,
  reviewNotes: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
});
export type InsertPendingBusiness = z.infer<typeof insertPendingBusinessSchema>;

// Posts (social feed) table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull(), // "post", "article", "how-to"
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  createdAt: true,
});
export type InsertPost = z.infer<typeof insertPostSchema>;

// Articles table (FREE visibility content)
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  views: integer("views").default(0).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  views: true,
  upvotes: true,
  createdAt: true,
});
export type InsertArticle = z.infer<typeof insertArticleSchema>;

// How-tos table (step-by-step guides for FREE visibility)
export const howTos = pgTable("how_tos", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").notNull(), // Array of {step: number, title: string, content: string}
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  views: integer("views").default(0).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HowTo = typeof howTos.$inferSelect;
export const insertHowToSchema = createInsertSchema(howTos).omit({
  id: true,
  views: true,
  upvotes: true,
  createdAt: true,
});
export type InsertHowTo = z.infer<typeof insertHowToSchema>;

// Vendors/Suppliers table (marketplace for inventory)
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "Equipment", "Products", "Supplies", etc.
  imageUrl: text("image_url").notNull(),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  featured: boolean("featured").default(false).notNull(),
  // Monetization: Commission rate for marketplace transactions
  commissionRate: integer("commission_rate").default(15).notNull(), // Percentage (e.g., 15 = 15%)
  subscriptionTier: text("subscription_tier").default("free").notNull(), // "free", "pro", "premium"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Vendor = typeof vendors.$inferSelect;
export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  commissionRate: true,
  subscriptionTier: true,
  createdAt: true,
});
export type InsertVendor = z.infer<typeof insertVendorSchema>;

// Vendor Products table
export const vendorProducts = pgTable("vendor_products", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // Store as text for flexibility
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VendorProduct = typeof vendorProducts.$inferSelect;
export const insertVendorProductSchema = createInsertSchema(vendorProducts).omit({
  id: true,
  createdAt: true,
});
export type InsertVendorProduct = z.infer<typeof insertVendorProductSchema>;

// Business claim requests
export const claimRequests = pgTable("claim_requests", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  userId: integer("user_id").notNull().references(() => users.id),
  claimantName: text("claimant_name").notNull(),
  claimantEmail: text("claimant_email").notNull(),
  claimantPhone: text("claimant_phone").notNull(),
  message: text("message").notNull(),
  proofDocumentUrl: text("proof_document_url"), // URL to uploaded proof document (utility bill, business license, etc.)
  status: text("status").default("pending").notNull(), // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ClaimRequest = typeof claimRequests.$inferSelect;
export const insertClaimRequestSchema = createInsertSchema(claimRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertClaimRequest = z.infer<typeof insertClaimRequestSchema>;

// User saves (saved businesses, articles, etc.)
export const saves = pgTable("saves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Authenticated users
  itemType: text("item_type").notNull(), // "business", "article", "how-to", "product"
  itemId: integer("item_id").notNull(),
  sessionId: text("session_id"), // For non-authenticated users (optional)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Save = typeof saves.$inferSelect;
export const insertSaveSchema = createInsertSchema(saves).omit({
  id: true,
  createdAt: true,
});
export type InsertSave = z.infer<typeof insertSaveSchema>;

// Forum posts (Q&A and Tips)
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessId: integer("business_id").references(() => businesses.id), // Optional - if posted by a business
  type: text("type").notNull(), // "question" or "tip"
  category: text("category").notNull(), // "Hair", "Skin", "Makeup", "Business Tips", etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  replyCount: integer("reply_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  hasAcceptedAnswer: boolean("has_accepted_answer").default(false).notNull(), // For questions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  upvotes: true,
  replyCount: true,
  viewCount: true,
  hasAcceptedAnswer: true,
  createdAt: true,
});
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

// Forum replies (answers and comments)
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id),
  userId: integer("user_id").references(() => users.id),
  businessId: integer("business_id").references(() => businesses.id), // Optional - if posted by a business
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  isAcceptedAnswer: boolean("is_accepted_answer").default(false).notNull(), // For question answers
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  upvotes: true,
  isAcceptedAnswer: true,
  createdAt: true,
});
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

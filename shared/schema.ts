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

// Admin-only business update schema (for subscription tiers, sponsored status, etc.)
export const businessAdminUpdateSchema = createInsertSchema(businesses).pick({
  subscriptionTier: true,
  featured: true,
  isSponsored: true,
  sponsoredUntil: true,
}).partial();
export type BusinessAdminUpdate = z.infer<typeof businessAdminUpdateSchema>;

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

// Stripe Subscriptions - track payment status for businesses
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
  tier: text("tier").notNull(), // "pro", "premium"
  status: text("status").notNull(), // "active", "canceled", "past_due", "incomplete"
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Abuse Reports - for reporting spam, inappropriate content, fake listings
export const abuseReports = pgTable("abuse_reports", {
  id: serial("id").primaryKey(),
  reportedBy: integer("reported_by").notNull().references(() => users.id),
  itemType: text("item_type").notNull(), // "business", "article", "how_to", "post", "forum_post", "forum_reply", "user"
  itemId: integer("item_id").notNull(),
  category: text("category").notNull(), // "spam", "harassment", "fake_listing", "inappropriate_content", "copyright", "other"
  description: text("description").notNull(),
  status: text("status").default("pending").notNull(), // "pending", "reviewing", "resolved", "dismissed"
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  resolution: text("resolution"), // "content_removed", "user_warned", "user_banned", "no_action", "other"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export type AbuseReport = typeof abuseReports.$inferSelect;
export const insertAbuseReportSchema = createInsertSchema(abuseReports).omit({
  id: true,
  status: true,
  reviewedBy: true,
  reviewNotes: true,
  resolution: true,
  createdAt: true,
  resolvedAt: true,
});
export type InsertAbuseReport = z.infer<typeof insertAbuseReportSchema>;

// User Bans/Suspensions - track banned and suspended users
export const userBans = pgTable("user_bans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bannedBy: integer("banned_by").notNull().references(() => users.id),
  type: text("type").notNull(), // "ban", "suspend"
  reason: text("reason").notNull(),
  duration: integer("duration"), // Duration in days (null = permanent ban)
  expiresAt: timestamp("expires_at"), // null for permanent bans
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserBan = typeof userBans.$inferSelect;
export const insertUserBanSchema = createInsertSchema(userBans).omit({
  id: true,
  isActive: true,
  createdAt: true,
});
export type InsertUserBan = z.infer<typeof insertUserBanSchema>;

// Admin Activity Log - audit trail for compliance
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(), // "approve_business", "reject_business", "ban_user", "update_subscription", etc.
  targetType: text("target_type"), // "business", "user", "subscription", "abuse_report", etc.
  targetId: integer("target_id"),
  details: jsonb("details"), // Additional context (old values, new values, etc.)
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export const insertAdminActivityLogSchema = createInsertSchema(adminActivityLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;

// Security Events - track login failures, rate limit violations, suspicious activity
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // null if user not authenticated
  eventType: text("event_type").notNull(), // "failed_login", "rate_limit_exceeded", "suspicious_activity", "account_locked"
  severity: text("severity").notNull(), // "low", "medium", "high", "critical"
  description: text("description").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Additional event data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SecurityEvent = typeof securityEvents.$inferSelect;
export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;

// AI Moderation Queue - track AI-flagged content for review
export const aiModerationQueue = pgTable("ai_moderation_queue", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(), // "business", "article", "how_to", "post", "forum_post", "forum_reply"
  itemId: integer("item_id").notNull(),
  flags: text("flags").array().notNull(), // Array of issues detected: ["spam", "inappropriate", "low_quality"]
  aiScore: integer("ai_score").notNull(), // Confidence score 0-100
  aiReasoning: text("ai_reasoning").notNull(), // AI explanation of flags
  status: text("status").default("pending").notNull(), // "pending", "approved", "rejected", "auto_approved"
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

export type AiModerationQueue = typeof aiModerationQueue.$inferSelect;
export const insertAiModerationQueueSchema = createInsertSchema(aiModerationQueue).omit({
  id: true,
  status: true,
  reviewedBy: true,
  reviewNotes: true,
  createdAt: true,
  reviewedAt: true,
});
export type InsertAiModerationQueue = z.infer<typeof insertAiModerationQueueSchema>;

// Business Leads - track inquiries from lead capture forms
// businessId is optional to support general recommendations from forum
export const businessLeads = pgTable("business_leads", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id), // Optional for general forum leads
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  service: text("service"), // Specific service they're interested in
  preferredContact: text("preferred_contact"), // "email", "phone", "text"
  source: text("source").default("profile_page").notNull(), // "profile_page", "quiz_match", "search", "forum"
  status: text("status").default("new").notNull(), // "new", "contacted", "converted", "not_interested"
  notes: text("notes"), // Business owner notes about this lead
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BusinessLead = typeof businessLeads.$inferSelect;
export const insertBusinessLeadSchema = createInsertSchema(businessLeads)
  .omit({
    id: true,
    status: true,
    notes: true,
    createdAt: true,
  })
  .extend({
    businessId: z.number().optional(), // Make businessId optional for general forum leads
  });
export type InsertBusinessLead = z.infer<typeof insertBusinessLeadSchema>;

// Quiz Submissions - Beauty Match Quiz responses
export const quizSubmissions = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Optional - anonymous users allowed
  sessionId: text("session_id"), // For tracking anonymous submissions
  responses: jsonb("responses").notNull(), // All quiz answers as JSON
  matchedBusinessIds: integer("matched_business_ids").array().notNull(), // Top matches
  matchScores: jsonb("match_scores"), // Score breakdown for each match
  location: text("location"), // DFW area preference from quiz
  services: text("services").array(), // Services they're interested in
  budget: text("budget"), // Budget range from quiz
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizSubmission = typeof quizSubmissions.$inferSelect;
export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissions).omit({
  id: true,
  createdAt: true,
});
export type InsertQuizSubmission = z.infer<typeof insertQuizSubmissionSchema>;

// Analytics Events - track interactions for business insights
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  eventType: text("event_type").notNull(), // "profile_view", "phone_click", "website_click", "direction_click", "lead_form_view", "lead_form_submit", "quiz_match_view"
  userId: integer("user_id").references(() => users.id), // Optional - track logged in users
  sessionId: text("session_id"), // For anonymous tracking
  metadata: jsonb("metadata"), // Additional context (referrer, device type, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("analytics_business_idx").on(table.businessId),
  index("analytics_created_idx").on(table.createdAt),
]);

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

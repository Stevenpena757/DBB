import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  isClaimed: boolean("is_claimed").default(false).notNull(),
  claimedBy: integer("claimed_by"),
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
  subscriptionTier: true,
  isSponsored: true,
  sponsoredUntil: true,
  createdAt: true,
});
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

// Posts (social feed) table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
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
  claimantName: text("claimant_name").notNull(),
  claimantEmail: text("claimant_email").notNull(),
  claimantPhone: text("claimant_phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(), // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ClaimRequest = typeof claimRequests.$inferSelect;
export const insertClaimRequestSchema = createInsertSchema(claimRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertClaimRequest = z.infer<typeof insertClaimRequestSchema>;

// User saves (saved businesses, articles, etc.)
export const saves = pgTable("saves", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(), // "business", "article", "how-to", "product"
  itemId: integer("item_id").notNull(),
  sessionId: text("session_id").notNull(), // For non-authenticated users
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Save = typeof saves.$inferSelect;
export const insertSaveSchema = createInsertSchema(saves).omit({
  id: true,
  createdAt: true,
});
export type InsertSave = z.infer<typeof insertSaveSchema>;

import { 
  type User, type InsertUser,
  type Business, type InsertBusiness, type BusinessAdminUpdate,
  type Post, type InsertPost,
  type Article, type InsertArticle,
  type HowTo, type InsertHowTo,
  type Vendor, type InsertVendor,
  type VendorProduct, type InsertVendorProduct,
  type ClaimRequest, type InsertClaimRequest,
  type Save, type InsertSave,
  type ForumPost, type InsertForumPost,
  type ForumReply, type InsertForumReply,
  type PendingBusiness, type InsertPendingBusiness,
  type Subscription, type InsertSubscription,
  type AbuseReport, type InsertAbuseReport,
  type UserBan, type InsertUserBan,
  type AdminActivityLog, type InsertAdminActivityLog,
  type SecurityEvent, type InsertSecurityEvent,
  type AiModerationQueue, type InsertAiModerationQueue,
  type BusinessLead, type InsertBusinessLead,
  type QuizSubmission, type InsertQuizSubmission,
  type AnalyticsEvent, type InsertAnalyticsEvent,
  type BeautyBook, type InsertBeautyBook,
  type UserBusinessFollow, type InsertUserBusinessFollow,
  type UserGoal, type InsertUserGoal,
  type UserPromotion, type InsertUserPromotion,
  type BusinessReview, type InsertBusinessReview
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserById(id: number): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Businesses
  getAllBusinesses(): Promise<Business[]>;
  searchBusinesses(query: string, category?: string, location?: string): Promise<Business[]>;
  getBusinessById(id: number): Promise<Business | undefined>;
  getBusinessesByCategory(category: string): Promise<Business[]>;
  getBusinessesByLocation(location: string): Promise<Business[]>;
  getFeaturedBusinesses(): Promise<Business[]>;
  getBusinessesClaimedByUser(userId: number): Promise<Pick<Business, 'id' | 'name'>[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  updateBusinessAdmin(id: number, updates: BusinessAdminUpdate): Promise<Business | undefined>;
  
  // Posts
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostsByBusinessId(businessId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Articles
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticlesByBusinessId(businessId: number): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getArticlesByUserId(userId: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  incrementArticleViews(id: number): Promise<void>;
  
  // How-Tos
  getAllHowTos(): Promise<HowTo[]>;
  getHowToById(id: number): Promise<HowTo | undefined>;
  getHowTosByBusinessId(businessId: number): Promise<HowTo[]>;
  getHowTosByUserId(userId: number): Promise<HowTo[]>;
  createHowTo(howTo: InsertHowTo): Promise<HowTo>;
  
  // Vendors
  getAllVendors(): Promise<Vendor[]>;
  getVendorById(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  
  // Vendor Products
  getProductsByVendorId(vendorId: number): Promise<VendorProduct[]>;
  createVendorProduct(product: InsertVendorProduct): Promise<VendorProduct>;
  
  // Claim Requests
  createClaimRequest(request: InsertClaimRequest): Promise<ClaimRequest>;
  getClaimRequestsByBusinessId(businessId: number): Promise<ClaimRequest[]>;
  getClaimRequestsByUserId(userId: number): Promise<ClaimRequest[]>;
  updateClaimRequest(id: number, status: string): Promise<ClaimRequest | undefined>;
  approveClaimRequest(id: number): Promise<void>;
  
  // Saves
  getSavesBySessionId(sessionId: string): Promise<Save[]>;
  getSavesByUserId(userId: number): Promise<Save[]>;
  createSave(save: InsertSave): Promise<Save>;
  deleteSave(id: number): Promise<void>;
  deleteSaveByUserAndItem(userId: number | null, sessionId: string | null, itemType: string, itemId: number): Promise<void>;
  
  // Mixed Feed (for home page)
  getMixedFeed(): Promise<Array<Business | Article | HowTo>>;
  
  // Upvoting
  upvoteBusiness(id: number): Promise<Business | undefined>;
  upvoteArticle(id: number): Promise<Article | undefined>;
  upvoteHowTo(id: number): Promise<HowTo | undefined>;
  
  // Admin Methods
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;
  deleteBusiness(id: number): Promise<void>;
  getAllClaimRequests(): Promise<ClaimRequest[]>;
  getPlatformStats(): Promise<{
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
  }>;
  
  // Forum Methods
  getAllForumPosts(type?: string, category?: string): Promise<ForumPost[]>;
  getForumPostById(id: number): Promise<ForumPost | undefined>;
  getForumPostsByUserId(userId: number): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, post: Partial<InsertForumPost>): Promise<ForumPost | undefined>;
  upvoteForumPost(id: number): Promise<ForumPost | undefined>;
  incrementForumPostViews(id: number): Promise<void>;
  
  getRepliesByPostId(postId: number): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  upvoteForumReply(id: number): Promise<ForumReply | undefined>;
  acceptAnswer(replyId: number, postId: number): Promise<void>;
  
  // Pending Businesses
  getAllPendingBusinesses(): Promise<PendingBusiness[]>;
  getPendingBusinessById(id: number): Promise<PendingBusiness | undefined>;
  createPendingBusiness(business: InsertPendingBusiness): Promise<PendingBusiness>;
  approvePendingBusiness(id: number, reviewedBy: number, reviewNotes?: string): Promise<Business>;
  rejectPendingBusiness(id: number, reviewedBy: number, reviewNotes: string): Promise<PendingBusiness | undefined>;
  
  // Subscriptions (Stripe)
  getSubscriptionByBusinessId(businessId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<Subscription | undefined>;
  getAllSubscriptions(): Promise<Subscription[]>;
  getAllSubscriptionsWithBusiness(): Promise<Array<{ subscription: Subscription; business: Business }>>;
  
  // Abuse Reports
  createAbuseReport(report: InsertAbuseReport): Promise<AbuseReport>;
  getAllAbuseReports(): Promise<AbuseReport[]>;
  getAbuseReportById(id: number): Promise<AbuseReport | undefined>;
  updateAbuseReportStatus(id: number, status: string, reviewedBy: number, reviewNotes?: string, resolution?: string): Promise<AbuseReport | undefined>;
  
  // User Bans
  createUserBan(ban: InsertUserBan): Promise<UserBan>;
  getUserActiveBans(userId: number): Promise<UserBan[]>;
  getAllActiveBans(): Promise<UserBan[]>;
  deactivateUserBan(id: number): Promise<UserBan | undefined>;
  
  // Admin Activity Logs
  createAdminActivityLog(log: InsertAdminActivityLog): Promise<AdminActivityLog>;
  getAdminActivityLogs(limit?: number): Promise<AdminActivityLog[]>;
  
  // Security Events
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
  getSecurityEvents(limit?: number, severity?: string): Promise<SecurityEvent[]>;
  
  // AI Moderation Queue
  createAiModerationQueueItem(item: InsertAiModerationQueue): Promise<AiModerationQueue>;
  getAllAiModerationQueueItems(status?: string): Promise<AiModerationQueue[]>;
  updateAiModerationQueueItem(id: number, status: string, reviewedBy?: number, reviewNotes?: string): Promise<AiModerationQueue | undefined>;
  
  // Business Leads
  createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  getBusinessLeadsByBusinessId(businessId: number): Promise<BusinessLead[]>;
  getAllBusinessLeads(): Promise<BusinessLead[]>;
  
  // Quiz Submissions
  createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission>;
  getQuizSubmissionById(id: number): Promise<QuizSubmission | undefined>;
  getAllQuizSubmissions(): Promise<QuizSubmission[]>;
  
  // Beauty Books
  createBeautyBook(beautyBook: InsertBeautyBook): Promise<BeautyBook>;
  getBeautyBookById(id: string): Promise<BeautyBook | undefined>;
  getAllBeautyBooks(): Promise<BeautyBook[]>;
  claimBeautyBook(beautyBookId: string, userId: number): Promise<BeautyBook | undefined>;
  getUserActiveBeautyBook(userId: number): Promise<BeautyBook | undefined>;
  
  // Analytics Events
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEventsByBusiness(businessId: number, eventType?: string): Promise<AnalyticsEvent[]>;
  getAllAnalyticsEvents(limit?: number): Promise<AnalyticsEvent[]>;
  
  // User Business Follows
  followBusiness(userId: number, businessId: number): Promise<UserBusinessFollow>;
  unfollowBusiness(userId: number, businessId: number): Promise<void>;
  getUserFollows(userId: number): Promise<UserBusinessFollow[]>;
  getUserFollowsWithBusinesses(userId: number): Promise<Business[]>;
  isFollowing(userId: number, businessId: number): Promise<boolean>;
  getBusinessFollowerCount(businessId: number): Promise<number>;
  
  // User Goals
  createUserGoal(goal: InsertUserGoal): Promise<UserGoal>;
  getUserGoals(userId: number): Promise<UserGoal[]>;
  updateUserGoal(id: number, updates: Partial<InsertUserGoal>): Promise<UserGoal | undefined>;
  completeUserGoal(id: number): Promise<UserGoal | undefined>;
  deleteUserGoal(id: number): Promise<void>;
  
  // User Promotions
  createUserPromotion(promo: InsertUserPromotion): Promise<UserPromotion>;
  getUserPromotions(userId: number, activeOnly?: boolean): Promise<UserPromotion[]>;
  markPromotionUsed(id: number): Promise<UserPromotion | undefined>;
  deleteUserPromotion(id: number): Promise<void>;
  
  // User Profile Data
  getUserBeautyBooks(userId: number): Promise<BeautyBook[]>;
  
  // Business Reviews
  createBusinessReview(review: InsertBusinessReview): Promise<BusinessReview>;
  getReviewsByBusiness(businessId: number): Promise<BusinessReview[]>;
  getPositiveReviewsByBusiness(businessId: number): Promise<BusinessReview[]>;
  getBusinessFollowers(businessId: number): Promise<UserBusinessFollow[]>;
  getClaimedBusinessesByUser(userId: number): Promise<Business[]>;
}

export class MemStorage implements IStorage {
  private businesses: Map<number, Business>;
  private posts: Map<number, Post>;
  private articles: Map<number, Article>;
  private howTos: Map<number, HowTo>;
  private vendors: Map<number, Vendor>;
  private vendorProducts: Map<number, VendorProduct>;
  private claimRequests: Map<number, ClaimRequest>;
  private saves: Map<number, Save>;
  
  private businessIdCounter: number;
  private postIdCounter: number;
  private articleIdCounter: number;
  private howToIdCounter: number;
  private vendorIdCounter: number;
  private vendorProductIdCounter: number;
  private claimRequestIdCounter: number;
  private saveIdCounter: number;

  constructor() {
    this.businesses = new Map();
    this.posts = new Map();
    this.articles = new Map();
    this.howTos = new Map();
    this.vendors = new Map();
    this.vendorProducts = new Map();
    this.claimRequests = new Map();
    this.saves = new Map();
    
    this.businessIdCounter = 1;
    this.postIdCounter = 1;
    this.articleIdCounter = 1;
    this.howToIdCounter = 1;
    this.vendorIdCounter = 1;
    this.vendorProductIdCounter = 1;
    this.claimRequestIdCounter = 1;
    this.saveIdCounter = 1;
    
    this.seedData();
  }

  private seedData() {
    // Real DFW Beauty, Aesthetics, and Wellness businesses
    const sampleBusinesses: InsertBusiness[] = [
      {
        name: "Enlighten MD",
        description: "Premier med spa offering laser treatments, injectables, and advanced aesthetic procedures in North Dallas",
        category: "Med Spa",
        location: "Dallas",
        address: "5232 Forest Lane, Suite 170, Dallas, TX 75244",
        phone: "214-964-0860",
        website: "https://www.enlightenmd.com/",
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        isClaimed: true,
        featured: true,
      },
      {
        name: "Advanced Skin Fitness Medical Spa",
        description: "Expert med spa services including laser treatments, CoolSculpting, and advanced skincare",
        category: "Med Spa",
        location: "Dallas",
        address: "9201 N Central Expy, Ste 210, Dallas, TX 75231",
        phone: "(214) 521-5277",
        website: "https://advancedskinfitness.com/",
        imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
        isClaimed: true,
        featured: true,
      },
      {
        name: "North Dallas Dermatology Associates",
        description: "Comprehensive cosmetic dermatology and laser services for radiant, healthy skin",
        category: "Dermatology",
        location: "Dallas",
        address: "8144 Walnut Hill Ln, Suite 1300, Dallas, TX 75231",
        phone: "(214) 420-7070",
        website: "https://northdallasderm.com/",
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "SkinSpirit – West Village (Uptown)",
        description: "Modern med spa in Uptown Dallas specializing in injectables and advanced skincare treatments",
        category: "Med Spa",
        location: "Dallas",
        address: "West Village, Dallas, TX",
        phone: "(469) 259-2800",
        website: "https://www.skinspirit.com/locations/west-village",
        imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800",
        isClaimed: true,
        featured: false,
      },
      {
        name: "Lemmon Avenue Plastic Surgery & Laser Center",
        description: "Expert plastic surgery and laser treatments combining medical precision with aesthetic artistry",
        category: "Plastic Surgery",
        location: "Dallas",
        address: "2801 Lemmon Avenue W, Suite 300, Dallas, TX 75204",
        phone: "214-702-0707",
        website: "https://www.lemmonavenueplasticsurgery.com/",
        imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "Amazing Lash Studio – West Village",
        description: "Premium eyelash extension services in the heart of West Village",
        category: "Lashes",
        location: "Dallas",
        address: "3699 McKinney Ave, Suite 502, Dallas, TX 75204",
        phone: "(469) 904-6290",
        website: "https://www.amazinglashstudio.com/",
        imageUrl: "https://images.unsplash.com/photo-1583001931096-959e3f5d5d1a?w=800",
        isClaimed: true,
        featured: false,
      },
      {
        name: "The Lash Lounge – Lakewood",
        description: "Expert lash extensions and beauty services in East Dallas Lakewood area",
        category: "Lashes",
        location: "Dallas",
        address: "6465 E Mockingbird Ln, #372, Dallas, TX 75214",
        phone: "214-239-0331",
        website: "https://www.thelashlounge.com/tx-dallas-lakewood/",
        imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800",
        isClaimed: true,
        featured: false,
      },
      {
        name: "The Lash Lounge – Park Cities",
        description: "Luxurious lash extension services in the prestigious Park Cities neighborhood",
        category: "Lashes",
        location: "Dallas",
        address: "5560 W Lovers Ln, Ste 255, Dallas, TX 75209",
        phone: "214-432-1142",
        website: "https://www.thelashlounge.com/tx-dallas-park-cities/",
        imageUrl: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "Verbena Parlor + Social House",
        description: "Boutique nail salon and social experience in the Dallas Design District",
        category: "Nail Salon",
        location: "Dallas",
        address: "2626 Howell St, #166, Dallas, TX 75204",
        phone: "214-433-7359",
        website: "https://www.verbenaparlor.com/",
        imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
        isClaimed: true,
        featured: true,
      },
      {
        name: "Ideal Image – West Village",
        description: "Premier med spa offering laser hair removal, injectables, and body contouring",
        category: "Med Spa",
        location: "Dallas",
        address: "3839 McKinney Ave, Suite 110, Dallas, TX 75204",
        phone: "469-784-9932",
        website: "https://www.idealimage.com/locations/texas/dallas-west-village",
        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "Milan Laser Hair Removal – Addison",
        description: "Specialized laser hair removal services with advanced technology",
        category: "Laser Hair Removal",
        location: "Dallas",
        address: "5225 Belt Line Rd, Dallas, TX 75254",
        phone: "469-312-2993",
        website: "https://milanlaserdallas.com/locations/dallas/",
        imageUrl: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=800",
        isClaimed: true,
        featured: false,
      },
      {
        name: "Milan Laser Hair Removal – Northeast Dallas",
        description: "Expert laser hair removal in Northeast Dallas with proven results",
        category: "Laser Hair Removal",
        location: "Dallas",
        address: "6464 E Northwest Hwy, Ste 345, Dallas, TX 75214",
        phone: "(469) 902-2916",
        website: "https://milanlaser.com/locations/tx/dallas/6464-e-nw-hwy",
        imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "MINT dentistry – Uptown",
        description: "Upscale cosmetic dentistry and teeth whitening in the heart of Uptown Dallas",
        category: "Cosmetic Dentistry",
        location: "Dallas",
        address: "2520 Fairmount St, Suite 100, Dallas, TX 75201",
        phone: "469-440-7149",
        website: "https://mintdentistry.com/dentist/dfw/uptown",
        imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
        isClaimed: true,
        featured: false,
      },
      {
        name: "We Whiten – Preston Center",
        description: "Dedicated teeth whitening studio delivering brilliant smiles",
        category: "Teeth Whitening",
        location: "Dallas",
        address: "7700 W Northwest Hwy, Dallas, TX 75225",
        phone: "(972) 649-0459",
        imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "Laced by Lonice Spa & Boutique",
        description: "Multi-service aesthetics boutique offering facials, lashes, and whitening treatments",
        category: "Aesthetics Spa",
        location: "Dallas",
        address: "2504 Kimsey Dr, Dallas, TX 75235",
        website: "https://www.lacedbylonice.com/",
        imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        isClaimed: true,
        featured: false,
      },
    ];

    sampleBusinesses.forEach((business, index) => {
      const id = this.businessIdCounter++;
      // Give some businesses initial upvotes to show community engagement
      const upvotes = index < 5 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 10);
      
      // Mock subscription tiers for monetization demo
      let subscriptionTier: "free" | "pro" | "premium" = "free";
      let isSponsored = false;
      let sponsoredUntil: Date | null = null;
      
      // Make some businesses Premium
      if ([0, 5].includes(index)) {
        subscriptionTier = "premium";
      }
      // Make some businesses Pro
      else if ([1, 2, 6, 9].includes(index)) {
        subscriptionTier = "pro";
      }
      
      // Make one Premium business sponsored
      if (index === 0) {
        isSponsored = true;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30); // Sponsored for 30 days
        sponsoredUntil = futureDate;
      }
      
      // Mock reviews and ratings (rating stored as 0-50, representing 0.0-5.0 stars)
      const reviewCount = Math.floor(Math.random() * 100) + 10;
      const rating = Math.floor(Math.random() * 15) + 35; // 3.5 to 5.0 stars
      
      // Mock services based on business category
      const serviceSets: Record<string, string[]> = {
        "Med Spa": ["Botox & Fillers", "Laser Hair Removal", "Chemical Peels", "Microneedling", "IV Therapy"],
        "Dermatology": ["Acne Treatment", "Skin Cancer Screening", "Cosmetic Dermatology", "Laser Treatments"],
        "Plastic Surgery": ["Rhinoplasty", "Breast Augmentation", "Liposuction", "Facelift", "Body Contouring"],
        "Lashes": ["Classic Lashes", "Volume Lashes", "Lash Lift & Tint", "Brow Shaping"],
        "Nail Salon": ["Manicures", "Pedicures", "Gel Nails", "Nail Art", "Spa Treatments"],
        "Laser Hair Removal": ["Full Body", "Face", "Legs", "Brazilian", "Underarms"],
        "Cosmetic Dentistry": ["Teeth Whitening", "Veneers", "Invisalign", "Smile Makeover"],
        "Teeth Whitening": ["In-Office Whitening", "Take-Home Kits", "Maintenance Plans"],
        "Aesthetics Spa": ["Facials", "Lash Extensions", "Waxing", "Teeth Whitening", "Body Treatments"],
      };
      
      const services = serviceSets[business.category as keyof typeof serviceSets] || ["Consultation", "Treatments"];
      
      // Add additional images for carousel
      const additionalImages = [
        `https://images.unsplash.com/photo-${1500000000000 + index * 1000000}-0?w=800`,
        `https://images.unsplash.com/photo-${1510000000000 + index * 1000000}-0?w=800`,
        `https://images.unsplash.com/photo-${1520000000000 + index * 1000000}-0?w=800`,
      ];
      
      this.businesses.set(id, { 
        address: null,
        phone: null,
        website: null,
        claimedBy: null,
        instagramHandle: null,
        tiktokHandle: null,
        facebookUrl: null,
        isClaimed: false,
        featured: false,
        ...business, 
        id, 
        upvotes,
        rating,
        reviewCount,
        services,
        additionalImages,
        subscriptionTier,
        isSponsored,
        sponsoredUntil,
        createdAt: new Date() 
      });
    });

    // Seed sample articles
    const sampleArticles: InsertArticle[] = [
      {
        businessId: 1,
        title: "Winter Hair Care: Combat Dryness This Season",
        content: "Winter weather can wreak havoc on your hair. Here are our expert tips...",
        excerpt: "Expert tips to keep your hair healthy during dry winter months",
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        category: "Hair Salon",
      },
      {
        businessId: 2,
        title: "Understanding Botox: What You Need to Know",
        content: "Botox has become one of the most popular aesthetic treatments. Let's break down what it is...",
        excerpt: "Everything you need to know about Botox treatments",
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
        category: "Medical Aesthetics",
      },
    ];

    sampleArticles.forEach(article => {
      const id = this.articleIdCounter++;
      this.articles.set(id, { ...article, id, views: 0, upvotes: 0, createdAt: new Date() });
    });

    // Seed sample vendors for marketplace
    const sampleVendors: InsertVendor[] = [
      {
        name: "BeautyPro Supply Co.",
        description: "Professional beauty equipment and supplies for salons and spas",
        category: "Equipment",
        imageUrl: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=800",
        phone: "(214) 555-0101",
        website: "https://beautyprosupply.example.com",
        email: "sales@beautyprosupply.example.com",
      },
      {
        name: "Elite Aesthetics Distributors",
        description: "Premium skincare products and aesthetic supplies for medical spas",
        category: "Products",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
        phone: "(972) 555-0202",
        website: "https://eliteaesthetics.example.com",
        email: "info@eliteaesthetics.example.com",
      },
      {
        name: "Salon Furniture Direct",
        description: "High-quality salon chairs, stations, and furniture at wholesale prices",
        category: "Furniture",
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        phone: "(469) 555-0303",
        website: "https://salonfurnituredirect.example.com",
        email: "orders@salonfurnituredirect.example.com",
      },
      {
        name: "MedSpa Tools & Tech",
        description: "Advanced laser equipment and medical-grade aesthetic technology",
        category: "Tools",
        imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800",
        phone: "(214) 555-0404",
        website: "https://medspatools.example.com",
        email: "support@medspatools.example.com",
      },
      {
        name: "Professional Beauty Supplies",
        description: "Complete range of hair, nail, and beauty supplies for professionals",
        category: "Supplies",
        imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800",
        phone: "(817) 555-0505",
        website: "https://probeautysupplies.example.com",
        email: "wholesale@probeautysupplies.example.com",
      },
    ];

    sampleVendors.forEach((vendor, index) => {
      const id = this.vendorIdCounter++;
      
      // Mock subscription tiers for vendors
      let subscriptionTier: "free" | "pro" | "premium" = "free";
      let commissionRate = 20; // Default 20% for free tier
      let featured = false;
      
      // Make vendor 2 Premium with lower commission and featured
      if (index === 1) {
        subscriptionTier = "premium";
        commissionRate = 10;
        featured = true;
      }
      // Make vendors 0 and 3 Pro with mid-tier commission
      else if ([0, 3].includes(index)) {
        subscriptionTier = "pro";
        commissionRate = 15;
      }
      
      this.vendors.set(id, {
        website: null,
        phone: null,
        email: null,
        ...vendor,
        id,
        subscriptionTier,
        commissionRate,
        featured,
        createdAt: new Date()
      });
    });
  }

  // Businesses
  async getAllBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values());
  }

  async getBusinessById(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(b => b.category === category);
  }

  async getBusinessesByLocation(location: string): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(b => b.location === location);
  }

  async getFeaturedBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(b => b.featured);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.businessIdCounter++;
    const business: Business = { 
      address: null,
      phone: null,
      website: null,
      additionalImages: null,
      services: null,
      claimedBy: null,
      instagramHandle: null,
      tiktokHandle: null,
      facebookUrl: null,
      isClaimed: false,
      featured: false,
      subscriptionTier: "free",
      isSponsored: false,
      sponsoredUntil: null,
      ...insertBusiness, 
      id,
      upvotes: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date() 
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business | undefined> {
    const business = this.businesses.get(id);
    if (!business) return undefined;
    const updated = { ...business, ...updates };
    this.businesses.set(id, updated);
    return updated;
  }

  // Posts
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByBusinessId(businessId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(p => p.businessId === businessId);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const post: Post = { 
      imageUrl: null,
      ...insertPost, 
      id, 
      likes: 0, 
      createdAt: new Date() 
    };
    this.posts.set(id, post);
    return post;
  }

  // Articles
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticlesByBusinessId(businessId: number): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(a => a.businessId === businessId);
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(a => a.category === category);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleIdCounter++;
    const article: Article = { ...insertArticle, id, views: 0, upvotes: 0, createdAt: new Date() };
    this.articles.set(id, article);
    return article;
  }

  async incrementArticleViews(id: number): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views += 1;
      this.articles.set(id, article);
    }
  }

  // How-Tos
  async getAllHowTos(): Promise<HowTo[]> {
    return Array.from(this.howTos.values());
  }

  async getHowToById(id: number): Promise<HowTo | undefined> {
    return this.howTos.get(id);
  }

  async getHowTosByBusinessId(businessId: number): Promise<HowTo[]> {
    return Array.from(this.howTos.values()).filter(h => h.businessId === businessId);
  }

  async createHowTo(insertHowTo: InsertHowTo): Promise<HowTo> {
    const id = this.howToIdCounter++;
    const howTo: HowTo = { ...insertHowTo, id, views: 0, upvotes: 0, createdAt: new Date() };
    this.howTos.set(id, howTo);
    return howTo;
  }

  // Vendors
  async getAllVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendorById(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.vendorIdCounter++;
    const vendor: Vendor = { 
      website: null,
      phone: null,
      email: null,
      featured: false,
      commissionRate: 15,
      subscriptionTier: "free",
      ...insertVendor, 
      id, 
      createdAt: new Date() 
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  // Vendor Products
  async getProductsByVendorId(vendorId: number): Promise<VendorProduct[]> {
    return Array.from(this.vendorProducts.values()).filter(p => p.vendorId === vendorId);
  }

  async createVendorProduct(insertProduct: InsertVendorProduct): Promise<VendorProduct> {
    const id = this.vendorProductIdCounter++;
    const product: VendorProduct = { 
      inStock: true,
      ...insertProduct, 
      id, 
      createdAt: new Date() 
    };
    this.vendorProducts.set(id, product);
    return product;
  }

  // Claim Requests
  async createClaimRequest(insertRequest: InsertClaimRequest): Promise<ClaimRequest> {
    const id = this.claimRequestIdCounter++;
    const request: ClaimRequest = { ...insertRequest, id, createdAt: new Date() };
    this.claimRequests.set(id, request);
    return request;
  }

  async getClaimRequestsByBusinessId(businessId: number): Promise<ClaimRequest[]> {
    return Array.from(this.claimRequests.values()).filter(r => r.businessId === businessId);
  }

  // Saves
  async getSavesBySessionId(sessionId: string): Promise<Save[]> {
    return Array.from(this.saves.values()).filter(s => s.sessionId === sessionId);
  }

  async createSave(insertSave: InsertSave): Promise<Save> {
    const id = this.saveIdCounter++;
    const save: Save = { ...insertSave, id, createdAt: new Date() };
    this.saves.set(id, save);
    return save;
  }

  async deleteSave(id: number): Promise<void> {
    this.saves.delete(id);
  }

  // Mixed Feed
  async getMixedFeed(): Promise<Array<Business | Article | HowTo>> {
    const businesses = await this.getAllBusinesses();
    const articles = await this.getAllArticles();
    const howTos = await this.getAllHowTos();
    
    const mixed: Array<Business | Article | HowTo> = [
      ...businesses,
      ...articles,
      ...howTos
    ];
    
    // Shuffle for variety
    return mixed.sort(() => Math.random() - 0.5);
  }

  // Upvoting
  async upvoteBusiness(id: number): Promise<Business | undefined> {
    const business = this.businesses.get(id);
    if (!business) return undefined;
    
    const updated = { ...business, upvotes: business.upvotes + 1 };
    this.businesses.set(id, updated);
    return updated;
  }

  async upvoteArticle(id: number): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updated = { ...article, upvotes: article.upvotes + 1 };
    this.articles.set(id, updated);
    return updated;
  }

  async upvoteHowTo(id: number): Promise<HowTo | undefined> {
    const howTo = this.howTos.get(id);
    if (!howTo) return undefined;
    
    const updated = { ...howTo, upvotes: howTo.upvotes + 1 };
    this.howTos.set(id, updated);
    return updated;
  }
}

// Import DbStorage for production use
import { DbStorage } from "./db-storage";

// Export singleton instance - use DbStorage for persistent data
export const storage = new DbStorage();

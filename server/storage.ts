import { 
  type Business, type InsertBusiness,
  type Post, type InsertPost,
  type Article, type InsertArticle,
  type HowTo, type InsertHowTo,
  type Vendor, type InsertVendor,
  type VendorProduct, type InsertVendorProduct,
  type ClaimRequest, type InsertClaimRequest,
  type Save, type InsertSave
} from "@shared/schema";

export interface IStorage {
  // Businesses
  getAllBusinesses(): Promise<Business[]>;
  getBusinessById(id: number): Promise<Business | undefined>;
  getBusinessesByCategory(category: string): Promise<Business[]>;
  getBusinessesByLocation(location: string): Promise<Business[]>;
  getFeaturedBusinesses(): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  
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
  createArticle(article: InsertArticle): Promise<Article>;
  incrementArticleViews(id: number): Promise<void>;
  
  // How-Tos
  getAllHowTos(): Promise<HowTo[]>;
  getHowToById(id: number): Promise<HowTo | undefined>;
  getHowTosByBusinessId(businessId: number): Promise<HowTo[]>;
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
  
  // Saves
  getSavesBySessionId(sessionId: string): Promise<Save[]>;
  createSave(save: InsertSave): Promise<Save>;
  deleteSave(id: number): Promise<void>;
  
  // Mixed Feed (for home page)
  getMixedFeed(): Promise<Array<Business | Article | HowTo>>;
  
  // Upvoting
  upvoteBusiness(id: number): Promise<Business | undefined>;
  upvoteArticle(id: number): Promise<Article | undefined>;
  upvoteHowTo(id: number): Promise<HowTo | undefined>;
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
    // Seed sample businesses
    const sampleBusinesses: InsertBusiness[] = [
      {
        name: "Luxe Beauty Salon",
        description: "Full-service luxury salon offering cuts, color, styling, and treatments in the heart of Uptown Dallas",
        category: "Hair Salon",
        location: "Dallas",
        address: "123 Main St, Dallas, TX 75201",
        phone: "(214) 555-0101",
        imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        isClaimed: true,
        featured: true,
        instagramHandle: "@luxebeautydallas",
      },
      {
        name: "Elite Medical Aesthetics",
        description: "Advanced aesthetic treatments including Botox, fillers, and laser procedures",
        category: "Medical Aesthetics",
        location: "Plano",
        address: "456 Legacy Dr, Plano, TX 75024",
        phone: "(972) 555-0102",
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        isClaimed: false,
        featured: false,
      },
      {
        name: "Serenity Wellness Spa",
        description: "Relaxation and rejuvenation through massage, facials, and holistic treatments",
        category: "Wellness Spa",
        location: "Frisco",
        address: "789 Preston Rd, Frisco, TX 75034",
        phone: "(469) 555-0103",
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
        isClaimed: true,
        featured: false,
      },
    ];

    sampleBusinesses.forEach(business => {
      const id = this.businessIdCounter++;
      this.businesses.set(id, { ...business, id, upvotes: 0, createdAt: new Date() });
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
      claimedBy: null,
      instagramHandle: null,
      tiktokHandle: null,
      facebookUrl: null,
      ...insertBusiness, 
      id,
      upvotes: 0,
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

export const storage = new MemStorage();

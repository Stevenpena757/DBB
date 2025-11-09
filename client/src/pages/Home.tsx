import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { Business, Article, HowTo } from "@shared/schema";
import { FileText, Lightbulb, MapPin, Heart, BadgeCheck, Crown, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

type FeedItem = Business | Article | HowTo;

function isBusiness(item: FeedItem): item is Business {
  return 'location' in item && 'category' in item && !('excerpt' in item);
}

function isArticle(item: FeedItem): item is Article {
  return 'excerpt' in item;
}

function isHowTo(item: FeedItem): item is HowTo {
  return 'steps' in item && !('excerpt' in item);
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  
  // Build query params
  const buildBusinessQuery = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all" && selectedCategory !== "explore") {
      params.append("category", selectedCategory);
    }
    if (selectedLocation !== "all") {
      params.append("location", selectedLocation);
    }
    return params.toString() ? `/api/businesses?${params.toString()}` : '/api/businesses';
  };
  
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses', selectedCategory, selectedLocation],
    queryFn: async () => {
      const url = buildBusinessQuery();
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch businesses');
      return response.json();
    },
    enabled: selectedCategory !== "explore",
  });
  
  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
  
  const { data: howTos = [] } = useQuery<HowTo[]>({
    queryKey: ['/api/how-tos'],
  });

  // Upvote mutations
  const upvoteBusinessMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/businesses/${id}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
    },
  });

  const upvoteArticleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/articles/${id}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
  });

  const upvoteHowToMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/how-tos/${id}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/how-tos'] });
    },
  });

  const handleUpvote = (e: React.MouseEvent, item: FeedItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBusiness(item)) {
      upvoteBusinessMutation.mutate(item.id);
    } else if (isArticle(item)) {
      upvoteArticleMutation.mutate(item.id);
    } else if (isHowTo(item)) {
      upvoteHowToMutation.mutate(item.id);
    }
  };
  
  const feedItems: FeedItem[] = [
    ...businesses,
    ...(selectedCategory === "all" || selectedCategory === "explore" ? articles : []),
    ...(selectedCategory === "all" || selectedCategory === "explore" ? howTos : [])
  ].sort(() => Math.random() - 0.5);
  
  const isLoading = businessesLoading
  
  const aspectRatios = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]"];
  
  const getAspectRatio = (index: number) => {
    return aspectRatios[index % aspectRatios.length];
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <p className="text-muted-foreground">Discovering DFW beauty businesses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-background via-card to-muted">
      <Header />
      <main className="flex-1">
        <section className="py-4 bg-muted/30 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center gap-1.5" data-testid="section-share-content">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold">Share & Grow</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Earn <span className="font-medium text-foreground">FREE visibility</span> by sharing content
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-1.5" data-testid="section-vendor-marketplace">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold">Vendor Marketplace</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Suppliers connect with beauty businesses
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-1.5" data-testid="section-community-recognition">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold">Rise to the Top</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Most active & upvoted businesses featured
                </p>
              </div>
            </div>
          </div>
        </section>

        <Hero />

        <section className="py-3 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
              <button 
                onClick={() => handleCategoryClick("all")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 ${selectedCategory === "all" ? "bg-primary text-primary-foreground font-medium" : ""}`}
                data-testid="link-category-all"
              >
                All
              </button>
              <button 
                onClick={() => handleCategoryClick("Hair Salon")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 ${selectedCategory === "Hair Salon" ? "bg-primary text-primary-foreground font-medium" : ""}`}
                data-testid="link-category-health"
              >
                Hair Salons
              </button>
              <button 
                onClick={() => handleCategoryClick("Med Spa")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 ${selectedCategory === "Med Spa" ? "bg-primary text-primary-foreground font-medium" : ""}`}
                data-testid="link-category-beauty"
              >
                Med Spas
              </button>
              <button 
                onClick={() => handleCategoryClick("Medical Aesthetics")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 ${selectedCategory === "Medical Aesthetics" ? "bg-primary text-primary-foreground font-medium" : ""}`}
                data-testid="link-category-aesthetics"
              >
                Aesthetics
              </button>
              <button 
                onClick={() => handleCategoryClick("explore")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 ${selectedCategory === "explore" ? "bg-primary text-primary-foreground font-medium" : ""}`}
                data-testid="link-category-explore"
              >
                Articles & How-Tos
              </button>
            </div>
          </div>
        </section>

        <section className="py-6 md:py-8 bg-gradient-to-b from-primary/5 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>Your Network</h2>
                <p className="text-sm text-muted-foreground">Track and discover services that matter to you</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-full border bg-white hover-elevate cursor-pointer"
                  data-testid="select-location"
                >
                  <option value="all">All DFW</option>
                  <option value="Dallas">Dallas</option>
                  <option value="Fort Worth">Fort Worth</option>
                  <option value="Plano">Plano</option>
                  <option value="Irving">Irving</option>
                  <option value="Frisco">Frisco</option>
                  <option value="Arlington">Arlington</option>
                  <option value="Richardson">Richardson</option>
                  <option value="McKinney">McKinney</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-total-contributions">{businesses.length + articles.length + howTos.length}</div>
                <div className="text-xs text-muted-foreground">Total Contributions</div>
              </div>
              <div className="text-center border-x border-primary/10">
                <div className="text-2xl font-bold text-primary" data-testid="text-community-upvotes">{businesses.reduce((sum, b) => sum + b.upvotes, 0) + articles.reduce((sum, a) => sum + a.upvotes, 0) + howTos.reduce((sum, h) => sum + h.upvotes, 0)}</div>
                <div className="text-xs text-muted-foreground">Community Upvotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-active-businesses">{businesses.filter(b => b.isClaimed).length}</div>
                <div className="text-xs text-muted-foreground">Active Businesses</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 md:py-8">
          <div className="container mx-auto px-3">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
              {feedItems.map((item, index) => {
                const aspectRatio = getAspectRatio(index);
                const itemType = isBusiness(item) ? 'business' : isArticle(item) ? 'article' : 'howto';
                const key = `${itemType}-${item.id}`;
                
                if (isBusiness(item)) {
                  const isSponsored = item.isSponsored && item.sponsoredUntil && new Date(item.sponsoredUntil) > new Date();
                  const isPro = item.subscriptionTier === "pro";
                  const isPremium = item.subscriptionTier === "premium";
                  
                  return (
                    <a 
                      href={`/business/${item.id}`}
                      key={key}
                      className={`mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer block group relative ${
                        isPremium ? 'ring-2 ring-secondary/30' : ''
                      } ${isSponsored ? 'ring-2 ring-accent/50' : ''}`}
                      data-testid={`pin-business-${item.id}`}
                    >
                      {isSponsored && (
                        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-accent to-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          SPONSORED
                        </div>
                      )}
                      <div className={`${aspectRatio} overflow-hidden relative`}>
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        {isPremium && (
                          <div className="absolute top-2 right-2 bg-gradient-to-br from-secondary to-accent rounded-full p-1.5">
                            <Crown className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {isPro && !isPremium && (
                          <div className="absolute top-2 right-2 bg-gradient-to-br from-primary to-accent rounded-full p-1.5">
                            <BadgeCheck className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm flex items-center gap-1.5">
                              {item.name}
                              {isPremium && (
                                <Crown className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                              )}
                              {isPro && !isPremium && (
                                <BadgeCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              )}
                            </h3>
                          </div>
                          <button
                            onClick={(e) => handleUpvote(e, item)}
                            className="flex items-center gap-1 px-2 py-1 rounded-full hover-elevate active-elevate-2 text-xs font-medium"
                            data-testid={`button-upvote-business-${item.id}`}
                          >
                            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="text-primary">{item.upvotes}</span>
                          </button>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </p>
                          {item.phone && (
                            <p className="text-xs font-medium text-primary">{item.phone}</p>
                          )}
                          {item.address && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.address}</p>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                }
                
                if (isArticle(item)) {
                  return (
                    <div 
                      key={key}
                      className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      data-testid={`pin-article-${item.id}`}
                    >
                      <div className={`${aspectRatio} overflow-hidden`}>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Article</span>
                          </div>
                          <button
                            onClick={(e) => handleUpvote(e, item)}
                            className="flex items-center gap-1 px-2 py-1 rounded-full hover-elevate active-elevate-2 text-xs font-medium"
                            data-testid={`button-upvote-article-${item.id}`}
                          >
                            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="text-primary">{item.upvotes}</span>
                          </button>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                      </div>
                    </div>
                  );
                }
                
                if (isHowTo(item)) {
                  return (
                    <div 
                      key={key}
                      className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      data-testid={`pin-howto-${item.id}`}
                    >
                      <div className={`${aspectRatio} overflow-hidden`}>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <Lightbulb className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">How-To</span>
                          </div>
                          <button
                            onClick={(e) => handleUpvote(e, item)}
                            className="flex items-center gap-1 px-2 py-1 rounded-full hover-elevate active-elevate-2 text-xs font-medium"
                            data-testid={`button-upvote-howto-${item.id}`}
                          >
                            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="text-primary">{item.upvotes}</span>
                          </button>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  );
                }
                
                return null;
              })}
            </div>

            <div className="text-center mt-6">
              <Button variant="outline" size="lg" data-testid="button-load-more">
                Show More
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

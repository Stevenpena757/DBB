import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Business, Article, HowTo } from "@shared/schema";
import { FileText, Lightbulb, MapPin, Heart, BadgeCheck, Crown, Sparkles, Star, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import useEmblaCarousel from "embla-carousel-react";

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

interface BusinessCardProps {
  business: Business;
  images: string[];
  rating: string;
  contributionCount: number;
  isSponsored: boolean;
  isPro: boolean;
  isPremium: boolean;
  aspectRatio: string;
  onUpvote: (e: React.MouseEvent) => void;
}

function BusinessCard({ business, images, rating, contributionCount, isSponsored, isPro, isPremium, aspectRatio, onUpvote }: BusinessCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <a 
      href={`/business/${business.id}`}
      className={`mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer block group relative ${
        isPremium ? 'ring-2 ring-secondary/30' : ''
      } ${isSponsored ? 'ring-2 ring-accent/50' : ''}`}
      data-testid={`pin-business-${business.id}`}
    >
      {isSponsored && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-accent to-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5" />
          SPONSORED
        </div>
      )}
      
      <div className={`${aspectRatio} overflow-hidden relative`}>
        <img src={images[currentImageIndex]} alt={business.name} className="w-full h-full object-cover" />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover-elevate active-elevate-2"
              data-testid={`button-prev-image-${business.id}`}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover-elevate active-elevate-2"
              data-testid={`button-next-image-${business.id}`}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
        
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
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                {business.name}
                {isPremium && (
                  <Crown className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                )}
                {isPro && !isPremium && (
                  <BadgeCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                )}
              </h3>
              {business.isClaimed && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 flex items-center gap-0.5">
                  <Lock className="h-2.5 w-2.5" />
                  Claimed
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="font-semibold">{rating}</span>
                <span className="text-muted-foreground">({business.reviewCount})</span>
              </div>
              {contributionCount > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-primary font-medium">{contributionCount} posts</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onUpvote}
            className="flex items-center gap-1 px-2 py-1 rounded-full hover-elevate active-elevate-2 text-xs font-medium"
            data-testid={`button-upvote-business-${business.id}`}
          >
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-primary">{business.upvotes}</span>
          </button>
        </div>
        
        {business.services && business.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {business.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {service}
              </Badge>
            ))}
            {business.services.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                +{business.services.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{business.location}</span>
          </p>
          {business.phone && (
            <p className="text-xs font-medium text-primary">{business.phone}</p>
          )}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  
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

  // Auto-play carousel
  useEffect(() => {
    if (!emblaApi) return;

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [emblaApi]);

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
        <section className="py-1.5 md:py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b-2 border-primary/30 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden max-w-3xl mx-auto" ref={emblaRef}>
              <div className="flex">
                <div className="flex-[0_0_100%] min-w-0 px-2">
                  <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1 animate-in fade-in zoom-in duration-700" data-testid="section-share-content">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl animate-pulse glow-primary">
                      <FileText className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <h3 className="text-base md:text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Share & Grow</h3>
                    <p className="text-[9px] md:text-xs text-center max-w-lg leading-tight text-foreground/70 px-4">
                      Earn <span className="font-extrabold text-primary text-[10px] md:text-xs">FREE visibility</span> by contributing content
                    </p>
                  </div>
                </div>
                
                <div className="flex-[0_0_100%] min-w-0 px-2">
                  <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1 animate-in fade-in zoom-in duration-700" data-testid="section-find-your-beauty">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl animate-pulse glow-primary">
                      <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <h3 className="text-base md:text-2xl font-extrabold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Find Your Beauty in DFW</h3>
                    <p className="text-[9px] md:text-xs text-center max-w-lg leading-tight text-foreground/70 px-4">
                      Discover the best health, beauty & aesthetics businesses in Dallas-Fort Worth
                    </p>
                  </div>
                </div>
                
                <div className="flex-[0_0_100%] min-w-0 px-2">
                  <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1 animate-in fade-in zoom-in duration-700" data-testid="section-community-recognition">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl animate-pulse glow-primary">
                      <Heart className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <h3 className="text-base md:text-2xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Rise to the Top</h3>
                    <p className="text-[9px] md:text-xs text-center max-w-lg leading-tight text-foreground/70 px-4">
                      Active businesses are prominently featured
                    </p>
                  </div>
                </div>
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

        <section className="py-6 md:py-8">
          <div className="container mx-auto px-3">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
              {feedItems.map((item, index) => {
                const aspectRatio = getAspectRatio(index);
                const itemType = isBusiness(item) ? 'business' : isArticle(item) ? 'article' : 'howto';
                const key = `${itemType}-${item.id}`;
                
                if (isBusiness(item)) {
                  const isSponsored = !!(item.isSponsored && item.sponsoredUntil && new Date(item.sponsoredUntil) > new Date());
                  const isPro = item.subscriptionTier === "pro";
                  const isPremium = item.subscriptionTier === "premium";
                  const allImages = [item.imageUrl, ...(item.additionalImages || [])];
                  const rating = item.rating ? (item.rating / 10).toFixed(1) : "0.0";
                  const contributionCount = (articles.filter(a => a.businessId === item.id).length + howTos.filter(h => h.businessId === item.id).length);
                  
                  return (
                    <BusinessCard
                      key={key}
                      business={item}
                      images={allImages}
                      rating={rating}
                      contributionCount={contributionCount}
                      isSponsored={isSponsored}
                      isPro={isPro}
                      isPremium={isPremium}
                      aspectRatio={aspectRatio}
                      onUpvote={(e) => handleUpvote(e, item)}
                    />
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

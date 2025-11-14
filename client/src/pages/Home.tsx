import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Business, Article, HowTo, Vendor } from "@shared/schema";
import { FileText, Lightbulb, MapPin, Heart, BadgeCheck, Crown, Sparkles, Star, ChevronRight, Search, ArrowRight, MessageCircle, Share2, Camera, PenTool } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });
  
  const { data: forumPosts = [] } = useQuery<any[]>({
    queryKey: ['/api/forum'],
  });
  
  const { data: vendors = [] } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
  });

  const featuredBusinesses = businesses.filter(b => b.featured || b.isSponsored).slice(0, 6);
  const topCommunityPosts = forumPosts.slice(0, 4);
  const topVendors = vendors.slice(0, 4);

  const categories = [
    { id: "all", label: "All", icon: Sparkles },
    { id: "Hair Salon", label: "Hair Salons", icon: Sparkles },
    { id: "Med Spa", label: "Med Spas", icon: Sparkles },
    { id: "Medical Aesthetics", label: "Aesthetics", icon: Sparkles },
    { id: "Nail Salon", label: "Nails", icon: Sparkles },
    { id: "Skincare", label: "Skincare", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Integrated CTA */}
        <section 
          className="relative py-12 md:py-16 overflow-hidden"
          style={{ background: 'var(--gradient-brand)' }}
          data-testid="section-hero"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Discover Beauty in{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Dallas-Fort Worth
                </span>
              </h1>
              <p 
                className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                The premier platform connecting DFW's health, beauty, and aesthetics community
              </p>
              
              {/* Integrated Claim CTA */}
              <div className="mt-6 p-4 md:p-5 rounded-2xl bg-gradient-to-b from-[#2c1810]/85 via-[#3d2218]/75 to-[#2c1810]/85 border border-white/20 max-w-2xl mx-auto" data-testid="section-claim-cta">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
                  {/* Left: Message */}
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="bg-[#3d2218]/90 text-white border-white/40 text-xs px-3 py-0.5 mb-2 inline-block">
                      100% Free
                    </Badge>
                    <h2 
                      className="text-lg md:text-xl font-bold mb-1.5 leading-tight text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Claim Your Listing FREE
                    </h2>
                    <p className="text-xs text-white/95 mb-2">
                      Share content, connect socials, get featured
                    </p>
                  </div>
                  
                  {/* Right: CTA Button */}
                  <div className="flex-shrink-0">
                    <a href="/claim">
                      <Button 
                        size="default" 
                        className="bg-white text-[#2c1810] hover:bg-white/90 text-sm px-6 rounded-xl shadow-lg font-semibold"
                        data-testid="button-claim-listing"
                      >
                        Claim Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-5">
                <a href="/explore">
                  <Button size="default" className="text-sm px-6 rounded-xl shadow-lg" data-testid="button-explore">
                    <Search className="h-4 w-4 mr-2" />
                    Explore Businesses
                  </Button>
                </a>
                <a href="/add-listing">
                  <Button variant="outline" size="default" className="text-sm px-6 rounded-xl" data-testid="button-add-listing">
                    Add Your Business
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 md:py-16 bg-background" data-testid="section-categories">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Browse by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find exactly what you're looking for
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); window.location.href = `/explore?category=${cat.id !== 'all' ? cat.id : ''}`; }}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all hover-elevate active-elevate-2 ${
                    selectedCategory === cat.id 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-card hover:bg-muted'
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Discover Featured Businesses */}
        <section className="py-12 md:py-16 bg-muted/30" data-testid="section-featured-businesses">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Featured Businesses
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the best beauty and aesthetics professionals in DFW
              </p>
            </div>
            
            {businessesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-2xl"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.map((business) => (
                  <a 
                    key={business.id} 
                    href={`/business/${business.id}`}
                    className="block group"
                    data-testid={`card-business-${business.id}`}
                  >
                    <Card className="overflow-hidden rounded-2xl hover-elevate active-elevate-2 transition-all h-full">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img 
                          src={business.imageUrl} 
                          alt={business.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        {business.subscriptionTier === 'premium' && (
                          <div className="absolute top-3 right-3 bg-gradient-to-br from-secondary to-accent rounded-full p-2">
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {business.subscriptionTier === 'pro' && (
                          <div className="absolute top-3 right-3 bg-gradient-to-br from-primary to-accent rounded-full p-2">
                            <BadgeCheck className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                              {business.name}
                              {business.subscriptionTier === 'premium' && (
                                <Crown className="h-4 w-4 text-secondary" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {business.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-semibold">{business.rating ? (business.rating / 10).toFixed(1) : '0.0'}</span>
                          </div>
                        </div>
                        {business.services && business.services.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {business.services.slice(0, 3).map((service) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <a href="/explore">
                <Button size="lg" variant="outline" className="rounded-2xl" data-testid="button-view-all-businesses">
                  View All Businesses
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Community Highlights */}
        <section className="py-12 md:py-16 bg-background" data-testid="section-community">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Community Q&A & Tips
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Learn from experts and share your knowledge
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <p className="text-sm font-medium text-foreground">
                  Become a top rated expert to unlock all our features and benefits for free
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {topCommunityPosts.map((post) => (
                <a 
                  key={post.id} 
                  href={`/forum/${post.id}`}
                  className="block"
                  data-testid={`card-post-${post.id}`}
                >
                  <Card className="rounded-2xl hover-elevate active-elevate-2 transition-all h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {post.postType}
                          </Badge>
                          <h3 className="font-bold text-base mb-2">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.upvotes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.viewCount} views
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a href="/forum">
                <Button size="lg" variant="outline" className="rounded-2xl" data-testid="button-view-community">
                  Visit Community
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Supplier Directory */}
        <section className="py-12 md:py-16 bg-muted/30" data-testid="section-suppliers">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Supplier Directory
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with trusted vendors for all your business needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topVendors.map((vendor) => (
                <Card 
                  key={vendor.id} 
                  className="rounded-2xl hover-elevate active-elevate-2 transition-all"
                  data-testid={`card-vendor-${vendor.id}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {vendor.description}
                    </p>
                    <Badge variant="secondary" className="mb-4 text-xs">
                      {vendor.subscriptionTier.toUpperCase()}
                    </Badge>
                    <Button size="sm" variant="outline" className="w-full rounded-xl" data-testid={`button-view-vendor-${vendor.id}`}>
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a href="/vendors">
                <Button size="lg" variant="outline" className="rounded-2xl" data-testid="button-view-all-vendors">
                  View All Suppliers
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

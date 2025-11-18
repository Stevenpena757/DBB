import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeaturedHeroCarousel } from "@/components/FeaturedHeroCarousel";
import { WelcomeModal } from "@/components/WelcomeModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Business, Article, HowTo, Vendor } from "@shared/schema";
import { FileText, Lightbulb, MapPin, Heart, BadgeCheck, Crown, Sparkles, Star, ChevronRight, Search, ArrowRight, MessageCircle, Share2, Camera, PenTool } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, setLocation] = useLocation();
  
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
  const topCommunityPosts = forumPosts.slice(0, 3);
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
      <WelcomeModal />
      <Header />
      
      <main className="flex-1">
        {/* Categories Section */}
        <section className="py-8 md:py-10" data-testid="section-categories">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Browse by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                Find exactly what you're looking for
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { 
                    setSelectedCategory(cat.id); 
                    setLocation(`/explore?category=${cat.id !== 'all' ? cat.id : ''}`); 
                  }}
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

        {/* Featured Business Hero Carousel */}
        <FeaturedHeroCarousel />

        {/* How DallasBeautyBook Works */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-peach-mist to-white" data-testid="section-how-it-works">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                How DallasBeautyBook Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                Three simple steps to connect with DFW's best beauty professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center" data-testid="step-discover">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center shadow-lg">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  1. Discover
                </h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  Browse verified beauty pros across Dallas-Fort Worth. Filter by specialty, location, and ratings.
                </p>
              </div>

              <div className="text-center" data-testid="step-share">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center shadow-lg">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  2. Share
                </h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  Leave reviews, ask questions in the community, and share your beauty journey with others.
                </p>
              </div>

              <div className="text-center" data-testid="step-support">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  3. Support Local Pros
                </h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  Help local beauty businesses grow by sharing your experiences and recommendations.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/start-here">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="link-start-here">
                  New here? Start with a quick tour <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Popular in DFW Right Now */}
        <section className="py-12 md:py-16" data-testid="section-popular-now">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Popular in DFW Right Now
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                Trending beauty treatments and services in Dallas-Fort Worth
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {[
                'Botox',
                'Lip filler specialists',
                'Lash extensions',
                'Hydrafacial',
                'Skincare',
                'Body contouring',
                'Teeth whitening',
                'Brow lamination'
              ].map((trend) => (
                <Link 
                  key={trend}
                  href={`/explore?search=${encodeURIComponent(trend)}`}
                  data-testid={`chip-trend-${trend.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Badge 
                    variant="outline"
                    className="px-6 py-3 text-base rounded-full border-2 hover-elevate active-elevate-2 cursor-pointer font-medium"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {trend}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Contribute */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-white to-mint/5" data-testid="section-why-contribute">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Why Contribute to DallasBeautyBook?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                Your voice matters in our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="rounded-2xl hover-elevate" data-testid="card-contribute-help">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Help Others Choose Wisely
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Your reviews and tips guide fellow beauty enthusiasts to make informed decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="card-contribute-recognition">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <BadgeCheck className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Earn Recognition & Perks
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Top contributors unlock exclusive badges, priority support, and special offers.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="card-contribute-support">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Support Local Professionals
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Your feedback helps local beauty businesses grow and improve their services.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link href="/forum">
                <Button 
                  size="lg" 
                  className="rounded-full font-bold bg-gradient-to-r from-sunset to-peach hover:opacity-90 transition-all hover:scale-105 shadow-md" 
                  style={{ fontFamily: 'var(--font-ui)' }}
                  data-testid="button-join-community"
                >
                  Join the Community
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Discover Featured Businesses */}
        <section className="py-8 md:py-10" data-testid="section-featured-businesses">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Featured Businesses
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
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
                  <Link 
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
                  </Link>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link href="/explore">
                <Button size="lg" variant="outline" className="rounded-2xl" data-testid="button-view-all-businesses">
                  View All Businesses
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* From the Community */}
        <section className="py-8 md:py-10 bg-gradient-to-br from-white to-peach-mist" data-testid="section-community">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                From the Community
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                Real questions, expert answers, and helpful tips from the DFW beauty community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {topCommunityPosts.map((post) => (
                <Link 
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
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/forum">
                <Button size="lg" variant="outline" className="rounded-2xl" data-testid="button-view-community">
                  Visit Community
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Supplier Directory */}
        <section className="py-8 md:py-10" data-testid="section-suppliers">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Supplier Directory
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
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
              <Link href="/vendors">
                <Button size="lg" variant="outline" className="rounded-2xl" data-testid="button-view-all-vendors">
                  View All Suppliers
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

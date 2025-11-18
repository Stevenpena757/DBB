import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Star, Users, Sparkles, ChevronRight, Heart, BadgeCheck, Crown } from "lucide-react";

export default function StartHere() {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-peach-mist to-white" data-testid="section-hero">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Badge 
              variant="outline" 
              className="mb-6 px-6 py-2 text-base rounded-full border-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Welcome to DallasBeautyBook
            </Badge>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
              data-testid="heading-main"
            >
              Your Complete Guide to Getting Started
            </h1>
            <p 
              className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              DallasBeautyBook connects you with the best beauty, health, and aesthetics professionals across Dallas-Fort Worth. Here's everything you need to know to make the most of our platform.
            </p>
          </div>
        </section>

        {/* What is DallasBeautyBook */}
        <section className="py-12 md:py-16" data-testid="section-what-is">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                What is DallasBeautyBook?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                We're a comprehensive B2B SaaS directory and social platform exclusively for DFW's beauty industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl hover-elevate" data-testid="card-directory">
                <CardContent className="p-8">
                  <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Business Directory
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Find verified beauty professionals including med spas, injectors, lash artists, hair salons, nail technicians, and skincare specialists across the DFW metroplex.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="card-community">
                <CardContent className="p-8">
                  <div className="w-14 h-14 mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Community Platform
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Ask questions, share experiences, get expert advice, and connect with others who love beauty, health, and aesthetics in the Dallas-Fort Worth area.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="card-reviews">
                <CardContent className="p-8">
                  <div className="w-14 h-14 mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <Star className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Reviews & Ratings
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Read authentic reviews from real clients, see ratings, and share your own experiences to help others make informed beauty decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="card-suppliers">
                <CardContent className="p-8">
                  <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Supplier Directory
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    Beauty professionals can find trusted vendors for equipment, products, and supplies to grow their business.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-white to-mint/5" data-testid="section-who-for">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Who is DallasBeautyBook For?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left" data-testid="for-clients">
                <div className="w-16 h-16 mx-auto md:mx-0 mb-6 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  For Beauty Enthusiasts
                </h3>
                <ul className="space-y-3 text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Discover and compare top-rated beauty professionals in your area</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Read honest reviews from real clients before booking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ask questions and get expert advice from the community</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Share your beauty journey and help others</span>
                  </li>
                </ul>
              </div>

              <div className="text-center md:text-left" data-testid="for-professionals">
                <div className="w-16 h-16 mx-auto md:mx-0 mb-6 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  For Beauty Professionals
                </h3>
                <ul className="space-y-3 text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Claim and enhance your business listing for FREE</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Get discovered by thousands of potential clients in DFW</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Share content and expertise to build your brand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Connect with suppliers for business growth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Upgrade to Pro or Premium for enhanced visibility</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use It */}
        <section className="py-12 md:py-16" data-testid="section-how-to-use">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                How to Use DallasBeautyBook
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                Get started in minutes with these simple steps
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl hover-elevate" data-testid="step-1">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Explore Businesses
                      </h3>
                      <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                        Browse by category (Hair, Med Spa, Nails, etc.) or search for specific services like "Botox" or "lash extensions". Filter by location, ratings, and subscription tier.
                      </p>
                      <a href="/explore">
                        <Button variant="outline" size="sm" className="rounded-full" data-testid="button-explore-now">
                          Explore Now <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="step-2">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Join the Community
                      </h3>
                      <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                        Create a free account to ask questions, share tips, leave reviews, and engage with beauty professionals and enthusiasts across DFW.
                      </p>
                      <a href="/api/login">
                        <Button variant="outline" size="sm" className="rounded-full" data-testid="button-signup">
                          Sign Up Free <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl hover-elevate" data-testid="step-3">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-sunset to-peach flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        For Professionals: Claim Your Listing
                      </h3>
                      <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                        Own a beauty business? Claim your free listing to manage your profile, respond to reviews, and unlock growth opportunities with Pro and Premium tiers.
                      </p>
                      <a href="/claim-listing">
                        <Button variant="outline" size="sm" className="rounded-full" data-testid="button-claim-now">
                          Claim Your Listing <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-peach-mist to-white" data-testid="section-quick-actions">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8" 
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready to Get Started?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/explore">
                <Card className="rounded-2xl hover-elevate active-elevate-2 transition-all h-full cursor-pointer" data-testid="card-action-explore">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Explore Businesses
                    </h3>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                      Find beauty pros near you
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/forum">
                <Card className="rounded-2xl hover-elevate active-elevate-2 transition-all h-full cursor-pointer" data-testid="card-action-community">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Ask the Community
                    </h3>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                      Get answers and advice
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/claim-listing">
                <Card className="rounded-2xl hover-elevate active-elevate-2 transition-all h-full cursor-pointer" data-testid="card-action-claim">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                      <Crown className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Claim Your Listing
                    </h3>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                      Grow your business
                    </p>
                  </CardContent>
                </Card>
              </a>
            </div>

            <div className="mt-12">
              <a href="/">
                <Button 
                  size="lg" 
                  className="rounded-full font-bold bg-gradient-to-r from-sunset to-peach hover:opacity-90 transition-all hover:scale-105 shadow-md" 
                  style={{ fontFamily: 'var(--font-ui)' }}
                  data-testid="button-back-home"
                >
                  Back to Homepage
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

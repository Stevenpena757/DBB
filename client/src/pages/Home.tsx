import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";
import { DbbCard, DbbButtonPrimary, DbbButtonGhost, DbbTag, DbbSection, DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Business } from "@shared/schema";
import { Search, MessageCircle, Heart, MapPin, Star, ArrowRight, HelpCircle, Share2 } from "lucide-react";

export default function Home() {
  const { data: businesses = [], isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });
  
  const { data: forumPosts = [] } = useQuery<any[]>({
    queryKey: ['/api/forum'],
  });

  const featuredBusinesses = businesses.filter(b => b.featured || b.isSponsored).slice(0, 6);
  const topCommunityPosts = forumPosts.slice(0, 3);
  
  const trendingTreatments = [
    'Botox',
    'Lip Filler',
    'Lash Extensions',
    'Hydrafacial',
    'Skincare',
    'Brow Lamination',
    'Body Contouring',
    'Teeth Whitening'
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <WelcomeModal />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Soft Editorial */}
        <section className="py-12 md:py-20" data-testid="section-hero">
          <DbbContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left: Hero Text */}
              <div>
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl mb-6 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                  data-testid="hero-heading"
                >
                  Your DFW Beauty Community & Directory
                </h1>
                <p 
                  className="text-lg md:text-xl mb-8 text-dbb-charcoalSoft leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Find local beauty professionals, read real experiences, ask questions, and connect with others.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/explore">
                    <DbbButtonPrimary size="lg" className="w-full sm:w-auto" data-testid="button-find-professionals">
                      Find Beauty Professionals
                    </DbbButtonPrimary>
                  </Link>
                  <Link href="/community">
                    <DbbButtonGhost size="lg" className="w-full sm:w-auto" data-testid="button-ask-community">
                      Ask the Community
                    </DbbButtonGhost>
                  </Link>
                </div>
              </div>

              {/* Right: Quiz + Community CTAs */}
              <div className="space-y-6">
                {/* Beauty Match Quiz Card */}
                <DbbCard className="p-8" data-testid="card-quiz-cta">
                  <div className="mb-4 w-12 h-12 rounded-full bg-dbb-eucalyptus flex items-center justify-center">
                    <Search className="h-6 w-6 text-dbb-charcoal" />
                  </div>
                  <h3 
                    className="text-2xl mb-3 text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-subheading)' }}
                  >
                    Find Your Perfect Beauty Match
                  </h3>
                  <p 
                    className="text-dbb-charcoalSoft mb-6"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Take our quick quiz to get matched with beauty professionals that fit your needs and style.
                  </p>
                  <Link href="/quiz">
                    <Button 
                      className="w-full rounded-full bg-dbb-eucalyptus text-dbb-charcoal hover:bg-dbb-eucalyptus/90"
                      data-testid="button-take-quiz"
                    >
                      Take the Quiz
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </DbbCard>

                {/* Community Teaser Card */}
                {topCommunityPosts[0] && (
                  <DbbCard className="p-8" data-testid="card-community-teaser">
                    <div className="mb-4 w-12 h-12 rounded-full bg-dbb-rose flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-dbb-charcoal" />
                    </div>
                    <DbbTag className="mb-4">Recent Question</DbbTag>
                    <h3 
                      className="text-xl mb-2 text-dbb-charcoal line-clamp-2"
                      style={{ fontFamily: 'var(--font-subheading)' }}
                    >
                      {topCommunityPosts[0].title}
                    </h3>
                    <p 
                      className="text-dbb-charcoalSoft mb-4 line-clamp-2"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {topCommunityPosts[0].content}
                    </p>
                    <Link href="/community">
                      <Button 
                        variant="ghost" 
                        className="w-full rounded-full border border-dbb-borderSoft"
                        data-testid="button-view-community-teaser"
                      >
                        Join the Discussion
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </DbbCard>
                )}
              </div>
            </div>
          </DbbContainer>
        </section>

        {/* How It Works - 3 Steps */}
        <DbbSection className="bg-dbb-surface" data-testid="section-how-it-works">
          <DbbContainer>
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl mb-4 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                How DallasBeautyBook Works
              </h2>
              <p 
                className="text-lg text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Three simple steps to connect with DFW's best beauty professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1: Discover */}
              <DbbCard className="p-8 text-center" data-testid="step-discover">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-dbb-eucalyptus flex items-center justify-center">
                  <Search className="h-8 w-8 text-dbb-charcoal" />
                </div>
                <h3 
                  className="text-2xl mb-4 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-subheading)' }}
                >
                  Discover
                </h3>
                <p 
                  className="text-dbb-charcoalSoft leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Find trusted DFW beauty professionals. Browse by specialty, location, and reviews.
                </p>
              </DbbCard>

              {/* Step 2: Ask */}
              <DbbCard className="p-8 text-center" data-testid="step-ask">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-dbb-rose flex items-center justify-center">
                  <HelpCircle className="h-8 w-8 text-dbb-charcoal" />
                </div>
                <h3 
                  className="text-2xl mb-4 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-subheading)' }}
                >
                  Ask
                </h3>
                <p 
                  className="text-dbb-charcoalSoft leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Get real answers from local people. Share experiences and connect with the community.
                </p>
              </DbbCard>

              {/* Step 3: Share */}
              <DbbCard className="p-8 text-center" data-testid="step-share">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-dbb-sand flex items-center justify-center">
                  <Share2 className="h-8 w-8 text-dbb-charcoal" />
                </div>
                <h3 
                  className="text-2xl mb-4 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-subheading)' }}
                >
                  Share
                </h3>
                <p 
                  className="text-dbb-charcoalSoft leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Post tips, experiences, and insights. Help others make informed decisions.
                </p>
              </DbbCard>
            </div>
          </DbbContainer>
        </DbbSection>

        {/* Directory Preview - Featured Businesses */}
        <DbbSection data-testid="section-directory-preview">
          <DbbContainer>
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl mb-4 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Featured Beauty Professionals
              </h2>
              <p 
                className="text-lg text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Discover trusted businesses across Dallas-Fort Worth
              </p>
            </div>
            
            {businessesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DbbCard key={i} className="animate-pulse">
                    <div className="h-56 bg-dbb-sand rounded-t-2xl"></div>
                    <div className="p-6">
                      <div className="h-6 bg-dbb-sand rounded mb-2"></div>
                      <div className="h-4 bg-dbb-sand rounded w-2/3"></div>
                    </div>
                  </DbbCard>
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
                    <DbbCard className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full">
                      <div className="aspect-[4/3] overflow-hidden relative bg-dbb-sand">
                        <img 
                          src={business.imageUrl} 
                          alt={`${business.name} - service-focused imagery`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-6">
                        <h3 
                          className="text-xl mb-2 text-dbb-charcoal"
                          style={{ fontFamily: 'var(--font-subheading)' }}
                        >
                          {business.name}
                        </h3>
                        <p 
                          className="text-sm text-dbb-charcoalSoft mb-3 flex items-center gap-2"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          <MapPin className="h-4 w-4" />
                          {business.location}
                        </p>
                        <DbbTag>{business.category}</DbbTag>
                        <Button 
                          className="w-full mt-4 rounded-full"
                          variant="outline"
                          data-testid={`button-view-business-${business.id}`}
                        >
                          View Profile
                        </Button>
                      </div>
                    </DbbCard>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link href="/explore">
                <DbbButtonGhost size="lg" data-testid="button-view-all-businesses">
                  View All Professionals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </DbbButtonGhost>
              </Link>
            </div>
          </DbbContainer>
        </DbbSection>

        {/* Community Highlights */}
        <DbbSection className="bg-dbb-surface" data-testid="section-community-highlights">
          <DbbContainer>
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl mb-4 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                From the Community
              </h2>
              <p 
                className="text-lg text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Real questions, expert answers, and helpful tips from DFW beauty enthusiasts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {topCommunityPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/community/${post.id}`}
                  className="block"
                  data-testid={`card-community-${post.id}`}
                >
                  <DbbCard className="p-6 hover-elevate active-elevate-2 transition-all h-full">
                    <DbbTag className="mb-4">{post.postType || 'Question'}</DbbTag>
                    <h3 
                      className="text-lg mb-3 text-dbb-charcoal line-clamp-2"
                      style={{ fontFamily: 'var(--font-subheading)' }}
                    >
                      {post.title}
                    </h3>
                    <p 
                      className="text-sm text-dbb-charcoalSoft mb-4 line-clamp-3"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-dbb-charcoalSoft">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.upvotes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.viewCount || 0} views
                      </span>
                    </div>
                  </DbbCard>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/community">
                <DbbButtonGhost size="lg" data-testid="button-view-all-community">
                  Visit Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </DbbButtonGhost>
              </Link>
            </div>
          </DbbContainer>
        </DbbSection>

        {/* Beauty Match Quiz CTA */}
        <DbbSection className="bg-dbb-eucalyptus" data-testid="section-quiz-cta">
          <DbbContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 
                className="text-3xl md:text-4xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Find the Right Beauty Expert for Your Needs
              </h2>
              <p 
                className="text-lg mb-8 text-dbb-charcoalSoft"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Our personalized quiz matches you with professionals who fit your style, location, and preferences.
              </p>
              <Link href="/quiz">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-dbb-charcoal hover:bg-white/90 shadow-lg"
                  data-testid="button-quiz-cta"
                >
                  Take the Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </DbbContainer>
        </DbbSection>

        {/* For Professionals CTA */}
        <DbbSection className="bg-dbb-rose" data-testid="section-professionals-cta">
          <DbbContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 
                className="text-3xl md:text-4xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Grow Your Beauty Business with DallasBeautyBook
              </h2>
              <p 
                className="text-lg mb-8 text-dbb-charcoalSoft"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Get more visibility, leads, and insights to help your business thrive in the DFW area.
              </p>
              <Link href="/for-professionals">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-dbb-charcoal hover:bg-white/90 shadow-lg"
                  data-testid="button-professionals-cta"
                >
                  For Professionals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </DbbContainer>
        </DbbSection>
      </main>
      
      <Footer />
    </div>
  );
}

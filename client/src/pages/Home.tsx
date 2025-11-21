import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";
import { DbbCard, DbbTag, DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/BusinessCard";
import type { Business, ForumPost } from "@shared/schema";
import { Search, MessageCircle, ArrowRight, Leaf, Sparkles } from "lucide-react";

// Import category images
import hairSalonImg from "@assets/generated_images/Hair_Salon_category_image_4120201b.png";
import nailSalonImg from "@assets/generated_images/Nail_Salon_category_image_cb883119.png";
import medSpaImg from "@assets/generated_images/Med_Spa_category_image_003dcdaa.png";
import skincareImg from "@assets/generated_images/Skincare_category_image_e13794ea.png";
import makeupArtistImg from "@assets/generated_images/Makeup_Artist_category_image_247ccaa1.png";
import lashBrowImg from "@assets/generated_images/Lash_&_Brow_category_image_335d2acc.png";
import massageWellnessImg from "@assets/generated_images/Massage_&_Wellness_category_image_5704d0e6.png";
import medicalAestheticsImg from "@assets/generated_images/Medical_Aesthetics_category_image_de9b6fde.png";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [, setLocation] = useLocation();

  const { data: allBusinesses = [] } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  const { data: forumPosts = [] } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum'],
  });

  const allCategories = [
    { name: 'Hair Salon', image: hairSalonImg, link: '/explore?category=Hair Salon' },
    { name: 'Nail Salon', image: nailSalonImg, link: '/explore?category=Nail Salon' },
    { name: 'Med Spa', image: medSpaImg, link: '/explore?category=Med Spa' },
    { name: 'Skincare', image: skincareImg, link: '/explore?category=Skincare' },
    { name: 'Makeup Artist', image: makeupArtistImg, link: '/explore?category=Makeup Artist' },
    { name: 'Lash & Brow', image: lashBrowImg, link: '/explore?category=Lash & Brow' },
    { name: 'Massage & Wellness', image: massageWellnessImg, link: '/explore?category=Massage & Wellness' },
    { name: 'Medical Aesthetics', image: medicalAestheticsImg, link: '/explore?category=Medical Aesthetics' },
  ];

  const trendingCategories = [
    { name: 'Hair Salon', image: hairSalonImg, link: 'Hair Salon' },
    { name: 'Med Spa', image: medSpaImg, link: 'Med Spa' },
    { name: 'Skincare', image: skincareImg, link: 'Skincare' },
    { name: 'Medical Aesthetics', image: medicalAestheticsImg, link: 'Medical Aesthetics' },
  ];

  // Filter businesses based on selected category
  const displayedBusinesses = selectedCategory === 'all'
    ? allBusinesses.slice(0, 4) // Show first 4 if "all"
    : allBusinesses.filter(b => b.category === selectedCategory).slice(0, 4);

  // Get recent forum posts (first 4)
  const recentForumPosts = forumPosts.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <WelcomeModal />
      <Header />
      
      <main className="flex-1">
        {/* I'm here to... CTA Strip */}
        <section className="py-6 md:py-8" data-testid="section-cta-strip">
          <DbbContainer className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
              <p className="text-sm font-medium" style={{ color: 'hsl(var(--dbb-charcoalSoft))' }}>
                I'm here to:
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/my-beauty-book">
                  <button 
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    style={{ 
                      backgroundColor: 'hsl(var(--dbb-surface))',
                      border: '1px solid hsl(var(--dbb-sand))',
                      color: 'hsl(var(--dbb-charcoalSoft))'
                    }}
                    data-testid="button-cta-discover"
                  >
                    Discover beauty services
                  </button>
                </Link>
                <Link href="/for-professionals">
                  <button 
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    style={{ 
                      backgroundColor: 'hsl(var(--dbb-surface))',
                      border: '1px solid hsl(var(--dbb-sand))',
                      color: 'hsl(var(--dbb-charcoalSoft))'
                    }}
                    data-testid="button-cta-promote"
                  >
                    Promote my beauty business
                  </button>
                </Link>
              </div>
            </div>
          </DbbContainer>
        </section>

        {/* Hero Section - Text Left, Image Right */}
        <section className="py-12 md:py-20" data-testid="section-hero">
          <DbbContainer className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              {/* Left Column: Text Content */}
              <div className="text-center md:text-left">
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl mb-6 text-dbb-charcoal leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                  data-testid="hero-heading"
                >
                  Where DFW Beauty Meets Community
                </h1>
                <p 
                  className="text-lg md:text-xl mb-10 text-dbb-charcoalSoft"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Discover local beauty pros, create your Dallas Beauty Book, and unlock personalized offers and insights across Dallas–Fort Worth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/my-beauty-book">
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                      data-testid="button-create-beauty-book"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Your Dallas Beauty Book
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button 
                      size="lg" 
                      className="rounded-full px-8 bg-[#e8c5b5] hover:bg-[#e8c5b5]/90 text-[#2d3433] border-0"
                      data-testid="button-explore-businesses"
                    >
                      Explore Businesses
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column: Hero Image */}
              <div 
                className="relative w-full h-72 md:h-80 lg:h-96 overflow-hidden rounded-3xl bg-[hsl(var(--dbb-sand))]"
                data-testid="hero-image-container"
              >
                <img
                  src="/images/dallasbeautybook/hero-tools-and-textures.jpg"
                  alt="Beauty tools, skincare products, and soft textures arranged on a neutral background"
                  className="h-full w-full object-cover"
                  loading="eager"
                  data-testid="hero-image"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(249,246,242,0.7)] via-transparent to-transparent" />
              </div>
            </div>
          </DbbContainer>
        </section>

        {/* Featured Businesses & For Professionals */}
        <section className="mt-16 md:mt-24" data-testid="section-featured-businesses">
          <DbbContainer className="max-w-6xl mx-auto">
            <h3 
              className="text-2xl md:text-3xl mb-8 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Featured Businesses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allBusinesses.slice(0, 4).map((business) => (
                <BusinessCard 
                  key={business.id} 
                  business={business}
                  onClick={() => setLocation(`/business/${business.id}`)}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/explore">
                <Button
                  variant="ghost"
                  className="text-sm font-semibold underline underline-offset-4"
                  data-testid="button-view-all-businesses"
                >
                  View all businesses <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center mt-16">
              <div>
                <h2 
                  className="text-3xl md:text-4xl mb-6 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Grow Your Beauty Business with DallasBeautyBook
                </h2>
                <p 
                  className="text-lg text-dbb-charcoalSoft mb-6"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Claim your listing, get discovered inside personalized Dallas Beauty Books, share your expertise, and turn local beauty seekers into loyal clients.
                </p>
                <Link href="/for-professionals">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                    data-testid="button-learn-more-professionals"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative h-52 md:h-64">
                <img
                  src="/images/dallasbeautybook/pro-dashboard-abstract.jpg"
                  alt="Abstract representation of beauty business analytics and growth tools"
                  className="h-full w-full rounded-3xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </DbbContainer>
        </section>

        {/* Browse by Category - Visual Tiles */}
        <section className="mt-16 md:mt-24" data-testid="section-browse-categories">
          <DbbContainer className="max-w-6xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl mb-8 text-dbb-charcoal text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {allCategories.slice(0, 4).map((category) => (
                <Link key={category.name} href={category.link}>
                  <div 
                    className="group hover-elevate active-elevate-2 cursor-pointer overflow-hidden rounded-2xl"
                    data-testid={`tile-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 
                          className="text-white text-lg md:text-xl font-medium"
                          style={{ fontFamily: 'var(--font-subheading)' }}
                        >
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/explore">
                <Button
                  variant="ghost"
                  className="text-sm font-semibold underline underline-offset-4"
                  data-testid="button-view-all-categories"
                >
                  View all categories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </DbbContainer>
        </section>

        {/* How DallasBeautyBook Works */}
        <section className="py-12 md:py-16 mt-8" data-testid="section-how-it-works">
          <DbbContainer className="max-w-5xl mx-auto">
            <p 
              className="text-xs uppercase tracking-[0.25em] mb-2"
              style={{ color: 'hsl(var(--dbb-rose))' }}
            >
              How DallasBeautyBook Works
            </p>
            <h2 
              className="text-2xl md:text-3xl mb-6 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Three simple steps to your Dallas beauty journey
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base"
                 style={{ color: 'hsl(var(--dbb-charcoalSoft))' }}>
              <div>
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">1. Create Your Beauty Book</div>
                <p>Answer a few questions to create your Beauty Book.</p>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">2. Discover Local Pros</div>
                <p>We match you with DFW beauty pros and categories.</p>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">3. Join the Community</div>
                <p>Explore, save, and join the community.</p>
              </div>
            </div>
          </DbbContainer>
        </section>

        {/* Start Here: For Locals vs For Pros Split Section */}
        <section className="mt-16 md:mt-24" data-testid="section-start-here">
          <DbbContainer className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* For locals */}
              <div className="rounded-2xl border px-5 py-6"
                   style={{
                     borderColor: 'hsl(var(--dbb-sand))',
                     backgroundColor: 'hsl(var(--dbb-surface))'
                   }}>
                <p className="text-xs uppercase tracking-[0.25em] mb-2"
                   style={{ color: 'hsl(var(--dbb-rose))' }}>
                  For locals
                </p>
                <h2 className="text-xl md:text-2xl mb-3 text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}>
                  Start your Dallas beauty journey
                </h2>
                <ol className="text-sm mb-4 space-y-2"
                    style={{ color: 'hsl(var(--dbb-charcoalSoft))' }}>
                  <li>1. Create your Dallas Beauty Book for personalized ideas.</li>
                  <li>2. Explore businesses by category and city.</li>
                  <li>3. Save favorites and join the community conversations.</li>
                </ol>
                <Link href="/my-beauty-book">
                  <button 
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                    style={{ 
                      backgroundColor: 'hsl(var(--dbb-roseSoft))',
                      color: 'hsl(var(--dbb-charcoal))'
                    }}
                    data-testid="button-start-beauty-book-locals"
                  >
                    Create Your Beauty Book →
                  </button>
                </Link>
              </div>

              {/* For pros */}
              <div className="rounded-2xl border px-5 py-6"
                   style={{
                     borderColor: 'hsl(var(--dbb-sand))',
                     backgroundColor: 'hsl(var(--dbb-surface))'
                   }}>
                <p className="text-xs uppercase tracking-[0.25em] mb-2"
                   style={{ color: 'hsl(var(--dbb-rose))' }}>
                  For beauty professionals
                </p>
                <h2 className="text-xl md:text-2xl mb-3 text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}>
                  Get in front of DFW beauty seekers
                </h2>
                <ol className="text-sm mb-4 space-y-2"
                    style={{ color: 'hsl(var(--dbb-charcoalSoft))' }}>
                  <li>1. Find or submit your business listing.</li>
                  <li>2. Claim your page and update your services.</li>
                  <li>3. Share content to unlock featured placement and promotions.</li>
                </ol>
                <Link href="/for-professionals">
                  <button 
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    style={{ 
                      backgroundColor: 'hsl(var(--dbb-surface))',
                      border: '1px solid hsl(var(--dbb-sand))',
                      color: 'hsl(var(--dbb-charcoal))'
                    }}
                    data-testid="button-for-professionals-split"
                  >
                    For Professionals →
                  </button>
                </Link>
              </div>
            </div>
          </DbbContainer>
        </section>

        {/* Beauty Stories & Guides / Community */}
        <section className="mt-16 md:mt-24" data-testid="section-community-stories">
          <DbbContainer className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] mb-2"
               style={{ color: 'hsl(var(--dbb-rose))' }}>
              Beauty Stories & Guides
            </p>
            <h2 
              className="text-2xl md:text-3xl mb-3 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Learn from the Dallas beauty community
            </h2>
            <p 
              className="text-sm md:text-base mb-6 max-w-2xl"
              style={{ 
                color: 'hsl(var(--dbb-charcoalSoft))',
                fontFamily: 'var(--font-body)' 
              }}
            >
              Every post helps the community and can unlock rewards like featured placement, spotlights, and special offers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentForumPosts.map((post) => (
                <Link key={post.id} href={`/forum/${post.id}`}>
                  <DbbCard className="hover-elevate active-elevate-2 cursor-pointer p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <DbbTag>{post.category}</DbbTag>
                      <DbbTag>{post.type === 'question' ? 'Question' : 'Tip'}</DbbTag>
                    </div>
                    <h4 
                      className="text-lg font-medium text-dbb-charcoal mb-2"
                      style={{ fontFamily: 'var(--font-subheading)' }}
                    >
                      {post.title}
                    </h4>
                    <p className="text-sm text-dbb-charcoalSoft line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dbb-charcoalSoft">
                      <span>{post.replyCount} replies</span>
                      <span>{post.upvotes} upvotes</span>
                    </div>
                  </DbbCard>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <Link href="/forum">
                <Button
                  variant="ghost"
                  className="text-sm font-semibold underline underline-offset-4"
                  data-testid="button-visit-community"
                >
                  Visit the Community <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Content Submission Incentive */}
            <div className="mt-8 p-4 rounded-lg border" style={{ 
              borderColor: 'hsl(var(--dbb-sand))',
              backgroundColor: 'hsl(var(--dbb-beigeSoft))'
            }}>
              <p className="text-sm text-center" style={{ 
                color: 'hsl(var(--dbb-charcoalSoft))',
                fontFamily: 'var(--font-body)'
              }}>
                Submitting content helps you unlock featured placement, rewards, and special offers — while helping the community grow.
              </p>
            </div>
          </DbbContainer>
        </section>

        {/* Feature Cards - Ask Community + Beauty Book */}
        <section className="mt-16 md:mt-24" data-testid="section-features">
          <DbbContainer className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ask the Community Card */}
              <DbbCard className="overflow-hidden" data-testid="card-community">
                <div className="aspect-[4/3] bg-gradient-to-br from-dbb-rose to-dbb-sand flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MessageCircle className="h-16 w-16 text-dbb-charcoal" />
                  </div>
                </div>
                <div className="p-8">
                  <h2 
                    className="text-2xl md:text-3xl mb-3 text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Ask the Community
                  </h2>
                  <p 
                    className="text-dbb-charcoalSoft mb-6"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Get advice & recommendations
                  </p>
                  <Link href="/forum">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-dbb-charcoal hover:text-dbb-charcoalSoft underline"
                      data-testid="button-post-question"
                    >
                      Post a Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </DbbCard>

              {/* Create Your Beauty Book Card */}
              <DbbCard className="overflow-hidden" data-testid="card-beauty-book">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-dbb-sand to-primary/10 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <div className="p-8">
                  <h2 
                    className="text-2xl md:text-3xl mb-3 text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Create Your Beauty Book
                  </h2>
                  <p 
                    className="text-dbb-charcoalSoft mb-6"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Get personalized recommendations based on your preferences, location, and beauty goals
                  </p>
                  <Link href="/my-beauty-book">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                      data-testid="button-create-beauty-book"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </DbbCard>
            </div>
          </DbbContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}

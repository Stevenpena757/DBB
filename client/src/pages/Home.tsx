import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";
import { DbbCard, DbbTag, DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import type { Business, ForumPost } from "@shared/schema";
import { Search, MessageCircle, ArrowRight, Leaf, MapPin, Star } from "lucide-react";

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

  const { data: allBusinesses = [] } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  const { data: forumPosts = [] } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum'],
  });

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

  // Get recent forum posts (first 3)
  const recentForumPosts = forumPosts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <WelcomeModal />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Centered, Minimal */}
        <section className="py-16 md:py-24" data-testid="section-hero">
          <DbbContainer className="max-w-4xl mx-auto text-center">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl mb-6 text-dbb-charcoal leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
              data-testid="hero-heading"
            >
              Find Beauty Experts in DFW
            </h1>
            <p 
              className="text-lg md:text-xl mb-10 text-dbb-charcoalSoft max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Discover top health, beauty, and aesthetics professionals in Dallas-Fort Worth area
            </p>
            <Link href="/explore">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                data-testid="button-search-professionals"
              >
                Search Professionals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </DbbContainer>
        </section>

        {/* Trending Categories with Dynamic Content */}
        <section className="py-12" data-testid="section-trending-categories">
          <DbbContainer className="max-w-6xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl mb-8 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Trending Categories
            </h2>
            
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="rounded-full"
                style={{
                  backgroundColor: selectedCategory === 'all' ? 'hsl(var(--dbb-forest))' : 'hsl(var(--dbb-sand))',
                  color: selectedCategory === 'all' ? 'white' : 'hsl(var(--dbb-charcoal))',
                  borderColor: 'transparent',
                }}
                data-testid="button-category-all"
              >
                All
              </Button>
              {trendingCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.link ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.link)}
                  className="rounded-full flex items-center gap-2"
                  style={{
                    backgroundColor: selectedCategory === category.link ? 'hsl(var(--dbb-forest))' : 'hsl(var(--dbb-sand))',
                    color: selectedCategory === category.link ? 'white' : 'hsl(var(--dbb-charcoal))',
                    borderColor: 'transparent',
                  }}
                  data-testid={`button-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Business Listings Grid */}
            <div className="mb-12">
              <h3 
                className="text-2xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-subheading)' }}
              >
                Featured Businesses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedBusinesses.map((business) => (
                  <Link key={business.id} href={`/business/${business.id}`}>
                    <DbbCard className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={business.imageUrl} 
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 
                          className="text-lg font-medium text-dbb-charcoal mb-2"
                          style={{ fontFamily: 'var(--font-subheading)' }}
                        >
                          {business.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-dbb-charcoalSoft mb-2">
                          <MapPin className="h-4 w-4" />
                          {business.location}
                        </div>
                        <DbbTag>{business.category}</DbbTag>
                      </div>
                    </DbbCard>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Submissions */}
            <div>
              <h3 
                className="text-2xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-subheading)' }}
              >
                Community Submissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentForumPosts.map((post) => (
                  <Link key={post.id} href={`/community/post/${post.id}`}>
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
            </div>
          </DbbContainer>
        </section>

        {/* For Professionals Callout */}
        <section className="py-12" data-testid="section-professionals-callout">
          <DbbContainer className="max-w-6xl mx-auto">
            <DbbCard className="overflow-hidden grid md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto bg-gradient-to-br from-accent to-dbb-sand flex items-center justify-center p-12">
                <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-primary" />
                </div>
              </div>
              <div className="p-12 flex flex-col justify-center">
                <h2 
                  className="text-3xl md:text-4xl mb-4 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  For Professionals:
                  <br />
                  Grow Your Business
                </h2>
                <Link href="/claim">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-dbb-charcoal hover:text-dbb-charcoalSoft text-base underline"
                    data-testid="button-learn-more-professionals"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </DbbCard>
          </DbbContainer>
        </section>

        {/* Feature Cards - Ask Community + Beauty Match Quiz */}
        <section className="py-12" data-testid="section-features">
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
                  <Link href="/community">
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

              {/* Beauty Match Quiz Card */}
              <DbbCard className="overflow-hidden" data-testid="card-quiz">
                <div className="aspect-[4/3] bg-gradient-to-br from-accent to-dbb-sand flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Search className="h-16 w-16 text-dbb-charcoal" />
                  </div>
                </div>
                <div className="p-8">
                  <h2 
                    className="text-2xl md:text-3xl mb-3 text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Take the Beauty Match Quiz
                  </h2>
                  <p 
                    className="text-dbb-charcoalSoft mb-6"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Get matched with local specialists
                  </p>
                  <Link href="/quiz">
                    <Button 
                      className="bg-muted hover:bg-muted/90 text-muted-foreground rounded-full"
                      data-testid="button-get-started"
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

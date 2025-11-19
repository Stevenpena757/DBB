import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WelcomeModal } from "@/components/WelcomeModal";
import { DbbCard, DbbTag, DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import type { Business } from "@shared/schema";
import { Search, MessageCircle, ArrowRight, Leaf } from "lucide-react";

export default function Home() {
  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  const trendingCategories = [
    'Hair Salons',
    'Med Spas',
    'Aesthetics',
    'Skincare'
  ];

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

        {/* Trending Categories */}
        <section className="py-12" data-testid="section-trending-categories">
          <DbbContainer className="max-w-6xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl mb-8 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Trending Categories
            </h2>
            <div className="flex flex-wrap gap-4">
              {trendingCategories.map((category) => (
                <Link 
                  key={category} 
                  href={`/explore?category=${encodeURIComponent(category)}`}
                >
                  <DbbTag 
                    className="px-6 py-3 text-base hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`tag-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </DbbTag>
                </Link>
              ))}
            </div>
          </DbbContainer>
        </section>

        {/* For Professionals Callout */}
        <section className="py-12 pb-20" data-testid="section-professionals-callout">
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
      </main>

      <Footer />
    </div>
  );
}

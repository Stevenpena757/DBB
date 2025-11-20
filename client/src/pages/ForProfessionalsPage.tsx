import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Eye, MessageCircle, TrendingUp, Sparkles } from "lucide-react";

export default function ForProfessionalsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <DbbContainer className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
                data-testid="for-professionals-heading"
              >
                Grow Your Beauty Business with DallasBeautyBook
              </h1>
              <p 
                className="text-lg md:text-xl text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                DallasBeautyBook is a dedicated hub for beauty, wellness, and aesthetics in DFW. Claim your listing, get discovered inside personalized Dallas Beauty Books, share your expertise, and turn local beauty seekers into loyal clients.
              </p>
            </div>

            {/* How it Works for Pros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm md:text-base"
                 style={{ color: 'hsl(var(--dbb-charcoalSoft))' }}>
              <div>
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">1. Claim your business</div>
                <p>
                  Make sure your information is accurate, add your services, and show up as the official owner of your page.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">2. Get discovered in Beauty Books</div>
                <p>
                  When users create their Dallas Beauty Book, we can recommend businesses like yours based on their location, interests, and vibe.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">3. Share content and convert leads</div>
                <p>
                  Post tips, updates, and offers to stay top-of-mind. As the platform grows, you'll gain insight into demand, trends, and client interests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card className="border-dbb-sand hover-elevate active-elevate-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[hsl(var(--dbb-sand))]">
                      <Eye className="h-6 w-6 text-dbb-forest" />
                    </div>
                    <div>
                      <h3 
                        className="text-xl mb-2 text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        Be Where DFW Clients Are
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Show up when locals explore services and build their Dallas Beauty Book.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dbb-sand hover-elevate active-elevate-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[hsl(var(--dbb-sand))]">
                      <MessageCircle className="h-6 w-6 text-dbb-forest" />
                    </div>
                    <div>
                      <h3 
                        className="text-xl mb-2 text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        Build Trust with Content
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Post tips, insights, and stories to stand out as a trusted expert.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dbb-sand hover-elevate active-elevate-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[hsl(var(--dbb-sand))]">
                      <TrendingUp className="h-6 w-6 text-dbb-forest" />
                    </div>
                    <div>
                      <h3 
                        className="text-xl mb-2 text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        Get Featured in Beauty Books
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Appear as a recommendation when clients share their preferences and location.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dbb-sand hover-elevate active-elevate-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[hsl(var(--dbb-sand))]">
                      <Sparkles className="h-6 w-6 text-dbb-forest" />
                    </div>
                    <div>
                      <h3 
                        className="text-xl mb-2 text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        Start Free, Grow Over Time
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Claim your page at no cost, then unlock more visibility, promotions, and insights as you grow.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p 
              className="text-sm md:text-base max-w-2xl mt-6 mx-auto text-center"
              style={{ 
                color: 'hsl(var(--dbb-charcoalSoft))',
                fontFamily: 'var(--font-body)' 
              }}
            >
              As our platform grows, we plan to offer anonymized insights into what services people are searching for, which areas are trending, and how clients prefer to discover beauty services in DFW. Our long-term goal is to give you data you can actually use to make smarter decisions—not just another directory listing.
            </p>

            <div className="text-center mt-8">
              <Link href="/claim-listing">
                <Button 
                  size="lg"
                  className="rounded-full px-8 bg-[#e8c5b5] hover:bg-[#e8c5b5]/90 text-[#2d3433] border-0"
                  data-testid="button-claim-your-business"
                >
                  Claim Your Business for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-dbb-charcoalSoft">
                Already claimed? <Link href="/add-listing" className="underline">Add a new listing</Link>
              </p>
            </div>
          </DbbContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}

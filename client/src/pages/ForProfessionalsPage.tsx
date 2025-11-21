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
                Grow your beauty business in DFW. Claim your listing, showcase your expertise, and unlock exposure, tools, and insights.
              </p>
            </div>

            {/* How it Works for Pros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm md:text-base"
                 style={{ color: 'hsl(var(--dbb-charcoalSoft))' }}>
              <div className="text-center">
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">1. Claim Your Business</div>
                <p>Verify your listing and update your details.</p>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">2. Get Discovered in Beauty Books</div>
                <p>Be recommended when users share their goals and location.</p>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-1 text-dbb-charcoal">3. Share Content & Unlock Promotions</div>
                <p>Post tips and updates to earn more visibility and rewards.</p>
              </div>
            </div>

            <div className="mb-12">
              <h3 
                className="text-2xl mb-6 text-dbb-charcoal text-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Benefits for DFW Beauty Professionals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <div className="text-dbb-forest mt-1">•</div>
                  <p className="text-dbb-charcoalSoft">Visibility across DFW</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-dbb-forest mt-1">•</div>
                  <p className="text-dbb-charcoalSoft">Personalized client matching</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-dbb-forest mt-1">•</div>
                  <p className="text-dbb-charcoalSoft">Featured listings & promos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-dbb-forest mt-1">•</div>
                  <p className="text-dbb-charcoalSoft">Future insights & trends</p>
                </div>
              </div>
            </div>

            <p 
              className="text-sm md:text-base max-w-2xl mt-6 mx-auto text-center"
              style={{ 
                color: 'hsl(var(--dbb-charcoalSoft))',
                fontFamily: 'var(--font-body)' 
              }}
            >
              As the platform grows, anonymized insights will help businesses understand what DFW beauty clients are looking for — turning data into meaningful opportunities.
            </p>

            {/* Content Submission Incentive - Enhanced */}
            <div 
              className="mt-8 p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto" 
              style={{ 
                border: '2px solid hsl(158, 25%, 30%)',
                background: 'linear-gradient(135deg, hsl(32, 67%, 99%) 0%, hsl(32, 35%, 91%) 100%)'
              }}
            >
              <div className="text-center mb-6">
                <h3 
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ 
                    color: 'hsl(158, 25%, 30%)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  🌟 Unlock Business Growth Benefits
                </h3>
                <p className="text-base md:text-lg font-semibold" style={{ 
                  color: 'hsl(25, 7%, 28%)',
                  fontFamily: 'var(--font-body)'
                }}>
                  Claim your business listing to start submitting content and unlock featured placement, rewards, and special offers
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'hsl(32, 67%, 99%)' }}>
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'hsl(25, 7%, 28%)' }}>Featured Placement</p>
                    <p className="text-xs" style={{ color: 'hsl(25, 5%, 48%)' }}>Top search results</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'hsl(32, 67%, 99%)' }}>
                  <div className="text-3xl">🎁</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'hsl(25, 7%, 28%)' }}>Promotional Discounts</p>
                    <p className="text-xs" style={{ color: 'hsl(25, 5%, 48%)' }}>Save on upgrades</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'hsl(32, 67%, 99%)' }}>
                  <div className="text-3xl">📈</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'hsl(25, 7%, 28%)' }}>SEO Boost</p>
                    <p className="text-xs" style={{ color: 'hsl(25, 5%, 48%)' }}>Increased visibility</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/claim-listing">
                  <Button 
                    size="lg"
                    className="rounded-full px-8 font-semibold shadow-md"
                    style={{
                      backgroundColor: 'hsl(158, 25%, 30%)',
                      color: 'white'
                    }}
                    data-testid="button-submit-content-professionals"
                  >
                    Claim Your Listing to Start
                  </Button>
                </Link>
                <p className="mt-4 text-sm" style={{ color: 'hsl(25, 5%, 48%)' }}>
                  First claim your listing, then submit articles and guides to help DFW discover your business
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="mb-4 text-sm italic text-dbb-charcoalSoft max-w-md mx-auto">
                Businesses that submit content receive increased visibility, priority placement, and discounts on future promotions.
              </p>
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

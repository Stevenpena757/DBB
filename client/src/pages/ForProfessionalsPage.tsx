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
            {/* Direct Hero */}
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-dbb-charcoal font-heading"
                data-testid="for-professionals-heading"
              >
                Get Your DFW Beauty Business in Front of the Right Clients
              </h1>
              <p 
                className="text-lg md:text-xl text-dbb-charcoalSoft max-w-2xl mx-auto mb-8 font-body"
              >
                Claim your listing, share your expertise, and grow with data-backed insights as we scale.
              </p>

              {/* 3 Clear Value Bullets */}
              <div className="max-w-3xl mx-auto">
                <Card className="p-6 md:p-8 mb-8">
                  <CardContent className="p-0">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-dbb-forestLight">
                          <Eye className="h-6 w-6 text-dbb-forest" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-bold mb-1 text-dbb-charcoal font-heading">
                            Visibility
                          </h3>
                          <p className="text-base text-dbb-charcoalSoft">
                            Show up where DFW clients search for beauty services
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-dbb-forestLight">
                          <Sparkles className="h-6 w-6 text-dbb-forest" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-bold mb-1 text-dbb-charcoal font-heading">
                            Featured Placements & Promotions
                          </h3>
                          <p className="text-base text-dbb-charcoalSoft">
                            Get priority placement and send targeted offers to engaged clients
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-dbb-forestLight">
                          <TrendingUp className="h-6 w-6 text-dbb-forest" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-bold mb-1 text-dbb-charcoal font-heading">
                            Future Anonymized Insights
                          </h3>
                          <p className="text-base text-dbb-charcoalSoft">
                            Understand trends in services, neighborhoods, and what DFW clients want
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Link href="/claim-listing">
                  <Button 
                    size="lg"
                    className="rounded-full px-8 bg-dbb-forest text-white hover:bg-dbb-forest/90"
                    data-testid="button-claim-primary"
                  >
                    Claim Your Listing - It's Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Content Submission Incentive - Enhanced */}
            <div 
              className="mt-8 p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto border-2 border-dbb-forest bg-gradient-to-br from-dbb-surface to-dbb-sand"
            >
              <div className="text-center mb-6">
                <h3 
                  className="text-xl md:text-2xl font-bold mb-3 text-dbb-forest font-heading"
                >
                  🌟 Unlock Business Growth Benefits
                </h3>
                <p className="text-base md:text-lg font-semibold text-dbb-charcoal font-body">
                  Claim your business listing to start submitting content and unlock featured placement, rewards, and special offers
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-dbb-surface">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="font-semibold text-sm text-dbb-charcoal">Featured Placement</p>
                    <p className="text-xs text-dbb-charcoalSoft">Top search results</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-dbb-surface">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <p className="font-semibold text-sm text-dbb-charcoal">Promotional Discounts</p>
                    <p className="text-xs text-dbb-charcoalSoft">Save on upgrades</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-dbb-surface">
                  <div className="text-3xl">📈</div>
                  <div>
                    <p className="font-semibold text-sm text-dbb-charcoal">SEO Boost</p>
                    <p className="text-xs text-dbb-charcoalSoft">Increased visibility</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/claim-listing">
                  <Button 
                    size="lg"
                    className="rounded-full px-8 font-semibold shadow-md bg-dbb-forest text-white hover:bg-dbb-forest/90"
                    data-testid="button-submit-content-professionals"
                  >
                    Claim Your Listing to Start
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-dbb-charcoalSoft">
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

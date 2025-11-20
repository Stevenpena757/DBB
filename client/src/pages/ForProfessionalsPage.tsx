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
                For Beauty Professionals in DFW
              </h1>
              <p 
                className="text-lg md:text-xl text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Claim your listing, share your expertise, and reach thousands of active beauty seekers across Dallas-Fort Worth.
              </p>
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
                        Enhance Visibility
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Appear in Explore and Beauty Book recommendations to reach clients actively seeking your services.
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
                        Share Content
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Post tips and updates to the community to elevate your authority and connect with potential clients.
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
                        Optimize SEO
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Content enhances your ranking in DFW searches, helping you discover more opportunities.
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
                        Free to Join
                      </h3>
                      <p className="text-dbb-charcoalSoft">
                        Basic exposure is always free for beauty pros. Elevate your presence with premium options.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/claim-listing">
                <Button 
                  size="lg"
                  className="rounded-full px-8 bg-[#e8c5b5] hover:bg-[#e8c5b5]/90 text-[#2d3433] border-0"
                  data-testid="button-claim-your-business"
                >
                  Claim Your Business
                  <ArrowRight className="ml-2 h-5 w-5" />
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

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DbbCard, DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { Sparkles, Building2, MapPin, CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";

export default function StartJourney() {
  const [, navigate] = useLocation();
  const [showBusinessChoice, setShowBusinessChoice] = useState(false);

  const { data: user, isLoading } = useQuery<{ id: number; username: string } | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAuthenticated) {
      const intendedPath = localStorage.getItem('onboardingIntent');
      if (intendedPath) {
        localStorage.removeItem('onboardingIntent');
        navigate(intendedPath);
      }
    }
  }, [isAuthenticated, navigate]);

  const handleConsumerSignIn = () => {
    localStorage.setItem('onboardingIntent', '/my-beauty-book?mode=onboarding');
    window.location.href = '/api/login';
  };

  const handleBusinessSignIn = () => {
    localStorage.setItem('onboardingIntent', '/start?business=true');
    window.location.href = '/api/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <DbbContainer className="py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </DbbContainer>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <DbbContainer className="py-12 md:py-20 max-w-4xl mx-auto">
        {!isAuthenticated ? (
          <div className="text-center space-y-8">
            <div>
              <h1 
                className="text-4xl md:text-5xl mb-4 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Welcome to Dallas Beauty Book
              </h1>
              <p 
                className="text-lg md:text-xl text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Join our community to discover beauty services, share your experiences, and unlock exclusive benefits.
              </p>
            </div>

            <div className="space-y-6">
              <h2 
                className="text-2xl font-semibold text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                🌟 Get Started Today
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <DbbCard 
                  className="p-8 hover-elevate active-elevate-2 transition-all"
                  data-testid="card-consumer-sign-in"
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-dbb-cream">
                        <Sparkles className="h-8 w-8 text-dbb-forestGreen" />
                      </div>
                    </div>
                    <h3 
                      className="text-2xl font-semibold text-dbb-charcoal"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      I'm a Dallas Local
                    </h3>
                    <p className="text-dbb-charcoalSoft">
                      Looking to discover beauty, aesthetics, and wellness services in DFW
                    </p>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-5 w-5 text-dbb-forestGreen flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-dbb-charcoalSoft">Create your Beauty Book</p>
                      </div>
                      <div className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-5 w-5 text-dbb-forestGreen flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-dbb-charcoalSoft">Get personalized recommendations</p>
                      </div>
                      <div className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-5 w-5 text-dbb-forestGreen flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-dbb-charcoalSoft">Access exclusive offers</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleConsumerSignIn}
                      size="lg"
                      className="w-full rounded-full font-semibold"
                      style={{
                        backgroundColor: 'hsl(158, 25%, 30%)',
                        color: 'white'
                      }}
                      data-testid="button-consumer-sign-in"
                    >
                      Sign In to Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </DbbCard>

                <DbbCard 
                  className="p-8 hover-elevate active-elevate-2 transition-all"
                  data-testid="card-business-sign-in"
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-dbb-cream">
                        <Building2 className="h-8 w-8 text-dbb-forestGreen" />
                      </div>
                    </div>
                    <h3 
                      className="text-2xl font-semibold text-dbb-charcoal"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      I'm a Beauty Professional
                    </h3>
                    <p className="text-dbb-charcoalSoft">
                      Running or managing a beauty, aesthetics, or wellness business in DFW
                    </p>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-5 w-5 text-dbb-forestGreen flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-dbb-charcoalSoft">Claim your business listing</p>
                      </div>
                      <div className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-5 w-5 text-dbb-forestGreen flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-dbb-charcoalSoft">Reach DFW beauty seekers</p>
                      </div>
                      <div className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-5 w-5 text-dbb-forestGreen flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-dbb-charcoalSoft">Unlock growth tools</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBusinessSignIn}
                      size="lg"
                      className="w-full rounded-full font-semibold"
                      style={{
                        backgroundColor: 'hsl(158, 25%, 30%)',
                        color: 'white'
                      }}
                      data-testid="button-business-sign-in"
                    >
                      Sign In to Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </DbbCard>
              </div>

              <p className="text-sm text-dbb-charcoalSoft pt-4">
                Secure authentication powered by Replit
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <div>
              <h1 
                className="text-4xl md:text-5xl mb-4 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Welcome, {user.username}!
              </h1>
              <p 
                className="text-lg md:text-xl text-dbb-charcoalSoft max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Let's get you started. Tell us a bit about yourself:
              </p>
            </div>

            {!showBusinessChoice && !new URLSearchParams(window.location.search).get('business') ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <DbbCard 
                  className="p-8 cursor-pointer hover-elevate active-elevate-2 transition-all"
                  onClick={() => navigate("/my-beauty-book?mode=onboarding")}
                  data-testid="card-consumer-path"
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-dbb-cream">
                        <Sparkles className="h-8 w-8 text-dbb-forestGreen" />
                      </div>
                    </div>
                    <h2 
                      className="text-2xl font-semibold text-dbb-charcoal"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      I'm a Dallas Local
                    </h2>
                    <p className="text-dbb-charcoalSoft">
                      Looking to discover beauty, aesthetics, and wellness services in DFW
                    </p>
                    <Button 
                      className="w-full rounded-full"
                      style={{
                        backgroundColor: 'hsl(158, 25%, 30%)',
                        color: 'white'
                      }}
                      data-testid="button-consumer-choice"
                    >
                      Create My Beauty Book
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </DbbCard>

                <DbbCard 
                  className="p-8 cursor-pointer hover-elevate active-elevate-2 transition-all"
                  onClick={() => setShowBusinessChoice(true)}
                  data-testid="card-business-path"
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-dbb-cream">
                        <Building2 className="h-8 w-8 text-dbb-forestGreen" />
                      </div>
                    </div>
                    <h2 
                      className="text-2xl font-semibold text-dbb-charcoal"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      I'm a Beauty Professional
                    </h2>
                    <p className="text-dbb-charcoalSoft">
                      Running or managing a beauty, aesthetics, or wellness business in DFW
                    </p>
                    <Button 
                      className="w-full rounded-full"
                      style={{
                        backgroundColor: 'hsl(158, 25%, 30%)',
                        color: 'white'
                      }}
                      data-testid="button-business-choice"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </DbbCard>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                {!new URLSearchParams(window.location.search).get('business') && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowBusinessChoice(false)}
                    className="mb-4"
                    data-testid="button-back-to-choice"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to options
                  </Button>
                )}

                <div className="space-y-4">
                  <h2 
                    className="text-2xl font-semibold text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Choose Your Path
                  </h2>

                  <DbbCard 
                    className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all text-left"
                    onClick={() => navigate("/claim-listing")}
                    data-testid="card-claim-listing"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-dbb-cream">
                        <MapPin className="h-6 w-6 text-dbb-forestGreen" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-dbb-charcoal mb-2">
                          Claim My Existing Listing
                        </h3>
                        <p className="text-dbb-charcoalSoft mb-4">
                          Your business is already on Dallas Beauty Book. Claim it to manage your profile and unlock features.
                        </p>
                        <Button 
                          className="rounded-full"
                          style={{
                            backgroundColor: 'hsl(158, 25%, 30%)',
                            color: 'white'
                          }}
                          data-testid="button-claim-existing"
                        >
                          Claim Existing Listing
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </DbbCard>

                  <DbbCard 
                    className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all text-left"
                    onClick={() => navigate("/add-listing")}
                    data-testid="card-add-new-listing"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-dbb-cream">
                        <Building2 className="h-6 w-6 text-dbb-forestGreen" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-dbb-charcoal mb-2">
                          Submit a New Listing
                        </h3>
                        <p className="text-dbb-charcoalSoft mb-4">
                          Don't see your business? Submit it for review and join the Dallas Beauty Book community.
                        </p>
                        <Button 
                          className="rounded-full"
                          style={{
                            backgroundColor: 'hsl(158, 25%, 30%)',
                            color: 'white'
                          }}
                          data-testid="button-submit-new"
                        >
                          Submit New Listing
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </DbbCard>

                  {new URLSearchParams(window.location.search).get('business') && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        window.history.replaceState({}, '', '/start');
                        window.location.reload();
                      }}
                      className="mt-4"
                      data-testid="button-back-to-main"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to all options
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DbbContainer>

      <Footer />
    </div>
  );
}

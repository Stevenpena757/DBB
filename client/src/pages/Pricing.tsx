import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      icon: Zap,
      iconColor: "text-primary",
      features: [
        "Basic business listing",
        "Share unlimited articles & how-tos",
        "Community upvoting",
        "Location-based discovery",
        "Social media links",
        "Basic analytics",
      ],
      cta: "Get Started Free",
      popular: false,
      gradient: "from-primary/10 to-secondary/10",
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For businesses ready to grow",
      icon: Sparkles,
      iconColor: "text-accent",
      features: [
        "Everything in Free",
        "✨ Verified Business Badge",
        "📊 Advanced analytics dashboard",
        "⚡ Priority in search results",
        "📈 Performance insights",
        "🎯 Targeted audience reach",
        "💬 Dedicated support",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      gradient: "from-accent/20 to-secondary/20",
    },
    {
      name: "Premium",
      price: "$99",
      period: "per month",
      description: "Maximum visibility & features",
      icon: Crown,
      iconColor: "text-secondary",
      features: [
        "Everything in Pro",
        "👑 Premium Featured Badge",
        "🏆 Top placement in feed",
        "💎 Highlighted in all categories",
        "📣 Sponsored content slots",
        "🎨 Custom branding options",
        "📞 White-glove support",
        "📊 Competitor insights",
      ],
      cta: "Go Premium",
      popular: false,
      gradient: "from-secondary/20 to-accent/30",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-card to-muted">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
                Grow Your Beauty Business
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Start FREE. Share your expertise. Get discovered. Upgrade when you're ready to dominate your market
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card
                    key={tier.name}
                    className={`relative overflow-hidden hover-elevate ${
                      tier.popular ? 'border-2 border-primary shadow-lg' : ''
                    }`}
                    data-testid={`card-pricing-${tier.name.toLowerCase()}`}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center`}>
                        <Icon className={`h-8 w-8 ${tier.iconColor}`} />
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                      <CardDescription className="text-sm">{tier.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {tier.price}
                        </span>
                        <span className="text-muted-foreground text-sm ml-1">
                          /{tier.period}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </CardContent>

                    <CardFooter>
                      <Button
                        className={`w-full ${
                          tier.popular
                            ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                            : ''
                        }`}
                        variant={tier.popular ? 'default' : 'outline'}
                        data-testid={`button-select-${tier.name.toLowerCase()}`}
                      >
                        {tier.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Vendor Marketplace
                  </CardTitle>
                  <CardDescription className="text-center">
                    For suppliers looking to connect with DFW beauty businesses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        What You Get
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                        <li>• Direct connection to 1000+ beauty businesses</li>
                        <li>• Product showcase & inventory management</li>
                        <li>• Lead generation tools</li>
                        <li>• Analytics & insights dashboard</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        Commission Structure
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                        <li>• <strong>Free Tier:</strong> 20% commission on transactions</li>
                        <li>• <strong>Pro Tier:</strong> 15% commission on transactions</li>
                        <li>• <strong>Premium Tier:</strong> 10% commission + featured placement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="default" size="lg" data-testid="button-vendor-signup" className="bg-gradient-to-r from-primary to-secondary">
                    Become a Vendor Partner
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Revenue Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card data-testid="card-revenue-subscriptions">
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Tiers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Businesses upgrade for verified badges, advanced analytics, and priority placement in search results and feeds.
                </CardContent>
              </Card>

              <Card data-testid="card-revenue-sponsored">
                <CardHeader>
                  <CardTitle className="text-lg">Sponsored Content</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Premium businesses can boost their articles and how-tos to reach a wider audience with highlighted placement.
                </CardContent>
              </Card>

              <Card data-testid="card-revenue-marketplace">
                <CardHeader>
                  <CardTitle className="text-lg">Marketplace Commission</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Earn 10-20% commission when vendors and suppliers connect with businesses through the platform.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

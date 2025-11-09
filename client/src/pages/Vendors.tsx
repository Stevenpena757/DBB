import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vendor } from "@shared/schema";
import { Store, Phone, Mail, Globe, Crown, BadgeCheck, Sparkles } from "lucide-react";

export default function Vendors() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: vendors = [], isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
  });

  const filteredVendors = selectedCategory === "all"
    ? vendors
    : vendors.filter(v => v.category === selectedCategory);

  const categories = ["Equipment", "Products", "Supplies", "Tools", "Furniture"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading vendors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-card to-muted">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
                Find Your Suppliers
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse equipment, products, and supplies from trusted vendors - all in one place for your business
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                  selectedCategory === "all" ? "bg-primary text-primary-foreground font-medium" : ""
                }`}
                data-testid="filter-all"
              >
                All Vendors
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                    selectedCategory === cat ? "bg-primary text-primary-foreground font-medium" : ""
                  }`}
                  data-testid={`filter-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mb-8 p-6 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl border border-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Suppliers: Reach DFW Beauty Businesses</h3>
                  <p className="text-sm text-muted-foreground">List your products and connect with 1000+ active businesses</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-semibold mb-1">Free Tier</p>
                  <p className="text-muted-foreground text-xs">20% commission on transactions</p>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-semibold mb-1">Pro Tier</p>
                  <p className="text-muted-foreground text-xs">15% commission + priority placement</p>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-semibold mb-1">Premium Tier</p>
                  <p className="text-muted-foreground text-xs">10% commission + featured status</p>
                </div>
              </div>
              <div className="mt-4">
                <Button className="bg-gradient-to-r from-primary to-secondary" data-testid="button-become-vendor">
                  Get Started as a Vendor
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => {
                const isPro = vendor.subscriptionTier === "pro";
                const isPremium = vendor.subscriptionTier === "premium";
                const commissionRate = vendor.commissionRate;

                return (
                  <Card 
                    key={vendor.id}
                    className={`hover-elevate ${
                      isPremium ? 'ring-2 ring-secondary/30' : ''
                    }`}
                    data-testid={`card-vendor-${vendor.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {vendor.name}
                            {isPremium && (
                              <Crown className="h-4 w-4 text-secondary" />
                            )}
                            {isPro && !isPremium && (
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            )}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {commissionRate}% fee
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Store className="h-3 w-3 mr-1" />
                          {vendor.category}
                        </Badge>
                        {vendor.featured && (
                          <Badge className="text-xs bg-gradient-to-r from-accent to-secondary text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">{vendor.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      {vendor.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                      {vendor.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{vendor.email}</span>
                        </div>
                      )}
                      {vendor.website && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={vendor.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Button variant="default" className="flex-1" data-testid={`button-contact-${vendor.id}`}>
                        Contact Vendor
                      </Button>
                      <Button variant="outline" data-testid={`button-products-${vendor.id}`}>
                        View Products
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No vendors found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

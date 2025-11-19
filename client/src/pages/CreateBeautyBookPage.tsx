import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DbbCard, DbbTag } from "@/components/dbb/DbbComponents";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import type { Business } from "@shared/schema";

const ENHANCE_AREAS = [
  "Skin glow & complexion",
  "Lashes",
  "Brows",
  "Nails",
  "Hair care & styling",
  "Injectable enhancements",
  "Sculpting & body contour",
  "Wellness & recovery",
  "Anti-aging optimization",
  "I'm exploring",
];

const DFW_CITIES = [
  "Dallas",
  "Plano",
  "Frisco",
  "Arlington",
  "Irving",
  "Fort Worth",
  "McKinney",
  "Allen",
  "Richardson",
  "Garland",
];

const VIBES = [
  "Natural & minimal",
  "Clean clinical",
  "Luxury spa",
  "Trendy & glam",
  "Quiet & private",
  "Budget-friendly",
  "First-timer friendly",
];

const FREQUENCIES = [
  "Monthly maintenance",
  "Seasonal refresh",
  "Special occasions",
  "Treating myself",
  "Exploring",
];

type BeautyBookFormData = {
  enhanceAreas: string[];
  city: string;
  vibe: string[];
  frequency: string;
  name: string;
  email: string;
  phone: string;
  consentMarketing: boolean;
};

export default function CreateBeautyBookPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BeautyBookFormData>({
    enhanceAreas: [],
    city: "",
    vibe: [],
    frequency: "",
    name: "",
    email: "",
    phone: "",
    consentMarketing: false,
  });

  const [beautyBookId, setBeautyBookId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: BeautyBookFormData) => {
      const response = await fetch("/api/beauty-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enhanceAreas: data.enhanceAreas,
          city: data.city,
          vibe: data.vibe,
          frequency: data.frequency,
          preferences: [],
          name: data.name || null,
          email: data.email,
          phone: data.phone || null,
          consentMarketing: data.consentMarketing,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create beauty book");
      }
      
      return await response.json() as { beautyBookId: string; city: string; primaryEnhanceArea: string };
    },
    onSuccess: (response) => {
      setBeautyBookId(response.beautyBookId);
      setStep(6); // Results step
      toast({
        title: "Success!",
        description: "Your Dallas Beauty Book has been created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create beauty book",
        variant: "destructive",
      });
    },
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["/api/businesses"],
    enabled: step === 6,
  }) as { data: Business[] };

  const toggleSelection = (field: "enhanceAreas" | "vibe", value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const newValue = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: newValue };
    });
  };

  const handleNext = () => {
    // Validation
    if (step === 1 && formData.enhanceAreas.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one enhancement area",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !formData.city) {
      toast({
        title: "Selection required",
        description: "Please select a city",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && formData.vibe.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one vibe preference",
        variant: "destructive",
      });
      return;
    }
    if (step === 4 && !formData.frequency) {
      toast({
        title: "Selection required",
        description: "Please select a frequency",
        variant: "destructive",
      });
      return;
    }
    if (step === 5) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 5) {
      // Submit form
      createMutation.mutate(formData);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getRecommendedBusinesses = () => {
    if (!businesses.length) return [];

    // Filter by city
    let filtered = businesses.filter((b) => b.location === formData.city);

    // If city filter returns nothing, show all
    if (filtered.length === 0) {
      filtered = businesses;
    }

    // Prioritize sponsored and featured businesses
    filtered.sort((a, b) => {
      const aScore = (a.isSponsored ? 2 : 0) + (a.featured ? 1 : 0);
      const bScore = (b.isSponsored ? 2 : 0) + (b.featured ? 1 : 0);
      return bScore - aScore;
    });

    return filtered.slice(0, 6);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="font-serif text-2xl text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md"
              data-testid="link-home"
            >
              Dallas Beauty Book
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {step < 6 ? (
          <>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 mx-1 rounded-full ${
                      s <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Step {step} of 5
              </p>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">
                Create Your Dallas Beauty Book
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover personalized recommendations for health, beauty, and aesthetics services in the DFW area
              </p>
            </div>

            {/* Form Steps */}
            <DbbCard className="p-6 md:p-8">
              {step === 1 && (
                <div data-testid="step-enhance-areas">
                  <h2 className="font-serif text-2xl mb-4 text-foreground">
                    What would you like to enhance or explore?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Select all that interest you
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {ENHANCE_AREAS.map((area) => (
                      <button
                        key={area}
                        onClick={() => toggleSelection("enhanceAreas", area)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors ${
                          formData.enhanceAreas.includes(area)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover-elevate"
                        }`}
                        data-testid={`chip-enhance-${area.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div data-testid="step-city">
                  <h2 className="font-serif text-2xl mb-4 text-foreground">
                    Where are you located?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Select your city or nearest area
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {DFW_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => setFormData({ ...formData, city })}
                        className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                          formData.city === city
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover-elevate"
                        }`}
                        data-testid={`city-${city.toLowerCase()}`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div data-testid="step-vibe">
                  <h2 className="font-serif text-2xl mb-4 text-foreground">
                    What's your preferred vibe?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Select all that resonate with you
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {VIBES.map((vibe) => (
                      <button
                        key={vibe}
                        onClick={() => toggleSelection("vibe", vibe)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors ${
                          formData.vibe.includes(vibe)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover-elevate"
                        }`}
                        data-testid={`chip-vibe-${vibe.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div data-testid="step-frequency">
                  <h2 className="font-serif text-2xl mb-4 text-foreground">
                    How often do you refresh your beauty routine?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Choose what best describes you
                  </p>
                  <div className="space-y-3">
                    {FREQUENCIES.map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFormData({ ...formData, frequency: freq })}
                        className={`w-full px-6 py-4 rounded-lg border-2 transition-colors text-left ${
                          formData.frequency === freq
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover-elevate"
                        }`}
                        data-testid={`frequency-${freq.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div data-testid="step-contact">
                  <h2 className="font-serif text-2xl mb-4 text-foreground">
                    Let's personalize your recommendations
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    We'll send your beauty book and matches to your email
                  </p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">
                        Name (Optional)
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-foreground">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-1"
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Phone (Optional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="mt-1"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={createMutation.isPending}
                  data-testid="button-next"
                >
                  {step === 5 ? (
                    createMutation.isPending ? (
                      "Creating..."
                    ) : (
                      "Create My Beauty Book"
                    )
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </DbbCard>
          </>
        ) : (
          /* Results Screen */
          <div data-testid="results-screen">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">
                Your Beauty Book is Ready!
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Based on your preferences in {formData.city}, here are some personalized recommendations
              </p>
            </div>

            {/* Recommended Businesses */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl mb-6 text-foreground">
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRecommendedBusinesses().map((business) => (
                  <DbbCard
                    key={business.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => navigate(`/businesses/${business.id}`)}
                    data-testid={`business-card-${business.id}`}
                  >
                    <img
                      src={business.imageUrl}
                      alt={business.name}
                      className="w-full h-48 object-cover rounded-t-md"
                    />
                    <div className="p-4">
                      <h3 className="font-serif text-xl mb-2">{business.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <DbbTag>{business.category}</DbbTag>
                        {business.isSponsored && (
                          <DbbTag className="bg-primary/10 text-primary">Sponsored</DbbTag>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {business.location}
                      </p>
                    </div>
                  </DbbCard>
                ))}
              </div>
            </div>

            {/* Community CTAs */}
            <div className="grid md:grid-cols-2 gap-6">
              <DbbCard className="p-6 hover-elevate cursor-pointer" onClick={() => navigate("/forum")} data-testid="cta-community">
                <h3 className="font-serif text-xl mb-2 text-foreground">
                  Join the Community
                </h3>
                <p className="text-muted-foreground mb-4">
                  Share tips, ask questions, and connect with others in the DFW beauty community
                </p>
                <Button data-testid="button-join-community">
                  Browse Community
                </Button>
              </DbbCard>
              <DbbCard className="p-6 hover-elevate cursor-pointer" onClick={() => navigate("/explore")} data-testid="cta-explore">
                <h3 className="font-serif text-xl mb-2 text-foreground">
                  Explore More
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover all businesses and services across DFW
                </p>
                <Button variant="outline" data-testid="button-explore-more">
                  View Directory
                </Button>
              </DbbCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

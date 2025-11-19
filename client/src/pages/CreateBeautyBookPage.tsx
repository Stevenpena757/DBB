import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { DbbCard, DbbTag } from "@/components/dbb/DbbComponents";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import type { Business, InsertBeautyBook } from "@shared/schema";
import {
  insertBeautyBookSchema,
  ENHANCE_AREAS,
  VIBE_OPTIONS,
  FREQUENCY_OPTIONS,
  DFW_CITIES,
} from "@shared/schema";

export default function CreateBeautyBookPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [beautyBookId, setBeautyBookId] = useState<string | null>(null);

  const form = useForm<InsertBeautyBook>({
    resolver: zodResolver(insertBeautyBookSchema),
    defaultValues: {
      enhanceAreas: [],
      city: undefined,
      vibe: [],
      frequency: undefined,
      name: "",
      email: "",
      phone: "",
      consentMarketing: false,
      preferences: undefined,
      userId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBeautyBook) => {
      const response = await fetch("/api/beauty-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
    const currentValues = form.watch(field) as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    form.setValue(field, newValues as any);
  };

  const handleNext = async () => {
    // Validate current step fields
    let isValid = false;
    
    if (step === 1) {
      isValid = await form.trigger("enhanceAreas");
      if (!isValid) {
        toast({
          title: "Selection required",
          description: "Please select at least one enhancement area",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 2) {
      isValid = await form.trigger("city");
      if (!isValid) {
        toast({
          title: "Selection required",
          description: "Please select a city",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 3) {
      isValid = await form.trigger("vibe");
      if (!isValid) {
        toast({
          title: "Selection required",
          description: "Please select at least one vibe preference",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 4) {
      isValid = await form.trigger("frequency");
      if (!isValid) {
        toast({
          title: "Selection required",
          description: "Please select a frequency",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 5) {
      isValid = await form.trigger(["email", "name", "phone"]);
      if (!isValid) {
        toast({
          title: "Invalid input",
          description: "Please check your email and other fields",
          variant: "destructive",
        });
        return;
      }
      // Submit form
      createMutation.mutate(form.getValues());
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
    const city = form.watch("city");
    const enhanceAreas = form.watch("enhanceAreas");
    let filtered = businesses.filter((b) => b.location === city);

    // If city filter returns nothing, show all
    if (filtered.length === 0) {
      filtered = businesses;
    }

    // Map enhance areas to business categories for relevance scoring
    const categoryMatches: Record<string, string[]> = {
      "Skin glow & complexion": ["Skincare", "Med Spa", "Medical Aesthetics"],
      "Lashes": ["Lash & Brow"],
      "Brows": ["Lash & Brow"],
      "Nails": ["Nail Salon"],
      "Hair care & styling": ["Hair Salon"],
      "Injectable enhancements": ["Med Spa", "Medical Aesthetics"],
      "Sculpting & body contour": ["Med Spa", "Medical Aesthetics"],
      "Wellness & recovery": ["Massage & Wellness", "Med Spa"],
      "Anti-aging optimization": ["Med Spa", "Medical Aesthetics", "Skincare"],
    };

    // Calculate relevance scores and sort
    filtered.sort((a, b) => {
      // Score for sponsored/featured (highest priority)
      const aSponsoredScore = (a.isSponsored ? 100 : 0) + (a.featured ? 50 : 0);
      const bSponsoredScore = (b.isSponsored ? 100 : 0) + (b.featured ? 50 : 0);

      // Score for category relevance (medium priority)
      const aRelevanceScore = enhanceAreas.some((area) => 
        categoryMatches[area]?.includes(a.category)
      ) ? 10 : 0;
      const bRelevanceScore = enhanceAreas.some((area) => 
        categoryMatches[area]?.includes(b.category)
      ) ? 10 : 0;

      const aTotal = aSponsoredScore + aRelevanceScore;
      const bTotal = bSponsoredScore + bRelevanceScore;
      
      return bTotal - aTotal;
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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {step < 6 ? (
          <Form {...form}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
              {/* Form Content - Left Column */}
              <div>
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
                <div className="mb-8">
                  <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">
                    Create Your Dallas Beauty Book
                  </h1>
                  <p className="text-lg text-muted-foreground">
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
                        type="button"
                        key={area}
                        onClick={() => toggleSelection("enhanceAreas", area)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors ${
                          form.watch("enhanceAreas").includes(area)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover-elevate"
                        }`}
                        data-testid={`chip-${area.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
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
                        type="button"
                        key={city}
                        onClick={() => form.setValue("city", city)}
                        className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                          form.watch("city") === city
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
                    {VIBE_OPTIONS.map((vibe) => (
                      <button
                        type="button"
                        key={vibe}
                        onClick={() => toggleSelection("vibe", vibe)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors ${
                          form.watch("vibe").includes(vibe)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border text-foreground hover-elevate"
                        }`}
                        data-testid={`chip-${vibe.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
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
                    {FREQUENCY_OPTIONS.map((freq) => (
                      <button
                        type="button"
                        key={freq}
                        onClick={() => form.setValue("frequency", freq)}
                        className={`w-full px-6 py-4 rounded-lg border-2 transition-colors text-left ${
                          form.watch("frequency") === freq
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Name (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Your name"
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Phone (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(555) 123-4567"
                              {...field}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
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
              </div>

              {/* Beauty Book Image - Right Column (Desktop Only) */}
              <div className="hidden lg:block sticky top-24">
                <img
                  src="/images/dallasbeautybook/quiz-notebook-brush.jpg"
                  alt="Beauty consultation notes and tools on a desk"
                  className="w-full rounded-3xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Form>
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
                Based on your preferences in {form.watch("city")}, here are some personalized recommendations
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

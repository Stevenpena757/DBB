import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DbbContainer } from "@/components/dbb/DbbComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { ArrowRight, ArrowLeft } from "lucide-react";

const quizSchema = z.object({
  services: z.array(z.string()).min(1, "Please select at least one service"),
  location: z.string().min(1, "Please select a location"),
  budget: z.string().min(1, "Please select a budget range"),
  concerns: z.string().optional(),
});

type QuizFormData = z.infer<typeof quizSchema>;

const SERVICES = [
  "Hair Salon",
  "Nail Salon",
  "Med Spa",
  "Medical Aesthetics",
  "Skincare",
  "Makeup Artist",
  "Lash & Brow",
  "Massage & Wellness",
];

const DFW_LOCATIONS = [
  "Dallas",
  "Fort Worth",
  "Plano",
  "Arlington",
  "Frisco",
  "McKinney",
  "Irving",
  "Garland",
];

const BUDGET_RANGES = [
  "$0 - $50",
  "$50 - $100",
  "$100 - $200",
  "$200 - $500",
  "$500+",
];

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      services: [],
      location: "",
      budget: "",
      concerns: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: QuizFormData) => {
      // Convert form data to match API schema
      const submissionData = {
        sessionId: `session-${Date.now()}`,
        responses: {
          services: data.services,
          location: data.location,
          budget: data.budget,
          concerns: data.concerns,
        },
        matchedBusinessIds: [], // Will be populated by backend
        location: data.location,
        services: data.services,
        budget: data.budget,
      };
      
      return await apiRequest("POST", "/api/quiz", submissionData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "We've received your quiz responses. Check your matches on the Explore page.",
      });
      setLocation("/explore");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
      });
    },
  });

  const onSubmit = (data: QuizFormData) => {
    submitMutation.mutate(data);
  };

  const selectedServices = form.watch("services");

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1 py-16">
        <DbbContainer className="max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
            {/* Quiz Form - Left Column */}
            <div>
              <div className="mb-8">
                <h1 
                  className="text-4xl md:text-5xl mb-4 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                  data-testid="quiz-heading"
                >
                  Beauty Match Quiz
                </h1>
                <p 
                  className="text-lg text-dbb-charcoalSoft"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Answer a few questions and we'll suggest the best beauty professionals in DFW for you.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Services */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 
                        className="text-2xl text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        What services are you interested in?
                      </h2>
                      <FormField
                        control={form.control}
                        name="services"
                        render={() => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-3">
                              {SERVICES.map((service) => (
                                <FormField
                                  key={service}
                                  control={form.control}
                                  name="services"
                                  render={({ field }) => (
                                    <FormItem key={service}>
                                      <FormControl>
                                        <Button
                                          type="button"
                                          variant={selectedServices?.includes(service) ? "default" : "outline"}
                                          className="w-full rounded-full justify-start"
                                          style={{
                                            backgroundColor: selectedServices?.includes(service) 
                                              ? 'hsl(var(--dbb-forest))' 
                                              : 'transparent',
                                            color: selectedServices?.includes(service) 
                                              ? 'white' 
                                              : 'hsl(var(--dbb-charcoal))',
                                            borderColor: 'hsl(var(--dbb-sand))',
                                          }}
                                          onClick={() => {
                                            const currentServices = field.value || [];
                                            if (currentServices.includes(service)) {
                                              field.onChange(currentServices.filter(s => s !== service));
                                            } else {
                                              field.onChange([...currentServices, service]);
                                            }
                                          }}
                                          data-testid={`button-service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                                        >
                                          {service}
                                        </Button>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                          onClick={() => {
                            const services = form.getValues("services");
                            if (services.length > 0) {
                              setStep(2);
                            } else {
                              form.setError("services", {
                                message: "Please select at least one service",
                              });
                            }
                          }}
                          data-testid="button-next-step-1"
                        >
                          Next
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location & Budget */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 
                        className="text-2xl text-dbb-charcoal mb-6"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        Where are you located?
                      </h2>
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DFW Area</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-3">
                                {DFW_LOCATIONS.map((loc) => (
                                  <Button
                                    key={loc}
                                    type="button"
                                    variant={field.value === loc ? "default" : "outline"}
                                    className="w-full rounded-full"
                                    style={{
                                      backgroundColor: field.value === loc 
                                        ? 'hsl(var(--dbb-forest))' 
                                        : 'transparent',
                                      color: field.value === loc 
                                        ? 'white' 
                                        : 'hsl(var(--dbb-charcoal))',
                                      borderColor: 'hsl(var(--dbb-sand))',
                                    }}
                                    onClick={() => field.onChange(loc)}
                                    data-testid={`button-location-${loc.toLowerCase()}`}
                                  >
                                    {loc}
                                  </Button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <h2 
                        className="text-2xl text-dbb-charcoal mt-8 mb-6"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        What's your budget range?
                      </h2>
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-3">
                                {BUDGET_RANGES.map((budget) => (
                                  <Button
                                    key={budget}
                                    type="button"
                                    variant={field.value === budget ? "default" : "outline"}
                                    className="w-full rounded-full"
                                    style={{
                                      backgroundColor: field.value === budget 
                                        ? 'hsl(var(--dbb-forest))' 
                                        : 'transparent',
                                      color: field.value === budget 
                                        ? 'white' 
                                        : 'hsl(var(--dbb-charcoal))',
                                      borderColor: 'hsl(var(--dbb-sand))',
                                    }}
                                    onClick={() => field.onChange(budget)}
                                    data-testid={`button-budget-${budget.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                                  >
                                    {budget}
                                  </Button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <h2 
                        className="text-2xl text-dbb-charcoal mt-8 mb-6"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        Any specific concerns or preferences? (Optional)
                      </h2>
                      <FormField
                        control={form.control}
                        name="concerns"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., sensitive skin, anti-aging, natural products..."
                                className="rounded-full"
                                data-testid="input-concerns"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="rounded-full px-8"
                          onClick={() => setStep(1)}
                          data-testid="button-back"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                          disabled={submitMutation.isPending}
                          data-testid="button-submit-quiz"
                        >
                          {submitMutation.isPending ? "Submitting..." : "Get My Matches"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </div>

            {/* Quiz Image - Right Column (Desktop Only) */}
            <div className="hidden lg:block sticky top-24">
              <img
                src="/images/dallasbeautybook/quiz-notebook-brush.jpg"
                alt="Beauty consultation notes and tools on a desk"
                className="w-full rounded-3xl object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </DbbContainer>
      </main>

      <Footer />
    </div>
  );
}

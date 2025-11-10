import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, CheckCircle2 } from "lucide-react";

const categories = [
  "Hair Salon",
  "Med Spa",
  "Medical Aesthetics",
  "Nail Salon",
  "Lashes",
  "Dermatology",
  "Plastic Surgery",
  "Laser Hair Removal",
  "Cosmetic Dentistry",
  "Teeth Whitening",
  "Aesthetics Spa",
] as const;

const locations = [
  "Dallas",
  "Fort Worth",
  "Arlington",
  "Plano",
  "Irving",
  "Garland",
  "Frisco",
  "McKinney",
  "Grand Prairie",
  "Denton",
  "Carrollton",
  "Allen",
  "Lewisville",
  "Flower Mound",
] as const;

const addListingSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(categories),
  location: z.enum(locations),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL"),
  instagramHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  facebookUrl: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
});

type AddListingForm = z.infer<typeof addListingSchema>;

export default function AddListing() {
  const [, navigate] = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<AddListingForm>({
    resolver: zodResolver(addListingSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      imageUrl: "",
      instagramHandle: "",
      tiktokHandle: "",
      facebookUrl: "",
    },
  });

  const submitListingMutation = useMutation({
    mutationFn: (data: AddListingForm) =>
      apiRequest("POST", "/api/pending-businesses", data),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your listing has been submitted for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit listing",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddListingForm) => {
    submitListingMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col pb-16 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="max-w-lg w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Listing Submitted!</h2>
              <p className="text-muted-foreground">
                Thank you for submitting your business listing. Our team will review it and get back to you soon.
              </p>
              <div className="flex gap-2 justify-center pt-4">
                <Button onClick={() => navigate("/")} data-testid="button-go-home">
                  Go to Homepage
                </Button>
                <Button onClick={() => {setIsSubmitted(false); form.reset();}} variant="outline" data-testid="button-submit-another">
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Add Your Business</h1>
            </div>
            <p className="text-muted-foreground">
              Submit your business to be featured on DallasBeautyBook. After review, your listing will go live!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Fill out the form below to submit your business for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} data-testid="input-business-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your business and services" 
                            className="min-h-[100px]"
                            {...field} 
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-location">
                                <SelectValue placeholder="Select a city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Suite 100" {...field} data-testid="input-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(214) 555-0123" {...field} data-testid="input-phone" />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@business.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourbusiness.com" {...field} data-testid="input-website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL *</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-image-url" />
                        </FormControl>
                        <FormDescription>
                          Provide a direct URL to your business image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Social Media (Optional)</h3>
                    
                    <FormField
                      control={form.control}
                      name="instagramHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Handle</FormLabel>
                          <FormControl>
                            <Input placeholder="@yourbusiness" {...field} data-testid="input-instagram" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tiktokHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok Handle</FormLabel>
                          <FormControl>
                            <Input placeholder="@yourbusiness" {...field} data-testid="input-tiktok" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facebookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Page URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/yourbusiness" {...field} data-testid="input-facebook" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitListingMutation.isPending}
                    data-testid="button-submit-listing"
                  >
                    {submitListingMutation.isPending ? "Submitting..." : "Submit for Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Business } from "@shared/schema";
import { MapPin, Phone, Globe, Lock, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const claimRequestSchema = z.object({
  businessId: z.number(),
  claimantName: z.string().min(2, "Name must be at least 2 characters"),
  claimantEmail: z.string().email("Invalid email address"),
  claimantPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  proofDocument: z.string().optional(),
});

export default function ClaimListing() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showClaimedFilter, setShowClaimedFilter] = useState<"unclaimed" | "all">("unclaimed");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof claimRequestSchema>>({
    resolver: zodResolver(claimRequestSchema),
    defaultValues: {
      businessId: 0,
      claimantName: "",
      claimantEmail: "",
      claimantPhone: "",
      message: "",
      proofDocument: "",
    },
  });

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses", selectedCategory, selectedLocation],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedLocation !== "all") params.append("location", selectedLocation);
      const url = params.toString() ? `/api/businesses?${params.toString()}` : "/api/businesses";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch businesses");
      return response.json();
    },
  });

  const claimMutation = useMutation({
    mutationFn: (data: z.infer<typeof claimRequestSchema>) =>
      apiRequest("POST", "/api/claim-requests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      setIsClaimDialogOpen(false);
      setSelectedBusiness(null);
      form.reset();
      toast({
        title: "Claim Request Submitted",
        description: "Your claim request has been submitted for admin review.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit claim request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenClaimDialog = (business: Business) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to claim a listing.",
        variant: "destructive",
      });
      return;
    }
    setSelectedBusiness(business);
    form.setValue("businessId", business.id);
    setIsClaimDialogOpen(true);
  };

  const handleSubmitClaim = (data: z.infer<typeof claimRequestSchema>) => {
    claimMutation.mutate(data);
  };

  const filteredBusinesses = businesses.filter((business) => {
    if (showClaimedFilter === "unclaimed") {
      return !business.isClaimed;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <p className="text-muted-foreground">Loading businesses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-background via-card to-muted">
      <Header />
      <main className="flex-1">
        <section className="py-8 border-b bg-card">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Claim Your Business Listing
            </h1>
            <p className="text-muted-foreground">
              Find your business and submit a claim request to manage your listing
            </p>
          </div>
        </section>

        <section className="py-4 border-b bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowClaimedFilter("unclaimed")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                  showClaimedFilter === "unclaimed" ? "bg-primary text-primary-foreground font-medium" : ""
                }`}
                data-testid="button-filter-unclaimed"
              >
                Unclaimed Only
              </button>
              <button
                onClick={() => setShowClaimedFilter("all")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                  showClaimedFilter === "all" ? "bg-primary text-primary-foreground font-medium" : ""
                }`}
                data-testid="button-filter-all-listings"
              >
                All Businesses
              </button>
              <div className="border-l h-6 mx-2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-full border bg-background text-sm"
                data-testid="select-category-filter"
              >
                <option value="all">All Categories</option>
                <option value="Med Spa">Med Spa</option>
                <option value="Hair Salon">Hair Salon</option>
                <option value="Nail Salon">Nail Salon</option>
                <option value="Barbershop">Barbershop</option>
                <option value="Skincare">Skincare</option>
                <option value="Makeup Artist">Makeup Artist</option>
                <option value="Aesthetician">Aesthetician</option>
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 rounded-full border bg-background text-sm"
                data-testid="select-location-filter"
              >
                <option value="all">All Locations</option>
                <option value="Dallas">Dallas</option>
                <option value="Fort Worth">Fort Worth</option>
                <option value="Plano">Plano</option>
                <option value="Frisco">Frisco</option>
                <option value="Arlington">Arlington</option>
                <option value="McKinney">McKinney</option>
                <option value="Allen">Allen</option>
                <option value="Denton">Denton</option>
              </select>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container mx-auto px-4">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No businesses found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    data-testid={`business-card-${business.id}`}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={business.imageUrl}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg" data-testid={`business-name-${business.id}`}>
                          {business.name}
                        </h3>
                        {business.isClaimed && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                            data-testid={`badge-claimed-${business.id}`}
                          >
                            <Lock className="h-3 w-3" />
                            Claimed
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="mb-2">
                        {business.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {business.description}
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        {business.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{business.location}</span>
                          </div>
                        )}
                        {business.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{business.phone}</span>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                      {business.isClaimed ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled
                          data-testid={`button-claimed-disabled-${business.id}`}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Already Claimed
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handleOpenClaimDialog(business)}
                          data-testid={`button-claim-${business.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Claim This Listing
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim {selectedBusiness?.name}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitClaim)} className="space-y-4">
              <FormField
                control={form.control}
                name="claimantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} data-testid="input-claimant-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="claimantEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        data-testid="input-claimant-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="claimantPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...field}
                        data-testid="input-claimant-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why are you claiming this listing?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details about your relationship to this business..."
                        rows={4}
                        {...field}
                        data-testid="textarea-claim-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proofDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proof of Ownership (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="URL to business license, website, or other proof"
                        {...field}
                        data-testid="input-proof-document"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClaimDialogOpen(false)}
                  data-testid="button-cancel-claim"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={claimMutation.isPending}
                  data-testid="button-submit-claim"
                >
                  {claimMutation.isPending ? "Submitting..." : "Submit Claim Request"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, Star, TrendingUp, Gift, Mail, Phone, Calendar } from "lucide-react";
import type { Business, BusinessReview, UserBusinessFollow, User } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type FollowerWithUser = UserBusinessFollow & {
  user: User;
};

type ReviewWithUser = BusinessReview & {
  user: User;
};

const promotionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  promoType: z.enum(["discount", "feature", "trial", "recommendation"]),
  value: z.string().optional(),
  code: z.string().optional(),
  validUntil: z.string().optional(),
  userIds: z.array(z.number()).min(1, "Select at least one recipient"),
});

export default function BusinessDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch user's claimed businesses
  const { data: claimedBusinesses = [], isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses/claimed'],
    enabled: !!user,
  });

  const selectedBusiness = claimedBusinesses[0]; // For now, use the first claimed business

  // Fetch followers for the business
  const { data: followers = [], isLoading: followersLoading } = useQuery<FollowerWithUser[]>({
    queryKey: ['/api/businesses', selectedBusiness?.id, 'followers'],
    enabled: !!selectedBusiness,
  });

  // Fetch positive reviews (4-5 stars)
  const { data: positiveReviews = [], isLoading: reviewsLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ['/api/businesses', selectedBusiness?.id, 'positive-reviews'],
    enabled: !!selectedBusiness,
  });

  // Fetch all reviews
  const { data: allReviews = [], isLoading: allReviewsLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ['/api/businesses', selectedBusiness?.id, 'reviews'],
    enabled: !!selectedBusiness,
  });

  const form = useForm({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      description: "",
      promoType: "discount" as const,
      value: "",
      code: "",
      validUntil: "",
      userIds: [],
    },
  });

  const sendPromotionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof promotionSchema>) => {
      return apiRequest('POST', '/api/promotions/send', {
        ...data,
        businessId: selectedBusiness?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Promotions sent!",
        description: "Your offer has been sent to selected users.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send promotions. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || businessesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  if (claimedBusinesses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Claimed Businesses</CardTitle>
              <CardDescription>
                You don't have any claimed businesses yet. Claim a business to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation('/claim-listing')} data-testid="button-claim-business">
                Claim a Business
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    {
      title: "Followers",
      value: followers.length,
      icon: Users,
      description: "Users following your business",
    },
    {
      title: "Average Rating",
      value: selectedBusiness.rating ? (selectedBusiness.rating / 10).toFixed(1) : "0.0",
      icon: Star,
      description: `Based on ${selectedBusiness.reviewCount} reviews`,
    },
    {
      title: "Positive Reviews",
      value: positiveReviews.length,
      icon: TrendingUp,
      description: "4-5 star reviews",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0" style={{ backgroundColor: 'hsl(var(--dbb-background))' }}>
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl md:text-4xl mb-2 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
              data-testid="heading-business-dashboard"
            >
              Business Dashboard
            </h1>
            <p className="text-dbb-charcoalSoft" style={{ fontFamily: 'var(--font-body)' }}>
              {selectedBusiness.name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="followers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="followers" data-testid="tab-followers">
                Followers ({followers.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-reviews">
                Reviews ({allReviews.length})
              </TabsTrigger>
              <TabsTrigger value="promotions" data-testid="tab-promotions">
                Send Promotions
              </TabsTrigger>
            </TabsList>

            {/* Followers Tab */}
            <TabsContent value="followers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Followers</CardTitle>
                  <CardDescription>
                    Users who are following your business and receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {followersLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : followers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No followers yet. Encourage users to follow your business!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {followers.map((follower) => (
                        <div
                          key={follower.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={follower.user.profileImage || undefined} />
                              <AvatarFallback>
                                {follower.user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{follower.user.username}</p>
                              <p className="text-sm text-muted-foreground">
                                Followed on {new Date(follower.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            Follower
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    Reviews from customers (4-5 star reviews highlighted)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allReviewsLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : allReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet. Encourage satisfied customers to leave a review!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allReviews.map((review) => (
                        <div
                          key={review.id}
                          className={`p-4 border rounded-lg ${review.rating >= 4 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={review.user.profileImage || undefined} />
                                <AvatarFallback>
                                  {review.user.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.user.username}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {review.rating >= 4 && (
                              <Badge variant="default">
                                <Star className="h-3 w-3 mr-1" />
                                Positive
                              </Badge>
                            )}
                          </div>
                          {review.title && (
                            <h4 className="font-semibold mb-1">{review.title}</h4>
                          )}
                          <p className="text-sm text-muted-foreground mb-2">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Send Promotions Tab */}
            <TabsContent value="promotions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Send Promotions to Engaged Users</CardTitle>
                  <CardDescription>
                    Create and send special offers to your followers or customers who left positive reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => sendPromotionMutation.mutate(data))} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Promotion Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Spring Special - 20% Off" {...field} data-testid="input-promo-title" />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Get 20% off all services this spring. Valid for new and returning clients!" 
                                className="min-h-[100px]"
                                {...field} 
                                data-testid="textarea-promo-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="promoType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Promotion Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-promo-type">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="discount">Discount</SelectItem>
                                  <SelectItem value="feature">Featured Service</SelectItem>
                                  <SelectItem value="trial">Free Trial</SelectItem>
                                  <SelectItem value="recommendation">Recommendation</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="20%" {...field} data-testid="input-promo-value" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Promo Code (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="SPRING20" {...field} data-testid="input-promo-code" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="validUntil"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valid Until (optional)</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-promo-expiry" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="userIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Send To</FormLabel>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="all-followers"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange(followers.map(f => f.userId));
                                    } else {
                                      field.onChange([]);
                                    }
                                  }}
                                  data-testid="checkbox-all-followers"
                                />
                                <label htmlFor="all-followers" className="text-sm cursor-pointer">
                                  All Followers ({followers.length})
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="positive-reviewers"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const reviewerIds = positiveReviews.map(r => r.userId);
                                      const uniqueIds = Array.from(new Set([...field.value, ...reviewerIds]));
                                      field.onChange(uniqueIds);
                                    } else {
                                      const reviewerIdsSet = new Set(positiveReviews.map(r => r.userId));
                                      field.onChange(field.value.filter((id: number) => !reviewerIdsSet.has(id)));
                                    }
                                  }}
                                  data-testid="checkbox-positive-reviewers"
                                />
                                <label htmlFor="positive-reviewers" className="text-sm cursor-pointer">
                                  Positive Reviewers ({positiveReviews.length})
                                </label>
                              </div>
                            </div>
                            <FormMessage />
                            {field.value.length > 0 && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {field.value.length} recipient(s) selected
                              </p>
                            )}
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={sendPromotionMutation.isPending}
                        data-testid="button-send-promotion"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        {sendPromotionMutation.isPending ? "Sending..." : "Send Promotion"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

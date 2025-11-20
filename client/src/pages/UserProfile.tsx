import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Heart, Target, Gift, MessageSquare, Calendar, MapPin, Sparkles, Check, X } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GOAL_CATEGORIES, type BeautyBook, type Business, type UserGoal, type UserPromotion, type ForumPost } from "@shared/schema";

export default function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", category: "", targetDate: "" });

  const { data: profile, isLoading } = useQuery<{
    user: any;
    beautyBooks: BeautyBook[];
    goals: UserGoal[];
    promotions: UserPromotion[];
    followedBusinesses: Business[];
    forumPosts: ForumPost[];
  }>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const completeGoalMutation = useMutation({
    mutationFn: async (goalId: number) => {
      return apiRequest("POST", `/api/profile/goals/${goalId}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Goal completed! 🎉" });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: number) => {
      return apiRequest("DELETE", `/api/profile/goals/${goalId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Goal deleted" });
    },
  });

  const addGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      return apiRequest("POST", "/api/profile/goals", goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsAddGoalOpen(false);
      setNewGoal({ title: "", description: "", category: "", targetDate: "" });
      toast({ title: "Goal added!" });
    },
  });

  const usePromotionMutation = useMutation({
    mutationFn: async (promoId: number) => {
      return apiRequest("POST", `/api/profile/promotions/${promoId}/use`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Promotion claimed! 🎁" });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" data-testid="profile-login-required">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const beautyBook = profile?.beautyBooks?.[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {profile?.user.profileImage && (
            <img 
              src={profile.user.profileImage} 
              alt={profile.user.username}
              className="w-20 h-20 rounded-full"
              data-testid="profile-image"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold" data-testid="profile-username">{profile?.user.username}</h1>
            <p className="text-muted-foreground" data-testid="profile-email">{profile?.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="goals" data-testid="tab-goals">
            Goals {profile?.goals && profile.goals.length > 0 && `(${profile.goals.filter(g => !g.completed).length})`}
          </TabsTrigger>
          <TabsTrigger value="follows" data-testid="tab-follows">
            Following {profile?.followedBusinesses && `(${profile.followedBusinesses.length})`}
          </TabsTrigger>
          <TabsTrigger value="promotions" data-testid="tab-promotions">
            Promotions {profile?.promotions && `(${profile.promotions.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {beautyBook && (
            <Card data-testid="beauty-book-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle>Your Beauty Book</CardTitle>
                </div>
                <CardDescription>Created {format(new Date(beautyBook.createdAt), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Location</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{beautyBook.city}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Enhancement Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {(beautyBook.enhanceAreas as string[]).map((area) => (
                      <Badge key={area} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Vibe Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {(beautyBook.vibe as string[]).map((v) => (
                      <Badge key={v} variant="outline">{v}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Beauty Routine</p>
                  <p className="text-muted-foreground">{beautyBook.frequency}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.forumPosts && profile.forumPosts.length > 0 ? (
                profile.forumPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="pb-4 border-b last:border-0">
                    <Link href={`/community`}>
                      <div className="flex items-start gap-3 hover-elevate p-3 rounded-md">
                        <MessageSquare className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{post.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No community posts yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Beauty Goals</h2>
              <p className="text-muted-foreground">Track your beauty and wellness journey</p>
            </div>
            <Button onClick={() => setIsAddGoalOpen(true)} data-testid="button-add-goal">
              <Target className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="grid gap-4">
            {profile?.goals && profile.goals.length > 0 ? (
              profile.goals.map((goal) => (
                <Card key={goal.id} className={goal.completed ? "opacity-60" : ""} data-testid={`goal-${goal.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          {goal.completed && (
                            <Badge variant="default" className="bg-green-500">
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {goal.category && (
                            <Badge variant="outline">{goal.category}</Badge>
                          )}
                        </div>
                        {goal.description && (
                          <p className="text-muted-foreground mb-3">{goal.description}</p>
                        )}
                        {goal.targetDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Target: {format(new Date(goal.targetDate), "MMMM d, yyyy")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!goal.completed && (
                          <Button 
                            size="sm" 
                            onClick={() => completeGoalMutation.mutate(goal.id)}
                            data-testid={`button-complete-goal-${goal.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteGoalMutation.mutate(goal.id)}
                          data-testid={`button-delete-goal-${goal.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground mb-4">Start tracking your beauty and wellness goals</p>
                  <Button onClick={() => setIsAddGoalOpen(true)}>Add Your First Goal</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="follows" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Following</h2>
            <p className="text-muted-foreground">Businesses you're keeping track of</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {profile?.followedBusinesses && profile.followedBusinesses.length > 0 ? (
              profile.followedBusinesses.map((business) => (
                <Link key={business.id} href={`/business/${business.id}`}>
                  <Card className="hover-elevate" data-testid={`followed-business-${business.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <img 
                          src={business.imageUrl} 
                          alt={business.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{business.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{business.category}</Badge>
                            <span className="text-sm text-muted-foreground">{business.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Not following any businesses yet</h3>
                  <p className="text-muted-foreground mb-4">Discover businesses and follow your favorites</p>
                  <Link href="/businesses">
                    <Button>Browse Businesses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Your Promotions</h2>
            <p className="text-muted-foreground">Personalized offers and deals</p>
          </div>

          <div className="grid gap-4">
            {profile?.promotions && profile.promotions.length > 0 ? (
              profile.promotions.map((promo) => (
                <Card key={promo.id} className={promo.used ? "opacity-60" : ""} data-testid={`promotion-${promo.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{promo.title}</h3>
                          <Badge variant={promo.used ? "secondary" : "default"}>
                            {promo.promoType}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{promo.description}</p>
                        {promo.value && (
                          <p className="text-primary font-semibold mb-2">{promo.value}</p>
                        )}
                        {promo.code && (
                          <div className="inline-block bg-muted px-3 py-1 rounded-md font-mono text-sm mb-2">
                            {promo.code}
                          </div>
                        )}
                        {promo.validUntil && (
                          <p className="text-sm text-muted-foreground">
                            Valid until {format(new Date(promo.validUntil), "MMMM d, yyyy")}
                          </p>
                        )}
                        {promo.used && promo.usedAt && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Used on {format(new Date(promo.usedAt), "MMMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      {!promo.used && (
                        <Button 
                          onClick={() => usePromotionMutation.mutate(promo.id)}
                          data-testid={`button-use-promotion-${promo.id}`}
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No promotions yet</h3>
                  <p className="text-muted-foreground">Personalized offers will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent data-testid="dialog-add-goal">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title</Label>
              <Input 
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Achieve clear skin"
                data-testid="input-goal-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal..."
                data-testid="textarea-goal-description"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                <SelectTrigger data-testid="select-goal-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date (optional)</Label>
              <Input 
                id="targetDate"
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                data-testid="input-goal-target-date"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                const goalData: any = {
                  title: newGoal.title,
                };
                if (newGoal.description?.trim()) {
                  goalData.description = newGoal.description;
                }
                if (newGoal.category) {
                  goalData.category = newGoal.category;
                }
                if (newGoal.targetDate) {
                  goalData.targetDate = newGoal.targetDate;
                }
                addGoalMutation.mutate(goalData);
              }}
              disabled={!newGoal.title}
              data-testid="button-save-goal"
            >
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

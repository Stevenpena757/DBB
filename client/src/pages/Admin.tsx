import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Users, Building2, FileCheck, BarChart3, ExternalLink, CreditCard } from "lucide-react";
import type { User, Business, ClaimRequest, PendingBusiness, Subscription } from "@shared/schema";
import { format } from "date-fns";

export default function Admin() {
  const { toast } = useToast();

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"]
  });

  const { data: businesses, isLoading: loadingBusinesses } = useQuery<Business[]>({
    queryKey: ["/api/admin/businesses"]
  });

  const { data: claims, isLoading: loadingClaims } = useQuery<ClaimRequest[]>({
    queryKey: ["/api/admin/claims"]
  });

  const { data: pendingBusinesses, isLoading: loadingPendingBusinesses } = useQuery<PendingBusiness[]>({
    queryKey: ["/api/admin/pending-businesses"]
  });

  const { data: subscriptionsData, isLoading: loadingSubscriptions } = useQuery<Array<{ subscription: Subscription; business: Business }>>({
    queryKey: ["/api/admin/subscriptions"]
  });

  const { data: stats, isLoading: loadingStats } = useQuery<{
    totalUsers: number;
    totalBusinesses: number;
    totalArticles: number;
    totalHowTos: number;
    totalVendors: number;
    claimedBusinesses: number;
    pendingClaims: number;
    freeBusinesses: number;
    proBusinesses: number;
    premiumBusinesses: number;
  }>({
    queryKey: ["/api/admin/stats"]
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to update user role");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "User role updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
    }
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async ({ businessId, updates }: { businessId: number; updates: any }) => {
      const response = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to update business");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Business updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update business", variant: "destructive" });
    }
  });

  const updateClaimMutation = useMutation({
    mutationFn: async ({ claimId, status }: { claimId: number; status: string }) => {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to update claim");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/claims"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Claim request updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update claim request", variant: "destructive" });
    }
  });

  const approvePendingBusinessMutation = useMutation({
    mutationFn: async (pendingId: number) => {
      const response = await fetch(`/api/admin/pending-businesses/${pendingId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to approve listing");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Business listing approved and published" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve business listing", variant: "destructive" });
    }
  });

  const rejectPendingBusinessMutation = useMutation({
    mutationFn: async ({ pendingId, reason }: { pendingId: number; reason: string }) => {
      const response = await fetch(`/api/admin/pending-businesses/${pendingId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNotes: reason }),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to reject listing");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-businesses"] });
      toast({ title: "Success", description: "Business listing rejected" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject business listing", variant: "destructive" });
    }
  });

  const refundSubscriptionMutation = useMutation({
    mutationFn: async ({ subscriptionId, amount, reason }: { subscriptionId: number; amount?: number; reason?: string }) => {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason }),
        credentials: "include"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process refund");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriptions"] });
      toast({ title: "Success", description: "Refund processed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, businesses, and platform content</p>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="businesses" data-testid="tab-businesses">
              <Building2 className="h-4 w-4 mr-2" />
              Businesses
            </TabsTrigger>
            <TabsTrigger value="subscriptions" data-testid="tab-subscriptions">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="claims" data-testid="tab-claims">
              <FileCheck className="h-4 w-4 mr-2" />
              Claims
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              <Building2 className="h-4 w-4 mr-2" />
              Pending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            {loadingStats ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-muted rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : stats ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card data-testid="stat-total-users">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  </CardContent>
                </Card>
                <Card data-testid="stat-total-businesses">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalBusinesses}</div>
                  </CardContent>
                </Card>
                <Card data-testid="stat-claimed-businesses">
                  <CardHeader className="pb-2">
                    <CardDescription>Claimed Businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.claimedBusinesses}</div>
                  </CardContent>
                </Card>
                <Card data-testid="stat-pending-claims">
                  <CardHeader className="pb-2">
                    <CardDescription>Pending Claims</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.pendingClaims}</div>
                  </CardContent>
                </Card>
                <Card data-testid="stat-total-articles">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalArticles}</div>
                  </CardContent>
                </Card>
                <Card data-testid="stat-total-howtos">
                  <CardHeader className="pb-2">
                    <CardDescription>Total How-Tos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalHowTos}</div>
                  </CardContent>
                </Card>
                <Card data-testid="stat-total-vendors">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalVendors}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Subscription Tiers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Free:</span>
                      <span className="font-medium">{stats.freeBusinesses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pro:</span>
                      <span className="font-medium">{stats.proBusinesses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Premium:</span>
                      <span className="font-medium">{stats.premiumBusinesses}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users?.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-md"
                        data-testid={`user-item-${user.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" data-testid={`user-name-${user.id}`}>
                            {user.username}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"} data-testid={`user-role-${user.id}`}>
                            {user.role}
                          </Badge>
                          <Select
                            value={user.role}
                            onValueChange={(role) => updateUserRoleMutation.mutate({ userId: user.id, role })}
                            disabled={updateUserRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-40" data-testid={`select-role-${user.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="business_owner">Business Owner</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="businesses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Businesses Management</CardTitle>
                <CardDescription>Manage business subscriptions and featured status</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBusinesses ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {businesses?.map((business) => (
                      <div
                        key={business.id}
                        className="flex flex-col gap-4 p-4 border rounded-md"
                        data-testid={`business-item-${business.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate" data-testid={`business-name-${business.id}`}>
                              {business.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {business.category} • {business.location}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" data-testid={`business-tier-${business.id}`}>
                              {business.subscriptionTier}
                            </Badge>
                            {business.featured && <Badge>Featured</Badge>}
                            {business.isClaimed && <Badge variant="outline">Claimed</Badge>}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Select
                            value={business.subscriptionTier}
                            onValueChange={(tier) =>
                              updateBusinessMutation.mutate({
                                businessId: business.id,
                                updates: { subscriptionTier: tier }
                              })
                            }
                            disabled={updateBusinessMutation.isPending}
                          >
                            <SelectTrigger className="w-36" data-testid={`select-tier-${business.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant={business.featured ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              updateBusinessMutation.mutate({
                                businessId: business.id,
                                updates: { featured: !business.featured }
                              })
                            }
                            disabled={updateBusinessMutation.isPending}
                            data-testid={`button-toggle-featured-${business.id}`}
                          >
                            {business.featured ? "Remove Featured" : "Make Featured"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>View and manage all active subscriptions and process refunds</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSubscriptions ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : subscriptionsData && subscriptionsData.length > 0 ? (
                  <div className="space-y-4">
                    {subscriptionsData.map(({ subscription, business }) => (
                      <div
                        key={subscription.id}
                        className="flex flex-col gap-4 p-4 border rounded-md"
                        data-testid={`subscription-item-${subscription.id}`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Business</div>
                            <div className="font-medium" data-testid={`subscription-business-${subscription.id}`}>
                              {business.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {business.location}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Subscription</div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={subscription.tier === "premium" ? "default" : "secondary"}
                                data-testid={`subscription-tier-${subscription.id}`}
                              >
                                {subscription.tier.toUpperCase()}
                              </Badge>
                              <Badge 
                                variant={
                                  subscription.status === "active" ? "default" : 
                                  subscription.status === "past_due" ? "destructive" : 
                                  "secondary"
                                }
                                data-testid={`subscription-status-${subscription.id}`}
                              >
                                {subscription.status}
                              </Badge>
                              {subscription.cancelAtPeriodEnd && (
                                <Badge variant="outline">Canceling</Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Billing Period</div>
                            <div className="text-sm">
                              {format(new Date(subscription.currentPeriodStart), "MMM d, yyyy")}
                              {" - "}
                              {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div>Customer ID: {subscription.stripeCustomerId}</div>
                          <div>•</div>
                          <div>Subscription ID: {subscription.stripeSubscriptionId}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`, '_blank')}
                            data-testid={`button-view-stripe-${subscription.id}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in Stripe
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to issue a full refund for this subscription? This action cannot be undone.")) {
                                refundSubscriptionMutation.mutate({ 
                                  subscriptionId: subscription.id,
                                  reason: "requested_by_customer"
                                });
                              }
                            }}
                            disabled={refundSubscriptionMutation.isPending || subscription.status !== "active"}
                            data-testid={`button-refund-${subscription.id}`}
                          >
                            Issue Refund
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active subscriptions found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Claim Requests</CardTitle>
                <CardDescription>Review and approve business claim requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingClaims ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claims?.filter(c => c.status === "pending").length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No pending claim requests
                      </div>
                    ) : null}
                    {claims
                      ?.filter(c => c.status === "pending")
                      .map((claim) => (
                        <div
                          key={claim.id}
                          className="flex flex-col gap-4 p-4 border rounded-md"
                          data-testid={`claim-item-${claim.id}`}
                        >
                          <div>
                            <div className="font-medium" data-testid={`claim-name-${claim.id}`}>
                              {claim.claimantName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {claim.claimantEmail} • {claim.claimantPhone}
                            </div>
                            <div className="text-sm mt-2">{claim.message}</div>
                            {claim.proofDocumentUrl && (
                              <div className="mt-2">
                                <a 
                                  href={`/api/admin/proof/${claim.proofDocumentUrl}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                  data-testid={`link-proof-document-${claim.id}`}
                                >
                                  <FileCheck className="h-4 w-4" />
                                  View Proof Document
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                updateClaimMutation.mutate({ claimId: claim.id, status: "approved" })
                              }
                              disabled={updateClaimMutation.isPending}
                              data-testid={`button-approve-claim-${claim.id}`}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateClaimMutation.mutate({ claimId: claim.id, status: "rejected" })
                              }
                              disabled={updateClaimMutation.isPending}
                              data-testid={`button-reject-claim-${claim.id}`}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Business Listings</CardTitle>
                <CardDescription>Review and approve or reject new business submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPendingBusinesses ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : !pendingBusinesses || pendingBusinesses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pending business listings</p>
                ) : (
                  <div className="space-y-4">
                    {pendingBusinesses.map((pending) => (
                      <div key={pending.id} className="p-4 border rounded-lg space-y-3" data-testid={`pending-business-${pending.id}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg" data-testid={`text-pending-name-${pending.id}`}>{pending.name}</h3>
                              <Badge variant="outline">{pending.category}</Badge>
                              <Badge variant="secondary">{pending.location}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{pending.description}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              {pending.phone && <span>Phone: {pending.phone}</span>}
                              {pending.email && <span>Email: {pending.email}</span>}
                              {pending.website && (
                                <a href={pending.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                  Website <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            {(pending.instagramHandle || pending.tiktokHandle || pending.facebookUrl) && (
                              <div className="flex gap-2 text-sm">
                                {pending.instagramHandle && <Badge variant="outline">IG: {pending.instagramHandle}</Badge>}
                                {pending.tiktokHandle && <Badge variant="outline">TikTok: {pending.tiktokHandle}</Badge>}
                                {pending.facebookUrl && <Badge variant="outline">Facebook</Badge>}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground pt-2">
                              Submitted: {new Date(pending.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => approvePendingBusinessMutation.mutate(pending.id)}
                              disabled={approvePendingBusinessMutation.isPending || rejectPendingBusinessMutation.isPending}
                              data-testid={`button-approve-pending-${pending.id}`}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const reason = prompt("Reason for rejection:");
                                if (reason) {
                                  rejectPendingBusinessMutation.mutate({ pendingId: pending.id, reason });
                                }
                              }}
                              disabled={approvePendingBusinessMutation.isPending || rejectPendingBusinessMutation.isPending}
                              data-testid={`button-reject-pending-${pending.id}`}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

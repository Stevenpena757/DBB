import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FileText, Lightbulb, Bookmark, LogIn, Heart } from "lucide-react";
import type { Article, HowTo, Save, Business } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    enabled: isAuthenticated,
  });

  const { data: howTos = [] } = useQuery<HowTo[]>({
    queryKey: ['/api/how-tos'],
    enabled: isAuthenticated,
  });

  const { data: saves = [] } = useQuery<Save[]>({
    queryKey: ['/api/saves'],
    enabled: isAuthenticated,
  });

  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <LogIn className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Login Required</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/login" className="block">
              <Button className="w-full" size="lg" data-testid="button-login-dashboard">
                Log In to Continue
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter content by user - will need to query by userId once backend supports it
  const userArticles = articles;
  const userHowTos = howTos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {user?.username}!
          </h1>
          <p className="text-muted-foreground">Manage your content, businesses, and saved items</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold" data-testid="stat-articles">{userArticles.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">How-Tos</p>
                  <p className="text-2xl font-bold" data-testid="stat-howtos">{userHowTos.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saved</p>
                  <p className="text-2xl font-bold" data-testid="stat-saves">{saves.length}</p>
                </div>
                <Bookmark className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold" data-testid="stat-views">
                    {userArticles.reduce((sum, a) => sum + (a.views || 0), 0)}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">My Content</TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
            <TabsTrigger value="businesses">My Businesses</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Content</h2>
              <a href="/submit-content">
                <Button data-testid="button-submit-new">Submit New Content</Button>
              </a>
            </div>

            {userArticles.length === 0 && userHowTos.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No content yet</h3>
                  <p className="text-muted-foreground mb-4">Start sharing your expertise to grow your business</p>
                  <a href="/submit-content">
                    <Button>Create Your First Post</Button>
                  </a>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {userArticles.map((article) => (
                <Card key={article.id} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img src={article.imageUrl} alt={article.title} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" /> {article.upvotes || 0} upvotes
                          </span>
                          <span>{article.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {userHowTos.map((howTo) => (
                <Card key={howTo.id} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img src={howTo.imageUrl} alt={howTo.title} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <h3 className="font-bold text-lg">{howTo.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{howTo.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" /> {howTo.upvotes || 0} upvotes
                          </span>
                          <span>{Array.isArray(howTo.steps) ? howTo.steps.length : 0} steps</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Saved Items</h2>
            
            {saves.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved items yet</h3>
                  <p className="text-muted-foreground mb-4">Start saving content you love</p>
                  <a href="/">
                    <Button>Explore Content</Button>
                  </a>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {saves.map((save) => (
                <Card key={save.id} className="hover-elevate" data-testid={`save-${save.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">{save.itemType}</span>
                      <Bookmark className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Item ID: {save.itemId}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="businesses" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Businesses</h2>
              <a href="/businesses">
                <Button variant="outline" data-testid="button-browse-businesses">Browse Businesses</Button>
              </a>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No businesses claimed yet</h3>
                <p className="text-muted-foreground mb-4">Find and claim your business to start managing it</p>
                <a href="/businesses">
                  <Button>Find My Business</Button>
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

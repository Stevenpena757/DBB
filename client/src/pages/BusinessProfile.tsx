import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Globe, MapPin, Instagram, Facebook, Bookmark, Share2, CheckCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { Business, Article, HowTo } from "@shared/schema";

const claimFormSchema = z.object({
  claimantName: z.string().min(2, "Name required"),
  claimantEmail: z.string().email("Valid email required"),
  claimantPhone: z.string().min(10, "Valid phone required"),
  message: z.string().min(10, "Please provide more details"),
});

export default function BusinessProfile() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: business, isLoading } = useQuery<Business>({
    queryKey: [`/api/businesses/${id}`],
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', id],
    enabled: !!id,
  });

  const { data: howTos = [] } = useQuery<HowTo[]>({
    queryKey: ['/api/how-tos', id],
    enabled: !!id,
  });

  const claimForm = useForm({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      claimantName: "",
      claimantEmail: "",
      claimantPhone: "",
      message: "",
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (data: z.infer<typeof claimFormSchema>) => {
      return apiRequest(`/api/claim-requests`, {
        method: "POST",
        body: JSON.stringify({ ...data, businessId: parseInt(id!), status: "pending" }),
      });
    },
    onSuccess: () => {
      toast({ title: "Claim request submitted!", description: "We'll review and get back to you soon." });
      claimForm.reset();
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!business) {
    return <div className="min-h-screen flex items-center justify-center">Business not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-4">
            <img 
              src={business.imageUrl} 
              alt={business.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-business-name">{business.name}</h1>
                {business.isClaimed && (
                  <CheckCircle className="h-6 w-6 text-primary" data-testid="icon-claimed" />
                )}
              </div>
              <p className="text-muted-foreground text-lg mb-2">{business.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-muted rounded-full text-sm">{business.category}</span>
                <span className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {business.location}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" data-testid="button-save">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
              {!business.isClaimed && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-claim-business">Claim This Business</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Claim {business.name}</DialogTitle>
                    </DialogHeader>
                    <Form {...claimForm}>
                      <form onSubmit={claimForm.handleSubmit((data) => claimMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={claimForm.control}
                          name="claimantName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-claimant-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={claimForm.control}
                          name="claimantEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} data-testid="input-claimant-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={claimForm.control}
                          name="claimantPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-claimant-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={claimForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why are you claiming this business?</FormLabel>
                              <FormControl>
                                <Textarea {...field} data-testid="textarea-claim-message" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" data-testid="button-submit-claim">
                          Submit Claim Request
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {articles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Articles</h2>
                <div className="space-y-3">
                  {articles.map(article => (
                    <Card key={article.id} className="hover-elevate cursor-pointer">
                      <CardContent className="p-4 flex gap-4">
                        <img src={article.imageUrl} alt={article.title} className="w-24 h-24 rounded-md object-cover" />
                        <div>
                          <h3 className="font-semibold mb-1">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                          <p className="text-xs text-muted-foreground mt-2">{article.views} views</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {howTos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">How-To Guides</h2>
                <div className="space-y-3">
                  {howTos.map(howTo => (
                    <Card key={howTo.id} className="hover-elevate cursor-pointer">
                      <CardContent className="p-4 flex gap-4">
                        <img src={howTo.imageUrl} alt={howTo.title} className="w-24 h-24 rounded-md object-cover" />
                        <div>
                          <h3 className="font-semibold mb-1">{howTo.title}</h3>
                          <p className="text-sm text-muted-foreground">{howTo.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">Contact Information</h3>
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                    <Phone className="h-4 w-4" />
                    {business.phone}
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
                {business.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {business.address}
                  </div>
                )}
              </CardContent>
            </Card>

            {(business.instagramHandle || business.tiktokHandle || business.facebookUrl) && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold">Social Media</h3>
                  {business.instagramHandle && (
                    <a href={`https://instagram.com/${business.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                      <Instagram className="h-4 w-4" />
                      {business.instagramHandle}
                    </a>
                  )}
                  {business.tiktokHandle && (
                    <a href={`https://tiktok.com/@${business.tiktokHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                      <SiTiktok className="h-4 w-4" />
                      {business.tiktokHandle}
                    </a>
                  )}
                  {business.facebookUrl && (
                    <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
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
import { Phone, Mail, Globe, MapPin, Instagram, Facebook, Bookmark, Share2, CheckCircle, Upload, FileCheck } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { Business, Article, HowTo } from "@shared/schema";
import { localBusinessJsonLd, injectJsonLd, removeJsonLd } from "@/lib/schema";

const claimFormSchema = z.object({
  claimantName: z.string().min(2, "Name required"),
  claimantEmail: z.string().email("Valid email required"),
  claimantPhone: z.string().min(10, "Valid phone required"),
  message: z.string().min(10, "Please provide more details"),
});

export default function BusinessProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [proofDocument, setProofDocument] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    mutationFn: async (data: z.infer<typeof claimFormSchema> & { proofDocumentUrl?: string }) => {
      const response = await fetch(`/api/claim-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, businessId: parseInt(id!), status: "pending" }),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to submit claim request");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Claim request submitted!", description: "We'll review and get back to you soon." });
      claimForm.reset();
      setProofDocument(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofDocument(e.target.files[0]);
    }
  };

  const handleClaimSubmit = async (data: z.infer<typeof claimFormSchema>) => {
    try {
      setIsUploading(true);
      let proofDocumentUrl: string | undefined;

      // Upload proof document if provided
      if (proofDocument) {
        const formData = new FormData();
        formData.append('document', proofDocument);

        const uploadResponse = await fetch('/api/upload/proof-document', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload document');
        }

        const uploadData = await uploadResponse.json();
        proofDocumentUrl = uploadData.filename;
      }

      // Submit claim request with document filename
      await claimMutation.mutateAsync({ ...data, proofDocumentUrl });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to submit claim request. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!business) {
    return <div className="min-h-screen flex items-center justify-center">Business not found</div>;
  }

  useEffect(() => {
    if (business) {
      const schema = localBusinessJsonLd(business);
      injectJsonLd(schema, 'local-business-jsonld');
    }
    return () => {
      removeJsonLd('local-business-jsonld');
    };
  }, [business]);

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
                      <form onSubmit={claimForm.handleSubmit(handleClaimSubmit)} className="space-y-4">
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
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Proof of Ownership (utility bill, business license, etc.)
                          </label>
                          <div className="border-2 border-dashed rounded-md p-4 hover-elevate cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="hidden"
                              id="proof-document-upload"
                              data-testid="input-proof-document"
                            />
                            <label
                              htmlFor="proof-document-upload"
                              className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                              {proofDocument ? (
                                <>
                                  <FileCheck className="h-8 w-8 text-primary" />
                                  <span className="text-sm font-medium">{proofDocument.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {(proofDocument.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Click to upload document
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    JPG, PNG, or PDF (max 10MB)
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload a utility bill, business license, or other proof that you own this business
                          </p>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          data-testid="button-submit-claim"
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Submit Claim Request"}
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

            {(business.address || business.location) && (
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="w-full" style={{ height: '250px' }} data-testid="map-container">
                    <iframe
                      title={`Map showing location of ${business.name}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address || `${business.name}, ${business.location}`)}&output=embed`}
                      data-testid="map-iframe"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}

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

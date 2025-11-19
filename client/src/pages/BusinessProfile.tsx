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
import { Phone, Mail, Globe, MapPin, Instagram, Facebook, Bookmark, Share2, CheckCircle, Upload, FileCheck, Send } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { Business, Article, HowTo } from "@shared/schema";
import { localBusinessJsonLd, injectJsonLd, removeJsonLd } from "@/lib/schema";
import { DbbCard, DbbButtonPrimary, DbbTag } from "@/components/dbb/DbbComponents";

const claimFormSchema = z.object({
  claimantName: z.string().min(2, "Name required"),
  claimantEmail: z.string().email("Valid email required"),
  claimantPhone: z.string().min(10, "Valid phone required"),
  message: z.string().min(10, "Please provide more details"),
});

const leadFormSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  message: z.string().min(10, "Please tell us about your needs"),
  serviceInterest: z.string().optional(),
});

export default function BusinessProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [proofDocument, setProofDocument] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

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

  const leadForm = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      serviceInterest: "",
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

  const leadMutation = useMutation({
    mutationFn: async (data: z.infer<typeof leadFormSchema>) => {
      const response = await fetch(`/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          businessId: parseInt(id!),
          source: "profile_page",
        }),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to submit lead");
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Message sent!", 
        description: "The business will receive your inquiry and contact you soon." 
      });
      leadForm.reset();
      setIsLeadModalOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to send message. Please try again.",
        variant: "destructive" 
      });
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

  const handleLeadSubmit = (data: z.infer<typeof leadFormSchema>) => {
    leadMutation.mutate(data);
  };

  useEffect(() => {
    if (business) {
      const schema = localBusinessJsonLd(business);
      injectJsonLd(schema, 'local-business-jsonld');
    }
    return () => {
      removeJsonLd('local-business-jsonld');
    };
  }, [business]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dbb-eucalyptus border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dbb-charcoalSoft">Loading...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-dbb-charcoal mb-2">Business not found</h2>
          <p className="text-dbb-charcoalSoft">This listing may have been removed or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const mockServices = [
    "Botox & Dysport",
    "Dermal Fillers",
    "Laser Hair Removal",
    "Chemical Peels",
    "Microneedling",
    "Facials"
  ];

  const mockGallery = [
    business.imageUrl,
    business.imageUrl,
    business.imageUrl,
    business.imageUrl,
    business.imageUrl,
    business.imageUrl,
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-6 shadow-md">
            <img 
              src={business.imageUrl} 
              alt={business.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h1 
                  className="text-4xl md:text-5xl text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                  data-testid="text-business-name"
                >
                  {business.name}
                </h1>
                {business.isClaimed && (
                  <CheckCircle className="h-7 w-7 text-dbb-eucalyptus" data-testid="icon-claimed" />
                )}
              </div>
              <p className="text-dbb-charcoalSoft text-lg mb-4 leading-relaxed">{business.description}</p>
              <div className="flex flex-wrap gap-2">
                <DbbTag>{business.category}</DbbTag>
                <DbbTag>
                  <MapPin className="h-3 w-3 mr-1" /> {business.location}
                </DbbTag>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="rounded-full" data-testid="button-save">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
              <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
                <DialogTrigger asChild>
                  <DbbButtonPrimary data-testid="button-contact-business">
                    <Send className="h-4 w-4 mr-2" />
                    Get in Touch
                  </DbbButtonPrimary>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-dbb-charcoal" style={{ fontFamily: 'var(--font-heading)' }}>
                      Contact {business.name}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...leadForm}>
                    <form onSubmit={leadForm.handleSubmit(handleLeadSubmit)} className="space-y-4">
                      <FormField
                        control={leadForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-lead-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leadForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-lead-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leadForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-lead-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leadForm.control}
                        name="serviceInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Interest (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Botox consultation" {...field} data-testid="input-service-interest" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leadForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your needs..." 
                                {...field} 
                                data-testid="textarea-lead-message"
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DbbButtonPrimary 
                        type="submit" 
                        className="w-full" 
                        data-testid="button-submit-lead"
                        disabled={leadMutation.isPending}
                      >
                        {leadMutation.isPending ? "Sending..." : "Send Message"}
                      </DbbButtonPrimary>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              {!business.isClaimed && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full" data-testid="button-claim-business">
                      Claim This Business
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-dbb-charcoal" style={{ fontFamily: 'var(--font-heading)' }}>
                        Claim {business.name}
                      </DialogTitle>
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
                          <div className="border-2 border-dashed border-dbb-borderSoft rounded-xl p-4 hover-elevate cursor-pointer bg-dbb-surface">
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
                                  <FileCheck className="h-8 w-8 text-dbb-eucalyptus" />
                                  <span className="text-sm font-medium text-dbb-charcoal">{proofDocument.name}</span>
                                  <span className="text-xs text-dbb-charcoalSoft">
                                    {(proofDocument.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-dbb-charcoalSoft" />
                                  <span className="text-sm text-dbb-charcoalSoft">
                                    Click to upload document
                                  </span>
                                  <span className="text-xs text-dbb-charcoalSoft">
                                    JPG, PNG, or PDF (max 10MB)
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                          <p className="text-xs text-dbb-charcoalSoft">
                            Upload a utility bill, business license, or other proof that you own this business
                          </p>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full rounded-full" 
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 
                className="text-3xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Services & Treatments
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mockServices.map((service, idx) => (
                  <DbbCard key={idx} className="p-5 hover-elevate cursor-pointer">
                    <p className="text-center text-dbb-charcoal font-medium">{service}</p>
                  </DbbCard>
                ))}
              </div>
            </section>

            <section>
              <h2 
                className="text-3xl mb-6 text-dbb-charcoal"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Gallery
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mockGallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-md hover-elevate cursor-pointer">
                    <img 
                      src={img} 
                      alt={`${business.name} gallery ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            {articles.length > 0 && (
              <section>
                <h2 
                  className="text-3xl mb-6 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Articles
                </h2>
                <div className="space-y-4">
                  {articles.map(article => (
                    <DbbCard key={article.id} className="hover-elevate cursor-pointer">
                      <CardContent className="p-5 flex gap-4">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-28 h-28 rounded-xl object-cover flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 text-dbb-charcoal">{article.title}</h3>
                          <p className="text-sm text-dbb-charcoalSoft mb-2 line-clamp-2">{article.excerpt}</p>
                          <p className="text-xs text-dbb-charcoalSoft">{article.views} views</p>
                        </div>
                      </CardContent>
                    </DbbCard>
                  ))}
                </div>
              </section>
            )}

            {howTos.length > 0 && (
              <section>
                <h2 
                  className="text-3xl mb-6 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  How-To Guides
                </h2>
                <div className="space-y-4">
                  {howTos.map(howTo => (
                    <DbbCard key={howTo.id} className="hover-elevate cursor-pointer">
                      <CardContent className="p-5 flex gap-4">
                        <img 
                          src={howTo.imageUrl} 
                          alt={howTo.title} 
                          className="w-28 h-28 rounded-xl object-cover flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 text-dbb-charcoal">{howTo.title}</h3>
                          <p className="text-sm text-dbb-charcoalSoft line-clamp-2">{howTo.description}</p>
                        </div>
                      </CardContent>
                    </DbbCard>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <DbbCard>
              <CardContent className="p-6 space-y-4">
                <h3 
                  className="text-xl text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Contact Information
                </h3>
                {business.phone && (
                  <a 
                    href={`tel:${business.phone}`} 
                    className="flex items-center gap-3 text-sm hover:text-dbb-eucalyptus transition-colors"
                  >
                    <Phone className="h-4 w-4 text-dbb-charcoalSoft" />
                    <span className="text-dbb-charcoal">{business.phone}</span>
                  </a>
                )}
                {business.website && (
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 text-sm hover:text-dbb-eucalyptus transition-colors"
                  >
                    <Globe className="h-4 w-4 text-dbb-charcoalSoft" />
                    <span className="text-dbb-charcoal">Visit Website</span>
                  </a>
                )}
                {business.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-dbb-charcoalSoft mt-0.5" />
                    <span className="text-dbb-charcoal">{business.address}</span>
                  </div>
                )}
              </CardContent>
            </DbbCard>

            {(business.address || business.location) && (
              <DbbCard>
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
              </DbbCard>
            )}

            {(business.instagramHandle || business.tiktokHandle || business.facebookUrl) && (
              <DbbCard>
                <CardContent className="p-6 space-y-4">
                  <h3 
                    className="text-xl text-dbb-charcoal"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Social Media
                  </h3>
                  {business.instagramHandle && (
                    <a 
                      href={`https://instagram.com/${business.instagramHandle}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-sm hover:text-dbb-rose transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-dbb-charcoalSoft" />
                      <span className="text-dbb-charcoal">{business.instagramHandle}</span>
                    </a>
                  )}
                  {business.tiktokHandle && (
                    <a 
                      href={`https://tiktok.com/@${business.tiktokHandle}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-sm hover:text-dbb-rose transition-colors"
                    >
                      <SiTiktok className="h-4 w-4 text-dbb-charcoalSoft" />
                      <span className="text-dbb-charcoal">{business.tiktokHandle}</span>
                    </a>
                  )}
                  {business.facebookUrl && (
                    <a 
                      href={business.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-sm hover:text-dbb-rose transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-dbb-charcoalSoft" />
                      <span className="text-dbb-charcoal">Facebook</span>
                    </a>
                  )}
                </CardContent>
              </DbbCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

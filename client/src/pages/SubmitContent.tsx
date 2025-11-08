import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Lightbulb, Instagram, CheckCircle } from "lucide-react";
import type { Business } from "@shared/schema";
import { categories } from "@shared/schema";

const articleSchema = z.object({
  businessId: z.number(),
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  imageUrl: z.string().url("Must be a valid image URL"),
  category: z.string(),
});

const howToSchema = z.object({
  businessId: z.number(),
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  imageUrl: z.string().url("Must be a valid image URL"),
  category: z.string(),
  steps: z.array(z.object({
    step: z.number(),
    title: z.string(),
    content: z.string(),
  })).min(3, "Must have at least 3 steps"),
});

export default function SubmitContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("article");

  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  const articleForm = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      businessId: businesses[0]?.id || 1,
      title: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      category: "",
    },
  });

  const howToForm = useForm({
    resolver: zodResolver(howToSchema),
    defaultValues: {
      businessId: businesses[0]?.id || 1,
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      steps: [
        { step: 1, title: "", content: "" },
        { step: 2, title: "", content: "" },
        { step: 3, title: "", content: "" },
      ],
    },
  });

  const articleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof articleSchema>) => {
      return apiRequest('POST', '/api/articles', data);
    },
    onSuccess: () => {
      toast({ title: "Article submitted!", description: "Your article is now visible in the directory." });
      articleForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
  });

  const howToMutation = useMutation({
    mutationFn: async (data: z.infer<typeof howToSchema>) => {
      return apiRequest('POST', '/api/how-tos', data);
    },
    onSuccess: () => {
      toast({ title: "How-To submitted!", description: "Your guide is now visible in the directory." });
      howToForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/how-tos'] });
    },
  });

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary" style={{ fontFamily: 'Pacifico, cursive' }}>Get FREE Visibility</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Share your expertise and grow your business — no payment required
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Join our thriving community of DFW beauty professionals. Your contributions get upvoted by the community, 
            increasing your visibility and helping potential clients discover your services.
          </p>
        </div>

        <div className="bg-gradient-to-b from-primary/5 to-accent/10 p-6 rounded-2xl mb-8 border border-primary/10">
          <h2 className="text-xl font-bold mb-4 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Submit Content</h3>
              <p className="text-sm text-muted-foreground">Share articles, how-tos, or expert tips with the DFW beauty community</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Get Upvoted</h3>
              <p className="text-sm text-muted-foreground">Quality content gets upvoted by the community, boosting your visibility</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Grow Your Business</h3>
              <p className="text-sm text-muted-foreground">Higher visibility = more clients discovering your services organically</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="hover-elevate">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Write Articles</h3>
              <p className="text-sm text-muted-foreground">Share industry insights and expertise</p>
            </CardContent>
          </Card>
          <Card className="hover-elevate">
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Create How-Tos</h3>
              <p className="text-sm text-muted-foreground">Step-by-step guides and tutorials</p>
            </CardContent>
          </Card>
          <Card className="hover-elevate">
            <CardContent className="p-4 text-center">
              <Instagram className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Link Social Media</h3>
              <p className="text-sm text-muted-foreground">Connect Instagram, TikTok & more</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="article">Submit Article</TabsTrigger>
            <TabsTrigger value="how-to">Submit How-To Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="article">
            <Card>
              <CardHeader>
                <CardTitle>Submit an Article</CardTitle>
                <CardDescription>Share your knowledge and get discovered by potential clients</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...articleForm}>
                  <form onSubmit={articleForm.handleSubmit((data) => articleMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={articleForm.control}
                      name="businessId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Business</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString() || businesses[0]?.id.toString()}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-article-business">
                                <SelectValue placeholder="Select your business" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {businesses.map(b => (
                                <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={articleForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Article Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 5 Tips for Healthy Winter Hair" {...field} data-testid="input-article-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={articleForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-article-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={articleForm.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Brief summary..." {...field} data-testid="textarea-article-excerpt" />
                          </FormControl>
                          <FormDescription>A short preview of your article</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={articleForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Write your article..." rows={10} {...field} data-testid="textarea-article-content" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={articleForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} data-testid="input-article-image" />
                          </FormControl>
                          <FormDescription>Use a high-quality image related to your article</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={articleMutation.isPending} data-testid="button-submit-article">
                      {articleMutation.isPending ? "Submitting..." : "Submit Article"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-to">
            <Card>
              <CardHeader>
                <CardTitle>Submit a How-To Guide</CardTitle>
                <CardDescription>Create a step-by-step guide to showcase your expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...howToForm}>
                  <form onSubmit={howToForm.handleSubmit((data) => howToMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={howToForm.control}
                      name="businessId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Business</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString() || businesses[0]?.id.toString()}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-howto-business">
                                <SelectValue placeholder="Select your business" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {businesses.map(b => (
                                <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={howToForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guide Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., How to Apply Perfect Eyeliner" {...field} data-testid="input-howto-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={howToForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-howto-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={howToForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="What will users learn?" {...field} data-testid="textarea-howto-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={howToForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} data-testid="input-howto-image" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-3">
                      <FormLabel>Steps (minimum 3)</FormLabel>
                      {howToForm.watch("steps").map((_, index) => (
                        <div key={index} className="border rounded-md p-3 space-y-2">
                          <h4 className="text-sm font-semibold">Step {index + 1}</h4>
                          <FormField
                            control={howToForm.control}
                            name={`steps.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Step title..." {...field} data-testid={`input-step-${index}-title`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={howToForm.control}
                            name={`steps.${index}.content`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea placeholder="Step instructions..." {...field} data-testid={`textarea-step-${index}-content`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                    <Button type="submit" className="w-full" disabled={howToMutation.isPending} data-testid="button-submit-howto">
                      {howToMutation.isPending ? "Submitting..." : "Submit How-To Guide"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Why share content?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Get discovered by thousands of potential clients in DFW</li>
                <li>• Build trust by showcasing your expertise</li>
                <li>• Completely free - no payment required</li>
                <li>• Content appears immediately in the directory</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

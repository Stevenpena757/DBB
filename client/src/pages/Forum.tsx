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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ForumPost } from "@shared/schema";
import { MessageCircle, ThumbsUp, Eye, CheckCircle, Plus, Send, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DbbCard, DbbButtonPrimary, DbbTag, DbbSection } from "@/components/dbb/DbbComponents";

const createPostSchema = z.object({
  type: z.enum(["question", "tip"]),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

const leadCaptureSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  interests: z.string().min(5, "Please tell us your interests"),
});

export default function Forum() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);

  const postForm = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      type: "question",
      category: "",
      title: "",
      content: "",
    },
  });

  const leadForm = useForm<z.infer<typeof leadCaptureSchema>>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interests: "",
    },
  });

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (selectedType !== "all") {
      params.append("type", selectedType);
    }
    if (selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }
    return params.toString() ? `/api/forum?${params.toString()}` : "/api/forum";
  };

  const { data: posts = [], isLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum", selectedType, selectedCategory],
    queryFn: async () => {
      const url = buildQuery();
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch forum posts");
      return response.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: z.infer<typeof createPostSchema>) =>
      apiRequest("POST", "/api/forum", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum"] });
      setIsCreateDialogOpen(false);
      postForm.reset();
      toast({
        title: "Success",
        description: "Your post has been created!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const leadCaptureMutation = useMutation({
    mutationFn: async (data: z.infer<typeof leadCaptureSchema>) => {
      const response = await fetch(`/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          message: `Interested in: ${data.interests}`,
          source: "forum_recommendation",
        }),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thanks for reaching out!",
        description: "We'll send you personalized recommendations soon.",
      });
      leadForm.reset();
      setIsLeadCaptureOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/forum/${id}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum"] });
    },
  });

  const handleUpvote = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to upvote posts.",
        variant: "destructive",
      });
      return;
    }
    upvoteMutation.mutate(id);
  };

  const handleSubmit = (data: z.infer<typeof createPostSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(data);
  };

  const handleLeadSubmit = (data: z.infer<typeof leadCaptureSchema>) => {
    leadCaptureMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dbb-forest border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dbb-charcoalSoft">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <DbbSection className="bg-dbb-surface border-b border-dbb-borderSoft">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 
                  className="text-4xl md:text-5xl mb-3 text-dbb-charcoal"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Community Q&A
                </h1>
                <p className="text-dbb-charcoalSoft text-lg leading-relaxed max-w-2xl">
                  Connect with DFW beauty professionals. Ask questions, share expertise, grow together.
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <DbbButtonPrimary
                    size="lg"
                    data-testid="button-create-post"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Share Your Voice
                  </DbbButtonPrimary>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle 
                      className="text-dbb-charcoal text-2xl"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Create a Post
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...postForm}>
                    <form onSubmit={postForm.handleSubmit(handleSubmit)} className="space-y-4">
                      <FormField
                        control={postForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Post Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-post-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="question">Question</SelectItem>
                                <SelectItem value="tip">Tip</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={postForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Hair">Hair</SelectItem>
                                <SelectItem value="Skin">Skin Care</SelectItem>
                                <SelectItem value="Makeup">Makeup</SelectItem>
                                <SelectItem value="Nails">Nails</SelectItem>
                                <SelectItem value="Business">Business Tips</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Equipment">Equipment & Supplies</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={postForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What's your question or tip?"
                                {...field}
                                data-testid="input-title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={postForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your thoughts..."
                                rows={6}
                                {...field}
                                data-testid="textarea-content"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setIsCreateDialogOpen(false)}
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <DbbButtonPrimary
                          type="submit"
                          disabled={createPostMutation.isPending}
                          data-testid="button-submit-post"
                        >
                          {createPostMutation.isPending ? "Publishing..." : "Publish"}
                        </DbbButtonPrimary>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </DbbSection>

        <section className="py-6 bg-dbb-surface border-b border-dbb-borderSoft">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === "all" 
                    ? "bg-dbb-forestLight dark:bg-dbb-forest text-dbb-charcoal shadow-sm" 
                    : "bg-dbb-sand text-dbb-charcoalSoft hover:bg-dbb-sand/80"
                }`}
                data-testid="button-filter-all"
              >
                All Posts
              </button>
              <button
                onClick={() => setSelectedType("question")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === "question" 
                    ? "bg-dbb-forestLight dark:bg-dbb-forest text-dbb-charcoal shadow-sm" 
                    : "bg-dbb-sand text-dbb-charcoalSoft hover:bg-dbb-sand/80"
                }`}
                data-testid="button-filter-questions"
              >
                Questions
              </button>
              <button
                onClick={() => setSelectedType("tip")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === "tip" 
                    ? "bg-dbb-forestLight dark:bg-dbb-forest text-dbb-charcoal shadow-sm" 
                    : "bg-dbb-sand text-dbb-charcoalSoft hover:bg-dbb-sand/80"
                }`}
                data-testid="button-filter-tips"
              >
                Tips
              </button>
              <div className="h-6 w-px bg-dbb-borderSoft mx-1" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-5 py-2 rounded-full border border-dbb-borderSoft bg-white text-sm text-dbb-charcoal"
                data-testid="select-category-filter"
              >
                <option value="all">All Categories</option>
                <option value="Hair">Hair</option>
                <option value="Skin">Skin Care</option>
                <option value="Makeup">Makeup</option>
                <option value="Nails">Nails</option>
                <option value="Business">Business Tips</option>
                <option value="Marketing">Marketing</option>
                <option value="Equipment">Equipment & Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <DbbSection>
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {posts.length === 0 ? (
                  <DbbCard className="p-12 text-center">
                    <MessageCircle className="h-16 w-16 mx-auto text-dbb-charcoalSoft mb-4" />
                    <h2 
                      className="text-2xl mb-2 text-dbb-charcoal"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      No posts yet
                    </h2>
                    <p className="text-dbb-charcoalSoft mb-6">
                      Be the first to share your knowledge with the community!
                    </p>
                    <DbbButtonPrimary
                      onClick={() => setIsCreateDialogOpen(true)}
                      data-testid="button-create-first-post"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </DbbButtonPrimary>
                  </DbbCard>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <a
                        key={post.id}
                        href={`/forum/${post.id}`}
                        className="block"
                        data-testid={`post-${post.id}`}
                      >
                        <DbbCard className="hover-elevate cursor-pointer">
                          <div className="p-6 flex items-start gap-5">
                            <div className="flex flex-col items-center gap-2 min-w-[70px]">
                              <button
                                onClick={(e) => handleUpvote(e, post.id)}
                                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover-elevate active-elevate-2 transition-all"
                                data-testid={`button-upvote-${post.id}`}
                              >
                                <ThumbsUp className="h-5 w-5 text-dbb-forest" />
                                <span className="text-sm font-semibold text-dbb-charcoal">{post.upvotes}</span>
                              </button>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <DbbTag data-testid={`badge-type-${post.id}`}>
                                  {post.type === "question" ? "Question" : "Tip"}
                                </DbbTag>
                                <span className="text-dbb-charcoalSoft">•</span>
                                <span className="text-sm text-dbb-charcoalSoft" data-testid={`badge-category-${post.id}`}>
                                  {post.category}
                                </span>
                                {post.hasAcceptedAnswer && (
                                  <>
                                    <span className="text-dbb-charcoalSoft">•</span>
                                    <span 
                                      className="flex items-center gap-1 text-sm text-dbb-forest font-medium"
                                      data-testid={`badge-answered-${post.id}`}
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                      Answered
                                    </span>
                                  </>
                                )}
                              </div>
                              <h3 
                                className="text-xl mb-2 text-dbb-charcoal leading-snug"
                                style={{ fontFamily: 'var(--font-heading)' }}
                                data-testid={`title-${post.id}`}
                              >
                                {post.title}
                              </h3>
                              <p className="text-sm text-dbb-charcoalSoft line-clamp-2 mb-4 leading-relaxed">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-5 text-sm text-dbb-charcoalSoft">
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="h-4 w-4" />
                                  <span data-testid={`reply-count-${post.id}`}>
                                    {post.replyCount}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.viewCount}</span>
                                </div>
                                <span>
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </DbbCard>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <DbbCard className="p-6 bg-gradient-to-br from-dbb-forestLight/10 to-dbb-rose/10">
                    <div className="text-center mb-5">
                      <Sparkles className="h-10 w-10 mx-auto mb-3 text-dbb-forest" />
                      <h3 
                        className="text-xl mb-2 text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        Get Expert Recommendations
                      </h3>
                      <p className="text-sm text-dbb-charcoalSoft leading-relaxed">
                        Tell us what you're looking for and we'll connect you with the best professionals
                      </p>
                    </div>
                    <Dialog open={isLeadCaptureOpen} onOpenChange={setIsLeadCaptureOpen}>
                      <DialogTrigger asChild>
                        <DbbButtonPrimary 
                          className="w-full"
                          data-testid="button-get-recommendations"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Get Started
                        </DbbButtonPrimary>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle 
                            className="text-dbb-charcoal text-xl"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            Get Personalized Recommendations
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
                              name="interests"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>What are you interested in?</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="e.g., Botox, laser hair removal, facials..." 
                                      {...field} 
                                      data-testid="textarea-interests"
                                      rows={3}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DbbButtonPrimary 
                              type="submit" 
                              className="w-full" 
                              data-testid="button-submit-recommendations"
                              disabled={leadCaptureMutation.isPending}
                            >
                              {leadCaptureMutation.isPending ? "Sending..." : "Send Request"}
                            </DbbButtonPrimary>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </DbbCard>

                  <DbbCard className="p-6">
                    <h3 
                      className="text-lg mb-4 text-dbb-charcoal"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Community Guidelines
                    </h3>
                    <ul className="space-y-3 text-sm text-dbb-charcoalSoft leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-dbb-forest mt-0.5">•</span>
                        <span>Be respectful and professional</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-dbb-forest mt-0.5">•</span>
                        <span>Share accurate information</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-dbb-forest mt-0.5">•</span>
                        <span>Help fellow professionals grow</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-dbb-forest mt-0.5">•</span>
                        <span>No spam or self-promotion</span>
                      </li>
                    </ul>
                  </DbbCard>
                </div>
              </aside>
            </div>
          </div>
        </DbbSection>
      </main>
      <Footer />
    </div>
  );
}

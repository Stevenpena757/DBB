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
import { Label } from "@/components/ui/label";
import type { ForumPost } from "@shared/schema";
import { MessageCircle, ThumbsUp, Eye, CheckCircle, Plus } from "lucide-react";
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

const createPostSchema = z.object({
  type: z.enum(["question", "tip"]),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

export default function Forum() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      type: "question",
      category: "",
      title: "",
      content: "",
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
      form.reset();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <p className="text-muted-foreground">Loading forum posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-10 border-b bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sunset to-peach bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-heading)' }}>
                  Q&A / Tips Community
                </h1>
                <p className="text-muted-foreground mt-3 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                  Ask questions, share tips, and learn from the DFW beauty community
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="font-bold bg-gradient-to-r from-sunset to-peach hover:scale-105 transition-all rounded-full shadow-lg"
                    style={{ fontFamily: 'var(--font-ui)' }}
                    data-testid="button-create-post"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide more details..."
                                rows={6}
                                {...field}
                                data-testid="textarea-content"
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
                          onClick={() => setIsCreateDialogOpen(false)}
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createPostMutation.isPending}
                          data-testid="button-submit-post"
                        >
                          {createPostMutation.isPending ? "Creating..." : "Create Post"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <section className="py-4 border-b bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                  selectedType === "all" ? "bg-primary text-primary-foreground font-medium" : ""
                }`}
                data-testid="button-filter-all"
              >
                All
              </button>
              <button
                onClick={() => setSelectedType("question")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                  selectedType === "question" ? "bg-primary text-primary-foreground font-medium" : ""
                }`}
                data-testid="button-filter-questions"
              >
                Questions
              </button>
              <button
                onClick={() => setSelectedType("tip")}
                className={`px-4 py-2 rounded-full hover-elevate active-elevate-2 text-sm ${
                  selectedType === "tip" ? "bg-primary text-primary-foreground font-medium" : ""
                }`}
                data-testid="button-filter-tips"
              >
                Tips
              </button>
              <div className="border-l h-6 mx-2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-full border bg-background text-sm"
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

        <section className="py-6">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
                <p className="text-muted-foreground mb-4">
                  Be the first to ask a question or share a tip!
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  data-testid="button-create-first-post"
                >
                  Create First Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={`/forum/${post.id}`}
                    className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow hover-elevate active-elevate-2"
                    data-testid={`post-${post.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <button
                          onClick={(e) => handleUpvote(e, post.id)}
                          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover-elevate active-elevate-2"
                          data-testid={`button-upvote-${post.id}`}
                        >
                          <ThumbsUp className="h-5 w-5 text-primary" />
                          <span className="text-sm font-semibold text-primary">{post.upvotes}</span>
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={post.type === "question" ? "default" : "secondary"}
                            data-testid={`badge-type-${post.id}`}
                          >
                            {post.type === "question" ? "Question" : "Tip"}
                          </Badge>
                          <Badge variant="outline" data-testid={`badge-category-${post.id}`}>
                            {post.category}
                          </Badge>
                          {post.hasAcceptedAnswer && (
                            <Badge
                              variant="default"
                              className="bg-green-500"
                              data-testid={`badge-answered-${post.id}`}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Answered
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2" data-testid={`title-${post.id}`}>
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span data-testid={`reply-count-${post.id}`}>
                              {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount} views</span>
                          </div>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

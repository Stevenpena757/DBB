import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { ForumPost, ForumReply } from "@shared/schema";
import { ThumbsUp, Eye, CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function ForumPostPage() {
  const [, params] = useRoute("/forum/:id");
  const postId = params?.id ? parseInt(params.id) : 0;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState("");

  const { data: post, isLoading: postLoading } = useQuery<ForumPost>({
    queryKey: ["/api/forum", postId],
    queryFn: async () => {
      const response = await fetch(`/api/forum/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
    enabled: postId > 0,
  });

  const { data: replies = [], isLoading: repliesLoading } = useQuery<ForumReply[]>({
    queryKey: ["/api/forum", postId, "replies"],
    queryFn: async () => {
      const response = await fetch(`/api/forum/${postId}/replies`);
      if (!response.ok) throw new Error("Failed to fetch replies");
      return response.json();
    },
    enabled: postId > 0,
  });

  const upvotePostMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/forum/${postId}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId] });
    },
  });

  const upvoteReplyMutation = useMutation({
    mutationFn: (replyId: number) =>
      apiRequest("POST", `/api/forum/replies/${replyId}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId, "replies"] });
    },
  });

  const acceptAnswerMutation = useMutation({
    mutationFn: (replyId: number) =>
      apiRequest("POST", `/api/forum/replies/${replyId}/accept`, { postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId, "replies"] });
      toast({
        title: "Success",
        description: "Answer accepted!",
      });
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: (content: string) =>
      apiRequest("POST", `/api/forum/${postId}/replies`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId, "replies"] });
      setReplyContent("");
      toast({
        title: "Success",
        description: "Reply posted!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpvotePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to upvote.",
        variant: "destructive",
      });
      return;
    }
    upvotePostMutation.mutate();
  };

  const handleUpvoteReply = (replyId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to upvote.",
        variant: "destructive",
      });
      return;
    }
    upvoteReplyMutation.mutate(replyId);
  };

  const handleAcceptAnswer = (replyId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to accept answers.",
        variant: "destructive",
      });
      return;
    }
    acceptAnswerMutation.mutate(replyId);
  };

  const handleSubmitReply = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to reply.",
        variant: "destructive",
      });
      return;
    }
    if (replyContent.trim().length < 10) {
      toast({
        title: "Error",
        description: "Reply must be at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    createReplyMutation.mutate(replyContent);
  };

  if (postLoading || repliesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <p className="text-muted-foreground">Loading post</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <a href="/forum">
            <Button>Back to Forum</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-background via-card to-muted">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <a href="/forum" className="inline-flex items-center gap-2 text-primary hover:underline mb-6" data-testid="link-back-to-forum">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </a>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <button
                  onClick={handleUpvotePost}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover-elevate active-elevate-2"
                  data-testid="button-upvote-post"
                >
                  <ThumbsUp className="h-6 w-6 text-primary" />
                  <span className="text-base font-semibold text-primary">{post.upvotes}</span>
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={post.type === "question" ? "default" : "secondary"} data-testid="badge-post-type">
                    {post.type === "question" ? "Question" : "Tip"}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-post-category">{post.category}</Badge>
                  {post.hasAcceptedAnswer && (
                    <Badge variant="default" className="bg-green-500" data-testid="badge-answered">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4" data-testid="post-title">{post.title}</h1>
                
                <div className="prose max-w-none mb-4">
                  <p className="text-base whitespace-pre-wrap" data-testid="post-content">{post.content}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span data-testid="post-reply-count">{post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount} views</span>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">{replies.length} {replies.length === 1 ? "Reply" : "Replies"}</h2>
            
            {replies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No replies yet. Be the first to reply!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`border rounded-lg p-4 ${reply.isAcceptedAnswer ? "border-green-500 bg-green-50/50" : ""}`}
                    data-testid={`reply-${reply.id}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleUpvoteReply(reply.id)}
                          className="flex flex-col items-center gap-1 px-2 py-1 rounded hover-elevate active-elevate-2"
                          data-testid={`button-upvote-reply-${reply.id}`}
                        >
                          <ThumbsUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">{reply.upvotes}</span>
                        </button>
                        {post.type === "question" && !post.hasAcceptedAnswer && post.userId === user?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcceptAnswer(reply.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            data-testid={`button-accept-answer-${reply.id}`}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        {reply.isAcceptedAnswer && (
                          <Badge variant="default" className="bg-green-500 mb-2" data-testid={`badge-accepted-${reply.id}`}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepted Answer
                          </Badge>
                        )}
                        <p className="whitespace-pre-wrap text-sm mb-2" data-testid={`reply-content-${reply.id}`}>{reply.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Reply</h2>
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              className="mb-4"
              data-testid="textarea-reply"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitReply}
                disabled={createReplyMutation.isPending || replyContent.trim().length < 10}
                data-testid="button-submit-reply"
              >
                {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

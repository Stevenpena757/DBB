import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  businessId: number;
  className?: string;
}

export function FollowButton({ businessId, className }: FollowButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: followStatus, isLoading } = useQuery<{ isFollowing: boolean }>({
    queryKey: [`/api/follows/check/${businessId}`],
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (followStatus?.isFollowing) {
        return apiRequest("DELETE", `/api/follows/${businessId}`, {});
      } else {
        return apiRequest("POST", `/api/follows/${businessId}`, {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/follows/check/${businessId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/follows"] });
      
      toast({ 
        title: followStatus?.isFollowing ? "Unfollowed" : "Following"
      });
    },
  });

  if (!user) {
    return (
      <Button
        variant="outline"
        asChild
        className={className}
        data-testid={`button-login-to-follow-${businessId}`}
      >
        <a
          href="/api/login"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 mr-2" />
          Sign in to Follow
        </a>
      </Button>
    );
  }

  const isFollowing = followStatus?.isFollowing || false;

  return (
    <Button
      variant={isFollowing ? "default" : "outline"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        followMutation.mutate();
      }}
      disabled={followMutation.isPending || isLoading}
      className={className}
      data-testid={`button-follow-${businessId}`}
    >
      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
      {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

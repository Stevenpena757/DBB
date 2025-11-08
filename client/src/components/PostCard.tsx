import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

type PostCardProps = {
  id: string;
  businessName: string;
  businessAvatar?: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
};

export function PostCard({
  id,
  businessName,
  businessAvatar,
  timestamp,
  content,
  image,
  likes: initialLikes,
  comments,
}: PostCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    console.log(`Post ${liked ? 'unliked' : 'liked'}: ${id}`);
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-post-${id}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={businessAvatar} alt={businessName} />
            <AvatarFallback>{businessName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm" data-testid={`text-business-name-${id}`}>
              {businessName}
            </h4>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed">{content}</p>

        {image && (
          <div className="rounded-md overflow-hidden -mx-4">
            <img src={image} alt="Post content" className="w-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-1 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={liked ? "text-primary" : ""}
            onClick={handleLike}
            data-testid={`button-like-${id}`}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
            {likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log(`Comment on post: ${id}`)}
            data-testid={`button-comment-${id}`}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log(`Share post: ${id}`)}
            data-testid={`button-share-${id}`}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
}

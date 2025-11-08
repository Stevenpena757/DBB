import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type BusinessCardProps = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  logo?: string;
  rating?: number;
  reviewCount?: number;
  location: string;
  distance?: string;
  verified?: boolean;
  onClick?: () => void;
};

export function BusinessCard({
  id,
  name,
  category,
  description,
  image,
  logo,
  rating = 5,
  reviewCount = 0,
  location,
  distance,
  verified,
  onClick,
}: BusinessCardProps) {
  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer group"
      onClick={() => {
        console.log(`Business card clicked: ${name}`);
        onClick?.();
      }}
      data-testid={`card-business-${id}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {logo && (
          <div className="absolute bottom-3 left-3 w-16 h-16 rounded-md overflow-hidden border-2 border-background bg-background shadow-lg">
            <img src={logo} alt={`${name} logo`} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight" data-testid={`text-business-name-${id}`}>
              {name}
            </h3>
            {verified && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Verified
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{location}</span>
            {distance && <span>· {distance}</span>}
          </div>
        </div>

        <Button 
          className="w-full" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`View profile clicked: ${name}`);
          }}
          data-testid={`button-view-profile-${id}`}
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
}

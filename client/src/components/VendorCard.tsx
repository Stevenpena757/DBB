import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Star, MapPin, ExternalLink } from "lucide-react";

interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  rating: number;
  reviewCount: number;
  productTypes: string[];
  verified?: boolean;
}

export function VendorCard({
  name,
  category,
  description,
  image,
  rating,
  reviewCount,
  productTypes,
  verified = false,
}: VendorCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all h-full flex flex-col" data-testid={`card-vendor-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="p-0">
        {image ? (
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate" data-testid="text-vendor-name">
                {name}
              </h3>
              {verified && (
                <Badge variant="secondary" className="shrink-0">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-medium text-sm">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          {productTypes.slice(0, 3).map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
          {productTypes.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{productTypes.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" data-testid="button-view-catalog">
          <Package className="h-4 w-4 mr-2" />
          View Catalog
        </Button>
        <Button variant="outline" size="icon" data-testid="button-vendor-details">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

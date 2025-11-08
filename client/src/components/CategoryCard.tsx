import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type CategoryCardProps = {
  icon: LucideIcon;
  title: string;
  businessCount: number;
  onClick?: () => void;
};

export function CategoryCard({
  icon: Icon,
  title,
  businessCount,
  onClick,
}: CategoryCardProps) {
  return (
    <Card className="p-8 text-center space-y-4 hover-elevate cursor-pointer group" onClick={() => {
      console.log(`Category card clicked: ${title}`);
      onClick?.();
    }}
    data-testid={`card-category-${title.toLowerCase()}`}>
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <Icon className="h-12 w-12" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{businessCount}+ Businesses</p>
      </div>
      <Button variant="outline" className="w-full" data-testid={`button-explore-${title.toLowerCase()}`}>
        Explore {title}
      </Button>
    </Card>
  );
}

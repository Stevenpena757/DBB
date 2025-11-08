import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CategoryPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        "cursor-pointer px-4 py-2 text-sm font-medium hover-elevate active-elevate-2",
        active && "toggle-elevate toggle-elevated"
      )}
      onClick={() => {
        console.log(`Category clicked: ${label}`);
        onClick?.();
      }}
      data-testid={`category-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {label}
    </Badge>
  );
}

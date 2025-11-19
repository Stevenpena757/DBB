import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export const DbbCard = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl bg-dbb-surface border border-dbb-sand shadow-sm",
      className
    )}
    {...props}
  />
);

export const DbbButtonPrimary = ({ className = "", ...props }: ButtonProps) => (
  <Button
    className={cn(
      "rounded-full bg-dbb-eucalyptus text-dbb-charcoal hover:bg-dbb-eucalyptus/90 font-medium",
      className
    )}
    {...props}
  />
);

export const DbbButtonGhost = ({ className = "", ...props }: ButtonProps) => (
  <Button
    variant="ghost"
    className={cn(
      "rounded-full border border-dbb-borderSoft hover:bg-dbb-sand/30",
      className
    )}
    {...props}
  />
);

export const DbbTag = ({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm bg-dbb-sand text-dbb-charcoal font-medium",
      className
    )}
    {...props}
  />
);

export const DbbSection = ({ className = "", ...props }: React.HTMLAttributes<HTMLElement>) => (
  <section className={cn("py-12 md:py-16", className)} {...props} />
);

export const DbbContainer = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("container mx-auto px-4", className)} {...props} />
);

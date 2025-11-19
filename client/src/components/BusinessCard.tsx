import { DbbCard, DbbTag } from "@/components/dbb/DbbComponents";
import { MapPin } from "lucide-react";
import { getBusinessImage } from "@/lib/categoryImages";
import type { Business } from "@shared/schema";

type BusinessCardProps = {
  business: Business;
  onClick?: () => void;
};

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <DbbCard 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
      onClick={onClick}
      data-testid={`card-business-${business.id}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={getBusinessImage(business)}
          alt={`${business.name} – ${business.category ?? "beauty service"}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h4 
          className="text-lg font-medium text-dbb-charcoal mb-2"
          style={{ fontFamily: 'var(--font-subheading)' }}
        >
          {business.name}
        </h4>
        <div className="flex items-center gap-2 text-sm text-dbb-charcoalSoft mb-2">
          <MapPin className="h-4 w-4" />
          {business.location}
        </div>
        {business.category && <DbbTag>{business.category}</DbbTag>}
      </div>
    </DbbCard>
  );
}

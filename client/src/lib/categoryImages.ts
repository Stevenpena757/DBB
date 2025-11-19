// Category-based default images for business listings
// NO FACES - service and ambiance focused imagery only

import type { Business } from "@shared/schema";

const categoryImageMap: Record<string, string> = {
  "Med Spa": "/images/dallasbeautybook/cat-medspa.jpg",
  "Aesthetics Spa": "/images/dallasbeautybook/cat-medspa.jpg",
  "Medical Aesthetics": "/images/dallasbeautybook/cat-injectables.jpg",
  "Injectables": "/images/dallasbeautybook/cat-injectables.jpg",
  "Lash & Brow": "/images/dallasbeautybook/cat-lashes.jpg",
  "Lashes": "/images/dallasbeautybook/cat-lashes.jpg",
  "Brows": "/images/dallasbeautybook/cat-brows.jpg",
  "Hair Salon": "/images/dallasbeautybook/cat-hair.jpg",
  "Hair": "/images/dallasbeautybook/cat-hair.jpg",
  "Nail Salon": "/images/dallasbeautybook/cat-nails.jpg",
  "Nails": "/images/dallasbeautybook/cat-nails.jpg",
  "Skincare": "/images/dallasbeautybook/cat-skin.jpg",
  "Skin": "/images/dallasbeautybook/cat-skin.jpg",
  "Facials": "/images/dallasbeautybook/cat-skin.jpg",
  "Makeup Artist": "/images/dallasbeautybook/cat-skin.jpg",
  "Massage & Wellness": "/images/dallasbeautybook/cat-medspa.jpg",
};

/**
 * Get the appropriate image URL for a business.
 * Priority: business.imageUrl > category default > generic fallback
 */
export function getBusinessImage(business: Partial<Business>): string {
  // Use business's own image if available
  if (business.imageUrl) {
    return business.imageUrl;
  }

  // Use category-based default image
  if (business.category && categoryImageMap[business.category]) {
    return categoryImageMap[business.category];
  }

  // Fallback to med spa image (most neutral/professional)
  return "/images/dallasbeautybook/cat-medspa.jpg";
}

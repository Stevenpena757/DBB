import type { Business } from '@shared/schema';

export interface LocalBusinessSchema {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  image?: string;
  address?: {
    "@type": string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  telephone?: string;
  url?: string;
  priceRange?: string;
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
}

export interface ItemListItem {
  name: string;
  url: string;
  position: number;
  description?: string;
}

export interface ItemListSchema {
  "@context": string;
  "@type": string;
  name: string;
  url?: string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    url?: string;
    description?: string;
  }>;
}

export function localBusinessJsonLd(business: Business): LocalBusinessSchema {
  const schema: LocalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
  };

  if (business.description) {
    schema.description = business.description;
  }

  if (business.imageUrl) {
    schema.image = business.imageUrl;
  }

  if (business.location) {
    const locationParts = business.location.split(',').map(s => s.trim());
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: locationParts[0] || undefined,
      addressRegion: "TX",
      addressCountry: "US"
    };
  }

  if (business.phone) {
    schema.telephone = business.phone;
  }

  if (business.website) {
    schema.url = business.website;
  } else {
    schema.url = `https://dallasbeautybook.com/business/${business.id}`;
  }

  schema.priceRange = "$$";

  return schema;
}

export function itemListJsonLd({
  title,
  url,
  items
}: {
  title: string;
  url?: string;
  items: ItemListItem[];
}): ItemListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    ...(url && { url }),
    itemListElement: items.map(item => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      ...(item.url && { url: item.url }),
      ...(item.description && { description: item.description })
    }))
  };
}

export function injectJsonLd(schema: Record<string, any>, id: string): void {
  if (typeof window === 'undefined') return;

  let script = document.getElementById(id) as HTMLScriptElement;
  
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
}

export function removeJsonLd(id: string): void {
  if (typeof window === 'undefined') return;
  
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

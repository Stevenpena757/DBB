import { useEffect } from 'react';

interface LocalBusinessJsonLdProps {
  name: string;
  description: string;
  address?: string;
  city: string;
  phone?: string;
  website?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
}

export function LocalBusinessJsonLd({
  name,
  description,
  address,
  city,
  phone,
  website,
  image,
  rating,
  reviewCount,
  priceRange = '$$'
}: LocalBusinessJsonLdProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": name,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressRegion": "TX",
        "addressCountry": "US",
        ...(address && { "streetAddress": address })
      },
      ...(phone && { "telephone": phone }),
      ...(website && { "url": website }),
      ...(image && { "image": image }),
      ...(rating && reviewCount && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rating,
          "reviewCount": reviewCount
        }
      }),
      "priceRange": priceRange
    };

    const scriptId = 'json-ld-local-business';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [name, description, address, city, phone, website, image, rating, reviewCount, priceRange]);

  return null;
}

interface QAPageJsonLdProps {
  question: string;
  answer?: string;
  acceptedAnswer?: string;
  upvotes?: number;
  datePublished?: string;
}

export function QAPageJsonLd({
  question,
  answer,
  acceptedAnswer,
  upvotes,
  datePublished
}: QAPageJsonLdProps) {
  useEffect(() => {
    const answerText = acceptedAnswer || answer;
    
    if (!answerText) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": question,
        "text": question,
        ...(datePublished && { "datePublished": datePublished }),
        ...(upvotes && { "upvoteCount": upvotes }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answerText,
          ...(upvotes && { "upvoteCount": upvotes })
        }
      }
    };

    const scriptId = 'json-ld-qa-page';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [question, answer, acceptedAnswer, upvotes, datePublished]);

  return null;
}

interface ItemListItem {
  name: string;
  url?: string;
  description?: string;
  position: number;
}

interface ItemListJsonLdProps {
  items: ItemListItem[];
  listName: string;
}

export function ItemListJsonLd({ items, listName }: ItemListJsonLdProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": listName,
      "itemListElement": items.map(item => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.name,
        ...(item.url && { "url": item.url }),
        ...(item.description && { "description": item.description })
      }))
    };

    const scriptId = 'json-ld-item-list';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [items, listName]);

  return null;
}

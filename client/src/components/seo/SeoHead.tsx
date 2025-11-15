import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
}

export function SeoHead({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  twitterCard = 'summary_large_image'
}: SeoHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    
    if (url) {
      updateMeta('og:url', url, true);
      
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', url);
    }
    
    if (image) {
      updateMeta('og:image', image, true);
    }

    // Twitter Card tags
    updateMeta('twitter:card', twitterCard);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    
    if (image) {
      updateMeta('twitter:image', image);
    }
  }, [title, description, image, url, type, twitterCard]);

  return null;
}

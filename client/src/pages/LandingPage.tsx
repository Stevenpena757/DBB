import { useQuery } from '@tanstack/react-query';
import { SeoHead, ItemListJsonLd, BreadcrumbListJsonLd } from '@/components/seo';
import { BusinessCard } from '@/components/BusinessCard';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEO_LANDING_PAGES, type LandingDef } from '@/data/seoLandingPages';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import type { Business } from '@shared/schema';

interface LandingPageProps {
  landing: LandingDef;
}

export function LandingPage({ landing }: LandingPageProps) {
  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses']
  });

  const filteredBusinesses = businesses.filter(b => {
    if (landing.city && b.location && !b.location.toLowerCase().includes(landing.city.toLowerCase())) {
      return false;
    }
    if (landing.category && b.category && !b.category.toLowerCase().includes(landing.category.toLowerCase())) {
      return false;
    }
    return true;
  });

  const rankedBusinesses = filteredBusinesses.slice(0, 20);

  const metaDescription = `Discover the ${landing.title.toLowerCase()} - curated list of top-rated health, beauty, and aesthetics businesses. Reviews, photos, and contact info.`;

  const itemListData = rankedBusinesses.map((b, idx) => ({
    name: b.name,
    url: `https://dallasbeautybook.com/business/${b.id}`,
    description: b.description || undefined,
    position: idx + 1
  }));

  const relatedPages = SEO_LANDING_PAGES
    .filter(p => 
      (p.city === landing.city && p.slug !== landing.slug) ||
      (p.category === landing.category && p.slug !== landing.slug)
    )
    .slice(0, 6);

  const citiesInCategory = landing.category 
    ? SEO_LANDING_PAGES.filter(p => p.category === landing.category && p.city !== landing.city).slice(0, 4)
    : [];

  const categoriesInCity = landing.city
    ? SEO_LANDING_PAGES.filter(p => p.city === landing.city && p.category !== landing.category).slice(0, 4)
    : [];

  const breadcrumbItems = [
    { name: 'Home', url: 'https://dallasbeautybook.com/', position: 1 },
    ...(landing.city ? [{ name: landing.city, url: `https://dallasbeautybook.com/explore?city=${landing.city}`, position: 2 }] : []),
    { name: landing.category || 'All Services', url: `https://dallasbeautybook.com/${landing.slug}`, position: landing.city ? 3 : 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] to-white">
      <SeoHead
        title={`${landing.title} | Dallas Beauty Book`}
        description={metaDescription}
        url={`https://dallasbeautybook.com/${landing.slug}`}
        type="website"
      />
      
      <ItemListJsonLd items={itemListData} listName={landing.title} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" data-testid="link-home">
              <span className="hover:text-primary cursor-pointer">Home</span>
            </Link>
            <span>/</span>
            {landing.city && (
              <>
                <span>{landing.city}</span>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{landing.category || 'All Services'}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#3D2B1F] mb-4" data-testid="heading-page-title">
            {landing.title}
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            {landing.city && landing.category && (
              <>Explore the top {landing.category.toLowerCase()} businesses in {landing.city}, TX. Verified listings with real reviews, contact information, and photos from the DFW beauty community.</>
            )}
            {landing.city && !landing.category && (
              <>Discover the best health, beauty, and aesthetics businesses in {landing.city}, TX. Curated directory of local professionals serving the DFW area.</>
            )}
            {!landing.city && landing.category && (
              <>Find the top {landing.category.toLowerCase()} specialists across Dallas-Fort Worth. Compare services, read reviews, and book appointments with trusted professionals.</>
            )}
            {!landing.city && !landing.category && (
              <>Your complete guide to Dallas-Fort Worth's premier health, beauty, and aesthetics businesses. Discover, compare, and connect with local professionals.</>
            )}
          </p>

          <div className="flex flex-wrap gap-3">
            {landing.city && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" />
                {landing.city}
              </div>
            )}
            {landing.category && (
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                {landing.category}
              </div>
            )}
            <div className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
              {rankedBusinesses.length} Results
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : rankedBusinesses.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rankedBusinesses.map((business, idx) => (
                <div key={business.id} className="relative" data-testid={`business-card-${business.id}`}>
                  <div className="absolute -top-2 -left-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 shadow-lg">
                    {idx + 1}
                  </div>
                  <BusinessCard 
                    id={business.id.toString()}
                    name={business.name}
                    category={business.category}
                    description={business.description}
                    image={business.imageUrl}
                    location={business.location}
                    onClick={() => window.location.href = `/business/${business.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No businesses found matching these criteria. Try adjusting your filters.</p>
            <Link href="/explore">
              <Button className="mt-4" data-testid="button-browse-all">
                Browse All Businesses
              </Button>
            </Link>
          </Card>
        )}

        {relatedPages.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-6" data-testid="heading-related-pages">
              Related Searches
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {categoriesInCity.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                    More Services in {landing.city}
                  </h3>
                  <div className="space-y-2">
                    {categoriesInCity.map(page => (
                      <Link key={page.slug} href={`/${page.slug}`}>
                        <div className="flex items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer border" data-testid={`link-related-${page.slug}`}>
                          <ArrowRight className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{page.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {citiesInCategory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                    {landing.category} in Other Cities
                  </h3>
                  <div className="space-y-2">
                    {citiesInCategory.map(page => (
                      <Link key={page.slug} href={`/${page.slug}`}>
                        <div className="flex items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer border" data-testid={`link-related-${page.slug}`}>
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-medium">{page.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-3">List Your Business on Dallas Beauty Book</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join hundreds of DFW beauty professionals gaining visibility and connecting with clients through our platform.
          </p>
          <Link href="/add-listing">
            <Button size="lg" data-testid="button-add-listing" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Add Your Business - It's Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

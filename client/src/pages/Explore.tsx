import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DbbCard, DbbButtonPrimary, DbbTag, DbbContainer } from "@/components/dbb/DbbComponents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Business } from "@shared/schema";
import { Search, MapPin, Filter } from "lucide-react";
import { getBusinessImage } from "@/lib/categoryImages";

// Import category images
import hairSalonImg from "@assets/generated_images/Hair_Salon_category_image_4120201b.png";
import nailSalonImg from "@assets/generated_images/Nail_Salon_category_image_cb883119.png";
import medSpaImg from "@assets/generated_images/Med_Spa_category_image_003dcdaa.png";
import skincareImg from "@assets/generated_images/Skincare_category_image_e13794ea.png";
import makeupArtistImg from "@assets/generated_images/Makeup_Artist_category_image_247ccaa1.png";
import lashBrowImg from "@assets/generated_images/Lash_&_Brow_category_image_335d2acc.png";
import massageWellnessImg from "@assets/generated_images/Massage_&_Wellness_category_image_5704d0e6.png";
import medicalAestheticsImg from "@assets/generated_images/Medical_Aesthetics_category_image_de9b6fde.png";

const categoryImages: Record<string, string> = {
  "Hair Salon": hairSalonImg,
  "Nail Salon": nailSalonImg,
  "Med Spa": medSpaImg,
  "Medical Aesthetics": medicalAestheticsImg,
  "Skincare": skincareImg,
  "Makeup Artist": makeupArtistImg,
  "Lash & Brow": lashBrowImg,
  "Massage & Wellness": massageWellnessImg,
};

const CATEGORIES = [
  "All",
  "Hair Salon",
  "Med Spa",
  "Medical Aesthetics",
  "Nail Salon",
  "Skincare",
  "Makeup Artist",
  "Lash & Brow",
  "Massage & Wellness"
];

const DFW_LOCATIONS = [
  "All Locations",
  "Dallas",
  "Fort Worth",
  "Plano",
  "Arlington",
  "Irving",
  "Frisco",
  "McKinney",
  "Denton"
];

export default function Explore() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = !searchQuery || 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.services && business.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || business.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <DbbContainer>
          {/* Page Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl mb-4 text-dbb-charcoal"
              style={{ fontFamily: 'var(--font-heading)' }}
              data-testid="heading-explore"
            >
              Explore Beauty Professionals
            </h1>
            <p 
              className="text-lg text-dbb-charcoalSoft"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Discover trusted beauty experts across Dallas-Fort Worth
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dbb-charcoalSoft" />
              <Input
                type="search"
                placeholder="Search by name, service, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 border-dbb-sand dark:border-border bg-card focus:border-dbb-forest dark:focus:border-primary"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-dbb-charcoalSoft" />
              <span 
                className="text-sm font-medium text-dbb-charcoalSoft"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Category
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-dbb-forestLight text-dbb-charcoal dark:bg-dbb-forest dark:text-white'
                      : 'bg-dbb-sand text-dbb-charcoalSoft hover:bg-dbb-sand/80'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                  data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {categoryImages[category] && (
                    <img 
                      src={categoryImages[category]} 
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filters */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-dbb-charcoalSoft" />
              <span 
                className="text-sm font-medium text-dbb-charcoalSoft"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Location
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {DFW_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedLocation === loc
                      ? 'bg-dbb-rose text-dbb-charcoal dark:bg-dbb-rose dark:text-dbb-charcoal'
                      : 'bg-dbb-sand text-dbb-charcoalSoft hover:bg-dbb-sand/80'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                  data-testid={`button-location-${loc.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p 
              className="text-dbb-charcoalSoft"
              style={{ fontFamily: 'var(--font-body)' }}
              data-testid="text-results-count"
            >
              {isLoading ? 'Loading...' : `${filteredBusinesses.length} ${filteredBusinesses.length === 1 ? 'professional' : 'professionals'} found`}
            </p>
          </div>

          {/* Business Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <DbbCard key={i} className="animate-pulse">
                  <div className="h-64 bg-dbb-sand rounded-t-2xl"></div>
                  <div className="p-6">
                    <div className="h-6 bg-dbb-sand rounded mb-3"></div>
                    <div className="h-4 bg-dbb-sand rounded w-2/3 mb-3"></div>
                    <div className="h-4 bg-dbb-sand rounded w-1/2"></div>
                  </div>
                </DbbCard>
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <p 
                className="text-xl text-dbb-charcoalSoft mb-4"
                style={{ fontFamily: 'var(--font-subheading)' }}
              >
                No professionals found matching your criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLocation('All Locations');
                }}
                variant="outline"
                data-testid="button-clear-filters"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <Link 
                  key={business.id} 
                  href={`/business/${business.id}`}
                  className="block group"
                  data-testid={`card-business-${business.id}`}
                >
                  <DbbCard className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full">
                    <div className="aspect-[4/3] overflow-hidden relative bg-dbb-sand">
                      <img 
                        src={getBusinessImage(business)}
                        alt={`${business.name} – ${business.category ?? "beauty service"}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy" 
                      />
                    </div>
                    <div className="p-6">
                      <h3 
                        className="text-xl mb-2 text-dbb-charcoal"
                        style={{ fontFamily: 'var(--font-subheading)' }}
                      >
                        {business.name}
                      </h3>
                      <p 
                        className="text-sm text-dbb-charcoalSoft mb-3 flex items-center gap-2"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <MapPin className="h-4 w-4" />
                        {business.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <DbbTag className="text-xs">{business.category}</DbbTag>
                      </div>
                      {business.services && business.services.length > 0 && (
                        <p 
                          className="text-sm text-dbb-charcoalSoft line-clamp-2 mb-4"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {business.services.slice(0, 3).join(' • ')}
                        </p>
                      )}
                      <Button 
                        className="w-full"
                        variant="outline"
                        data-testid={`button-view-${business.id}`}
                      >
                        View Profile
                      </Button>
                    </div>
                  </DbbCard>
                </Link>
              ))}
            </div>
          )}
        </DbbContainer>
      </main>
      
      <Footer />
    </div>
  );
}

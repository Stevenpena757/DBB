import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { VendorCard } from "@/components/VendorCard";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, Stethoscope, ArrowRight, ShoppingCart, Users, Building2 } from "lucide-react";
import salonImage from '@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png';
import clinicImage from '@assets/generated_images/Medical_aesthetics_clinic_photo_4076e3a0.png';
import spaImage from '@assets/generated_images/Wellness_spa_business_photo_aeff6e69.png';
import hairImage from '@assets/generated_images/Hair_salon_business_photo_c22b69f8.png';
import fitnessImage from '@assets/generated_images/Fitness_wellness_studio_photo_30d0746e.png';
import nailImage from '@assets/generated_images/Nail_salon_business_photo_ddb408ec.png';

export default function Home() {
  const vendors = [
    {
      id: "v1",
      name: "Beauty Supply Pro",
      category: "Professional Products",
      description: "Premium salon and spa supplies, equipment, and furniture for beauty professionals across DFW",
      rating: 4.9,
      reviewCount: 156,
      productTypes: ["Hair Products", "Equipment", "Furniture", "Tools"],
      verified: true,
    },
    {
      id: "v2",
      name: "MedSpa Essentials",
      category: "Medical Aesthetics",
      description: "Professional-grade aesthetic equipment, injectables, and medical supplies for licensed practitioners",
      rating: 4.8,
      reviewCount: 89,
      productTypes: ["Injectables", "Equipment", "Skincare", "Lasers"],
      verified: true,
    },
    {
      id: "v3",
      name: "Wellness Wholesale",
      category: "Wellness & Spa",
      description: "Wholesale massage tables, aromatherapy products, and spa equipment for wellness centers",
      rating: 4.7,
      reviewCount: 124,
      productTypes: ["Massage Tables", "Aromatherapy", "Linens", "Decor"],
      verified: false,
    },
    {
      id: "v4",
      name: "Nail Tech Suppliers",
      category: "Nail Products",
      description: "Complete nail salon supplies including polishes, gels, acrylics, and nail art equipment",
      rating: 4.9,
      reviewCount: 203,
      productTypes: ["Polishes", "Gels", "Acrylics", "Equipment"],
      verified: true,
    },
    {
      id: "v5",
      name: "Hair Studio Supply",
      category: "Hair Care",
      description: "Professional hair care products, styling tools, and salon equipment from top brands",
      rating: 4.8,
      reviewCount: 167,
      productTypes: ["Hair Care", "Styling Tools", "Color", "Extensions"],
      verified: true,
    },
    {
      id: "v6",
      name: "Skincare Solutions",
      category: "Skincare Products",
      description: "Medical-grade skincare products and treatment solutions for aestheticians and dermatologists",
      rating: 4.9,
      reviewCount: 142,
      productTypes: ["Medical-Grade", "Treatments", "Devices", "Retail"],
      verified: true,
    },
  ];

  const businesses = [
    {
      id: "1",
      name: "Luxe Beauty Salon",
      category: "Beauty",
      description: "Upscale salon offering premium hair styling, coloring, and beauty treatments in the heart of Dallas",
      image: salonImage,
      rating: 4.8,
      reviewCount: 127,
      location: "Uptown Dallas",
      distance: "2.3 mi",
      verified: true,
    },
    {
      id: "2",
      name: "Elite Medical Aesthetics",
      category: "Aesthetics",
      description: "Advanced aesthetic treatments including Botox, fillers, and laser therapy by board-certified professionals",
      image: clinicImage,
      rating: 4.9,
      reviewCount: 203,
      location: "Plano",
      distance: "5.1 mi",
      verified: true,
    },
    {
      id: "3",
      name: "Serenity Wellness Spa",
      category: "Wellness",
      description: "Holistic wellness center featuring massage therapy, acupuncture, and relaxation treatments",
      image: spaImage,
      rating: 4.7,
      reviewCount: 89,
      location: "Fort Worth",
      distance: "8.2 mi",
      verified: false,
    },
    {
      id: "4",
      name: "Modern Hair Studio",
      category: "Beauty",
      description: "Contemporary hair salon specializing in cutting-edge styles and color techniques",
      image: hairImage,
      rating: 4.6,
      reviewCount: 156,
      location: "Frisco",
      distance: "12.4 mi",
      verified: true,
    },
    {
      id: "5",
      name: "Pure Wellness Studio",
      category: "Fitness",
      description: "Boutique fitness and yoga studio offering personalized wellness programs",
      image: fitnessImage,
      rating: 4.9,
      reviewCount: 94,
      location: "Richardson",
      distance: "6.8 mi",
      verified: true,
    },
    {
      id: "6",
      name: "Polished Nail Lounge",
      category: "Beauty",
      description: "Luxury nail salon with expert manicure and pedicure services in a relaxing atmosphere",
      image: nailImage,
      rating: 4.7,
      reviewCount: 178,
      location: "Arlington",
      distance: "9.5 mi",
      verified: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-category-health">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <Stethoscope className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary" />
                  <h3 className="font-semibold text-sm md:text-base">Health</h3>
                  <p className="text-xs text-muted-foreground">150+</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-category-beauty">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <Sparkles className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary" />
                  <h3 className="font-semibold text-sm md:text-base">Beauty</h3>
                  <p className="text-xs text-muted-foreground">200+</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-category-aesthetics">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <Heart className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary" />
                  <h3 className="font-semibold text-sm md:text-base">Aesthetics</h3>
                  <p className="text-xs text-muted-foreground">120+</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-category-vendors">
                <CardContent className="p-4 md:p-6 text-center space-y-2">
                  <ShoppingCart className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary" />
                  <h3 className="font-semibold text-sm md:text-base">Vendors</h3>
                  <p className="text-xs text-muted-foreground">Shop</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="businesses" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="businesses" data-testid="tab-businesses">
                  <Building2 className="h-4 w-4 mr-2" />
                  Businesses
                </TabsTrigger>
                <TabsTrigger value="community" data-testid="tab-community">
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </TabsTrigger>
                <TabsTrigger value="vendors" data-testid="tab-vendors">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Vendors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="businesses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businesses.slice(0, 4).map((business) => (
                    <BusinessCard key={business.id} {...business} />
                  ))}
                </div>
                <div className="text-center pt-4">
                  <Button variant="outline" data-testid="button-view-all-businesses">
                    View All Businesses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="community" className="space-y-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  <PostCard
                    id="1"
                    businessName="Luxe Beauty Salon"
                    timestamp="2 hours ago"
                    content="New fall collection just arrived! Book your appointment now and get 20% off your first visit."
                    image={salonImage}
                    likes={24}
                    comments={5}
                  />
                  <PostCard
                    id="2"
                    businessName="Elite Medical Aesthetics"
                    timestamp="5 hours ago"
                    content="Join us for a complimentary consultation this weekend!"
                    likes={42}
                    comments={12}
                  />
                </div>
                <div className="text-center pt-4">
                  <Button variant="outline" data-testid="button-view-community">
                    View All Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="vendors" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendors.slice(0, 4).map((vendor) => (
                    <VendorCard key={vendor.id} {...vendor} />
                  ))}
                </div>
                <div className="text-center pt-4">
                  <Button variant="outline" data-testid="button-browse-all-vendors">
                    Browse All Vendors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-8 md:py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold">For Business Owners</h2>
                <p className="text-muted-foreground">
                  Get discovered by DFW clients looking for your services
                </p>
              </div>
              <div className="grid gap-3">
                <Button size="lg" className="w-full" data-testid="button-claim-listing-cta">
                  Claim Your Listing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="w-full" data-testid="button-become-vendor-cta">
                  Become a Vendor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

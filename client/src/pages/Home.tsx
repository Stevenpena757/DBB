import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { VendorCard } from "@/components/VendorCard";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, Stethoscope, ArrowRight, ShoppingCart, Users, Building2, FileText, Instagram, Lightbulb } from "lucide-react";
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
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <Hero />

        <section className="py-3 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
              <button className="px-4 py-2 rounded-full hover-elevate active-elevate-2 font-medium" data-testid="link-category-all">
                All
              </button>
              <button className="px-4 py-2 rounded-full hover-elevate active-elevate-2" data-testid="link-category-health">
                Health
              </button>
              <button className="px-4 py-2 rounded-full hover-elevate active-elevate-2" data-testid="link-category-beauty">
                Beauty
              </button>
              <button className="px-4 py-2 rounded-full hover-elevate active-elevate-2" data-testid="link-category-aesthetics">
                Aesthetics
              </button>
              <button className="px-4 py-2 rounded-full hover-elevate active-elevate-2" data-testid="link-category-vendors">
                Shop
              </button>
            </div>
          </div>
        </section>

        <section className="py-4 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-lg font-semibold mb-2">Ideas for you</h2>
          </div>
        </section>

        <section className="py-6 md:py-8 bg-white">
          <div className="container mx-auto px-3">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-business-1">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={salonImage} alt="Luxe Beauty Salon" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Luxe Beauty Salon</h3>
                  <p className="text-xs text-muted-foreground">Uptown Dallas</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-post-1">
                <div className="aspect-square overflow-hidden">
                  <img src={clinicImage} alt="Elite Medical Aesthetics" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium mb-1">Elite Medical Aesthetics</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">Winter skincare tips</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-business-2">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={spaImage} alt="Serenity Wellness Spa" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Serenity Wellness</h3>
                  <p className="text-xs text-muted-foreground">Plano</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-business-3">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={hairImage} alt="Divine Hair Studio" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Divine Hair Studio</h3>
                  <p className="text-xs text-muted-foreground">Fort Worth</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-post-2">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={nailImage} alt="Nail article" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium mb-1">Perfect Nails Dallas</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">5 tips for lasting gel manicures</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-business-4">
                <div className="aspect-square overflow-hidden">
                  <img src={fitnessImage} alt="Radiant Fitness" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Radiant Fitness</h3>
                  <p className="text-xs text-muted-foreground">Irving</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-business-5">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={clinicImage} alt="Glow Medical Spa" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Glow Medical Spa</h3>
                  <p className="text-xs text-muted-foreground">Richardson</p>
                </div>
              </div>

              <div className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid="pin-business-6">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={salonImage} alt="Beauty article" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium mb-1">Hair care tips</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">Combat winter dryness</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Button variant="outline" size="lg" data-testid="button-load-more">
                Show More
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

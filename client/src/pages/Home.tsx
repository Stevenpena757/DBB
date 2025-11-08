import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { BusinessCard } from "@/components/BusinessCard";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Stethoscope, ArrowRight } from "lucide-react";
import salonImage from '@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png';
import clinicImage from '@assets/generated_images/Medical_aesthetics_clinic_photo_4076e3a0.png';
import spaImage from '@assets/generated_images/Wellness_spa_business_photo_aeff6e69.png';
import hairImage from '@assets/generated_images/Hair_salon_business_photo_c22b69f8.png';
import fitnessImage from '@assets/generated_images/Fitness_wellness_studio_photo_30d0746e.png';
import nailImage from '@assets/generated_images/Nail_salon_business_photo_ddb408ec.png';

export default function Home() {
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

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Explore by Category</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find the perfect health, beauty, and wellness services for your needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <CategoryCard icon={Stethoscope} title="Health" businessCount={150} />
              <CategoryCard icon={Sparkles} title="Beauty" businessCount={200} />
              <CategoryCard icon={Heart} title="Aesthetics" businessCount={120} />
            </div>
          </div>
        </section>

        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Discover Businesses</h2>
                <p className="text-muted-foreground">Top-rated businesses in your area</p>
              </div>
              <Button variant="outline" data-testid="button-view-all">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                For businesses and community members
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Claim Your Business</h3>
                <p className="text-muted-foreground">
                  Register your business and create your profile in minutes
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Share & Connect</h3>
                <p className="text-muted-foreground">
                  Post updates, promotions, and engage with the community
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Grow Together</h3>
                <p className="text-muted-foreground">
                  Build your presence and attract new customers
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Community Highlights</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Latest updates from DFW businesses
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <PostCard
                id="1"
                businessName="Luxe Beauty Salon"
                timestamp="2 hours ago"
                content="New fall collection just arrived! Book your appointment now and get 20% off your first visit. We're excited to show y'all our latest styles!"
                image={salonImage}
                likes={24}
                comments={5}
              />
              <PostCard
                id="2"
                businessName="Elite Medical Aesthetics"
                timestamp="5 hours ago"
                content="Join us for a complimentary consultation this weekend. Learn about our latest treatments and meet our expert team!"
                likes={42}
                comments={12}
              />
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" data-testid="button-view-community">
                View Community Feed
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Own a Business?</h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of DFW businesses already growing their presence on our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" data-testid="button-claim-business-cta">
                  Claim Your Business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" data-testid="button-learn-more">
                  Learn More
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

import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png";

export function Hero() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${heroImage})`
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl text-white drop-shadow-lg" style={{ fontFamily: 'Pacifico, cursive' }}>
            DallasBeautyBook
          </h1>
          <p className="text-lg md:text-2xl text-white/95 font-semibold drop-shadow-md">
            Where DFW Beauty Meets Community
          </p>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Your trusted directory for Health, Beauty & Aesthetics services—powered by local businesses, experts, and community insights
          </p>
        </div>
      </div>
      
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md hover-elevate active-elevate-2" data-testid="button-hero-prev">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md hover-elevate active-elevate-2" data-testid="button-hero-next">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
      </div>
    </section>
  );
}

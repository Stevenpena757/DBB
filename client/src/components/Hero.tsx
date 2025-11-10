import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png";

export function Hero() {
  return (
    <section className="relative h-[250px] md:h-[320px] overflow-hidden bg-muted">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(17, 20, 24, 0.7), rgba(17, 20, 24, 0.8), rgba(17, 20, 24, 0.7))'
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-3 md:space-y-5 max-w-5xl">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            DallasBeautyBook
          </h1>
          <p className="text-lg md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-accent)', letterSpacing: '-0.01em' }}>
            DFW Featured Beauty Listings
          </p>
          <p className="text-sm md:text-xl lg:text-2xl max-w-3xl mx-auto text-white font-medium leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
            Gain <span className="font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">FREE visibility</span> by sharing your expertise. Get <span className="font-bold text-accent">discovered</span> by the most <span className="font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">active</span> community in Dallas
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

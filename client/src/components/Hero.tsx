import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png";

export function Hero() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted">
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
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-primary">
              <span className="text-white font-bold text-3xl" style={{ fontFamily: 'var(--font-accent)' }}>D</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            DallasBeautyBook
          </h1>
          <p className="text-xl md:text-3xl font-semibold text-white drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
            Community-Driven Beauty Discovery
          </p>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-200">
            Where businesses gain <span className="font-semibold text-white">FREE visibility</span> by sharing content, vendors offer services, and the most active & upvoted businesses shine
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

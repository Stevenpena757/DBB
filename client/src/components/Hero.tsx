import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png";

function DallasSkyline() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full" fill="currentColor">
      <rect x="10" y="45" width="8" height="35" />
      <rect x="20" y="35" width="10" height="45" />
      <rect x="32" y="50" width="6" height="30" />
      <rect x="40" y="25" width="12" height="55" />
      <polygon points="46,25 40,15 52,15" />
      <rect x="54" y="40" width="8" height="40" />
      <rect x="64" y="20" width="14" height="60" />
      <rect x="70" y="10" width="2" height="10" />
      <rect x="80" y="30" width="10" height="50" />
      <rect x="92" y="45" width="7" height="35" />
      <rect x="101" y="15" width="16" height="65" />
      <polygon points="109,15 101,5 117,5" />
      <rect x="119" y="35" width="9" height="45" />
      <rect x="130" y="50" width="6" height="30" />
      <rect x="138" y="25" width="11" height="55" />
      <rect x="151" y="40" width="8" height="40" />
      <rect x="161" y="30" width="10" height="50" />
      <rect x="173" y="45" width="7" height="35" />
      <rect x="182" y="35" width="8" height="45" />
    </svg>
  );
}

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
            <div className="w-20 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center p-3 glow-primary shadow-2xl">
              <div className="text-white">
                <DallasSkyline />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            DallasBeautyBook
          </h1>
          <p className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            Community-Driven Beauty Discovery
          </p>
          <p className="text-base md:text-xl max-w-2xl mx-auto text-white font-medium">
            Where businesses gain <span className="font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">FREE visibility</span> by sharing content, vendors offer services, and the most <span className="font-bold text-accent">active & upvoted</span> businesses <span className="font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">shine</span>
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

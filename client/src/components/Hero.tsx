import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/Beauty_salon_business_photo_a5408ce8.png";

function DallasSkyline() {
  return (
    <svg viewBox="0 0 600 50" className="w-full h-full" fill="currentColor" preserveAspectRatio="xMidYMax meet">
      <rect x="10" y="25" width="15" height="25" />
      <rect x="30" y="15" width="18" height="35" />
      <rect x="52" y="30" width="12" height="20" />
      <rect x="68" y="10" width="22" height="40" />
      <polygon points="79,10 68,0 90,0" />
      <rect x="94" y="20" width="16" height="30" />
      <rect x="114" y="5" width="25" height="45" />
      <rect x="125" y="0" width="3" height="5" />
      <rect x="143" y="15" width="18" height="35" />
      <rect x="165" y="25" width="14" height="25" />
      <rect x="183" y="8" width="28" height="42" />
      <polygon points="197,8 183,0 211,0" />
      <rect x="215" y="18" width="16" height="32" />
      <rect x="235" y="30" width="12" height="20" />
      <rect x="251" y="12" width="20" height="38" />
      <rect x="275" y="22" width="15" height="28" />
      <rect x="294" y="16" width="18" height="34" />
      <rect x="316" y="25" width="13" height="25" />
      <rect x="333" y="18" width="16" height="32" />
      <rect x="353" y="10" width="20" height="40" />
      <rect x="377" y="20" width="15" height="30" />
      <rect x="396" y="25" width="12" height="25" />
      <rect x="412" y="15" width="18" height="35" />
      <rect x="434" y="8" width="24" height="42" />
      <rect x="462" y="22" width="14" height="28" />
      <rect x="480" y="12" width="19" height="38" />
      <rect x="503" y="25" width="13" height="25" />
      <rect x="520" y="18" width="16" height="32" />
      <rect x="540" y="28" width="12" height="22" />
      <rect x="556" y="20" width="15" height="30" />
      <rect x="575" y="25" width="15" height="25" />
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
        <div className="space-y-3 md:space-y-6 max-w-4xl">
          <div className="relative inline-block">
            <h1 className="text-3xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              DallasBeautyBook
            </h1>
            <div className="absolute -bottom-2 md:-bottom-3 left-0 right-0 h-5 md:h-10 text-primary/40 opacity-60">
              <DallasSkyline />
            </div>
          </div>
          <p className="text-base md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            DFW's Beauty Listings
          </p>
          <p className="text-xs md:text-xl max-w-2xl mx-auto text-white font-medium leading-relaxed">
            Gain <span className="font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">FREE visibility</span> by sharing your expertise. Connect with suppliers. Get <span className="font-bold text-accent">discovered</span> by the most <span className="font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">active</span> community in Dallas
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

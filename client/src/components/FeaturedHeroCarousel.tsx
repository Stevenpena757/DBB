import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Business } from "@shared/schema";

async function fetchFeaturedBusinesses(): Promise<Business[]> {
  const res = await fetch("/api/businesses/featured");
  if (!res.ok) throw new Error("Failed to load featured businesses");
  return res.json();
}

export function FeaturedHeroCarousel() {
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["/api/businesses/featured"],
    queryFn: fetchFeaturedBusinesses,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (businesses.length === 0) return;

    const startRotation = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setActiveIndex((prev) => (prev + 1) % businesses.length);
        }
      }, 3000);
    };

    startRotation();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, [businesses.length]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    isPausedRef.current = true;
    
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
      pauseTimeoutRef.current = null;
    }, 8000);
  };

  if (isLoading || businesses.length === 0) {
    return (
      <section 
        className="relative min-h-[80vh] bg-background flex items-center justify-center overflow-hidden px-4 py-16"
        data-testid="featured-hero-carousel"
      >
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative min-h-[60vh] lg:min-h-[80vh] bg-background flex items-center justify-center overflow-hidden px-4 py-8 md:py-16"
      data-testid="featured-hero-carousel"
    >
      <div className="relative flex w-full max-w-6xl flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center z-10">
        <div className="relative flex-1 h-[380px] md:h-[420px] flex items-center justify-center w-full">
          {businesses.map((business, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;

            return (
              <article
                key={business.id}
                data-testid={`featured-card-${business.id}`}
                onClick={() => goTo(index)}
                className="absolute inset-0 max-w-xl rounded-[30px] p-6 md:p-8 text-left text-white shadow-2xl transition-all duration-500 ease-out cursor-pointer"
                style={{
                  backgroundImage: "linear-gradient(135deg, #D91D66, #CC4A28)",
                  transform: `
                    translateX(${offset * 24}px)
                    translateY(${offset * 18}px)
                    scale(${isActive ? 1 : 0.92 - Math.abs(offset) * 0.03})
                    rotate(${offset * 2}deg)
                  `,
                  opacity: isActive ? 1 : 0.8 - Math.abs(offset) * 0.1,
                  zIndex: 20 - Math.abs(offset),
                  pointerEvents: 'all',
                }}
                tabIndex={isActive ? 0 : -1}
                role="button"
                aria-label={`View ${business.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goTo(index);
                  }
                }}
              >
                <p 
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Featured Listing
                </p>
                <h2 
                  className="mt-2 text-3xl font-extrabold md:text-4xl mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {business.name}
                </h2>
                <p 
                  className="text-white/95 text-base md:text-lg leading-relaxed line-clamp-3"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {business.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90">
                  {business.category && (
                    <span 
                      className="rounded-full bg-white/20 px-3 py-1 backdrop-blur"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {business.category}
                    </span>
                  )}
                  {business.location && (
                    <span 
                      className="rounded-full bg-black/20 px-3 py-1 backdrop-blur"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {business.location}
                    </span>
                  )}
                </div>

                <Link 
                  href={`/business/${business.id}`}
                  data-testid={`featured-cta-${business.id}`}
                  className="inline-flex mt-6 rounded-full bg-white/95 text-navy px-6 py-3 font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all min-h-[44px] min-w-[44px] items-center"
                  style={{ fontFamily: 'var(--font-ui)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View Profile ↗
                </Link>
              </article>
            );
          })}
        </div>

        <div className="flex-1 max-w-md text-center lg:text-left">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Beauty Starts Here — Discover, Review, Engage with Dallas.
          </h1>
          <p 
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Featured listings from across Dallas–Fort Worth. These businesses
            stand out for their quality, service, and community reputation.
          </p>
          
          <div className="mt-8 flex gap-3">
            {businesses.map((business, index) => (
              <button
                key={business.id}
                onClick={() => goTo(index)}
                data-testid={`featured-dot-${business.id}`}
                className={`min-h-[44px] min-w-[44px] rounded-full transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  index === activeIndex 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`View ${business.name}`}
                aria-pressed={index === activeIndex ? "true" : "false"}
              >
                <span 
                  className={`h-3 rounded-full transition-all ${
                    index === activeIndex ? 'w-6 bg-white' : 'w-3 bg-white/60'
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

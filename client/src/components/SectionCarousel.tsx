import { useState } from "react";
import { Link } from "wouter";

type SectionCard = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  gradient: string;
};

const SECTIONS: SectionCard[] = [
  {
    id: "discover",
    title: "Discover DFW Beauty",
    subtitle:
      "Explore top med spas, lash artists, salons, and skincare studios across Dallas–Fort Worth.",
    ctaLabel: "Explore Businesses",
    href: "/explore",
    gradient: "linear-gradient(135deg, #D91D66, #CC4A28)",
  },
  {
    id: "community",
    title: "Join the Community",
    subtitle:
      "Ask questions, share tips, and get real recommendations from locals and professionals.",
    ctaLabel: "Visit Community",
    href: "/forum",
    gradient: "linear-gradient(135deg, #102646, #1ABDA6)",
  },
  {
    id: "owners",
    title: "For Business Owners",
    subtitle:
      "Claim your listing, post updates, and grow your bookings with zero upfront cost.",
    ctaLabel: "Claim Your Listing",
    href: "/submit-content",
    gradient: "linear-gradient(135deg, #CC4A28, #D91D66, #102646)",
  },
  {
    id: "suppliers",
    title: "Supplier Marketplace",
    subtitle:
      "Connect with brands and vendors for products, equipment, and wholesale deals.",
    ctaLabel: "Browse Suppliers",
    href: "/vendors",
    gradient: "linear-gradient(135deg, #102646, #364A8A, #1ABDA6)",
  },
];

export function SectionCarousel() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  return (
    <section 
      className="relative min-h-[80vh] bg-background flex items-center justify-center overflow-hidden px-4 py-16"
      data-testid="section-carousel"
    >
      <div className="relative flex w-full max-w-6xl flex-col lg:flex-row gap-12 items-center z-10">
        <div className="relative flex-1 h-[420px] flex items-center justify-center w-full">
          {SECTIONS.map((section, index) => {
            const isActive = section.id === activeId;
            const activeIndex = SECTIONS.findIndex(s => s.id === activeId);
            const offset = index - activeIndex;

            return (
              <article
                key={section.id}
                data-testid={`carousel-card-${section.id}`}
                onClick={() => setActiveId(section.id)}
                className="absolute inset-0 max-w-xl rounded-[30px] p-8 text-left text-white shadow-2xl transition-all duration-500 ease-out cursor-pointer"
                style={{
                  backgroundImage: section.gradient,
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
                aria-label={`View ${section.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveId(section.id);
                  }
                }}
              >
                <h2 
                  className="text-3xl font-extrabold md:text-4xl mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {section.title}
                </h2>
                <p 
                  className="text-white/95 text-lg leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {section.subtitle}
                </p>

                <Link 
                  href={section.href}
                  data-testid={`carousel-cta-${section.id}`}
                  className="inline-flex mt-6 rounded-full bg-white/95 text-navy px-6 py-3 font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all min-h-[44px] min-w-[44px] items-center"
                  style={{ fontFamily: 'var(--font-ui)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {section.ctaLabel} ↗
                </Link>
              </article>
            );
          })}
        </div>

        <div className="flex-1 max-w-md">
          <h1 
            className="text-4xl md:text-5xl font-extrabold text-navy leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            One platform. Every corner of DFW beauty.
          </h1>
          <p 
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tap through each card to preview every part of the platform—from discovery
            and reviews to the marketplace and community Q&A.
          </p>
          
          <div className="mt-8 flex gap-3">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveId(section.id)}
                data-testid={`carousel-dot-${section.id}`}
                className={`min-h-[44px] min-w-[44px] rounded-full transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  section.id === activeId 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`View ${section.title}`}
                aria-pressed={section.id === activeId}
              >
                <span 
                  className={`h-3 rounded-full transition-all ${
                    section.id === activeId ? 'w-6 bg-white' : 'w-3 bg-white/60'
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

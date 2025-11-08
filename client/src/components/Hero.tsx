import { SearchBar } from "./SearchBar";
import { CategoryPill } from "./CategoryPill";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import heroImage from '@assets/generated_images/Dallas_skyline_hero_background_1130e27c.png';

const categories = ["Health", "Beauty", "Aesthetics", "Wellness", "Fitness"];

export function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 text-center space-y-6">
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            DFW's <span className="text-primary">Beauty Directory</span>
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Health, Beauty & Aesthetics businesses in Dallas-Fort Worth
          </p>
        </div>

        <SearchBar variant="hero" />
      </div>
    </section>
  );
}

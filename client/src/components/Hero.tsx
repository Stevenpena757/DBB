import { SearchBar } from "./SearchBar";
import { CategoryPill } from "./CategoryPill";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import heroImage from '@assets/generated_images/Dallas_skyline_hero_background_1130e27c.png';

const categories = ["Health", "Beauty", "Aesthetics", "Wellness", "Fitness"];

export function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center space-y-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
            DFW's Exclusive Health, Beauty & Aesthetics Directory
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Your Complete Guide to
            <br />
            <span className="text-primary">DFW Beauty Professionals</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            The only directory dedicated exclusively to Health, Beauty, and Aesthetics businesses in the Dallas-Fort Worth area
          </p>
        </div>

        <SearchBar variant="hero" />

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

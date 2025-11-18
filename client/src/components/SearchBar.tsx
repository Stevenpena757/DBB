import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type SearchBarProps = {
  onSearch?: (query: string, location: string) => void;
  variant?: "hero" | "header";
};

export function SearchBar({ onSearch, variant = "header" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log("Search triggered:", { query, location });
    onSearch?.(query, location);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (variant === "hero") {
    return (
      <div className="w-full max-w-3xl mx-auto bg-background/95 backdrop-blur-sm rounded-md border p-6 shadow-lg">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for salons, spas, clinics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 text-base"
              data-testid="input-search-query"
              aria-label="Search for beauty businesses, services, or treatments"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Dallas, TX"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base"
                data-testid="input-search-location"
                aria-label="Filter search by city or location in DFW area"
              />
            </div>
            <Button 
              size="lg" 
              onClick={handleSearch}
              data-testid="button-search"
              className="px-8"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search businesses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="pl-9"
        data-testid="input-search-header"
        aria-label="Search for beauty businesses"
      />
    </div>
  );
}

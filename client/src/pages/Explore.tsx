import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Article, HowTo, Business } from "@shared/schema";
import { FileText, Lightbulb, Building2, MapPin } from "lucide-react";

export default function Explore() {
  const [filter, setFilter] = useState<"all" | "businesses" | "articles" | "how-tos">("all");

  const { data: businesses = [], isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses'],
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  const { data: howTos = [], isLoading: howTosLoading } = useQuery<HowTo[]>({
    queryKey: ['/api/how-tos'],
  });

  const isLoading = businessesLoading || articlesLoading || howTosLoading;

  const filteredContent = () => {
    if (filter === "businesses") return businesses.map(b => ({ ...b, type: "business" as const }));
    if (filter === "articles") return articles.map(a => ({ ...a, type: "article" as const }));
    if (filter === "how-tos") return howTos.map(h => ({ ...h, type: "how-to" as const }));
    return [
      ...businesses.map(b => ({ ...b, type: "business" as const })),
      ...articles.map(a => ({ ...a, type: "article" as const })),
      ...howTos.map(h => ({ ...h, type: "how-to" as const }))
    ].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-6 bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b z-10 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-heading)' }}>Explore</h1>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={`rounded-full px-5 font-semibold transition-all ${filter === "all" ? "shadow-md" : ""}`}
              style={{ fontFamily: 'var(--font-ui)' }}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button 
              variant={filter === "businesses" ? "default" : "outline"}
              onClick={() => setFilter("businesses")}
              className={`rounded-full px-5 font-semibold transition-all ${filter === "businesses" ? "shadow-md" : ""}`}
              style={{ fontFamily: 'var(--font-ui)' }}
              data-testid="button-filter-businesses"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Businesses
            </Button>
            <Button 
              variant={filter === "articles" ? "default" : "outline"}
              onClick={() => setFilter("articles")}
              className={`rounded-full px-5 font-semibold transition-all ${filter === "articles" ? "shadow-md" : ""}`}
              style={{ fontFamily: 'var(--font-ui)' }}
              data-testid="button-filter-articles"
            >
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </Button>
            <Button 
              variant={filter === "how-tos" ? "default" : "outline"}
              onClick={() => setFilter("how-tos")}
              className={`rounded-full px-5 font-semibold transition-all ${filter === "how-tos" ? "shadow-md" : ""}`}
              style={{ fontFamily: 'var(--font-ui)' }}
              data-testid="button-filter-howtos"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              How-Tos
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-6">
        {isLoading ? (
          <div className="text-center py-12">Loading content...</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
            {filteredContent().map((item) => {
              const cardContent = (
                <div 
                  className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer hover-elevate"
                  data-testid={item.type === "business" ? `card-business-${item.id}` : `pin-${item.type}-${item.id}`}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={"name" in item ? item.name : item.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      {item.type === "business" ? (
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                      ) : item.type === "article" ? (
                        <FileText className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Lightbulb className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {item.type === "business" ? "Business" : item.type === "article" ? "Article" : "How-To"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {"name" in item ? item.name : item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.type === "business" ? (
                        <>
                          <Badge variant="secondary" className="text-xs mb-1">{"category" in item && item.category}</Badge>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{"location" in item && item.location}</span>
                          </div>
                        </>
                      ) : (
                        "excerpt" in item ? item.excerpt : item.description
                      )}
                    </p>
                    {item.type !== "business" && "views" in item && (
                      <p className="text-xs text-muted-foreground mt-2">{item.views} views</p>
                    )}
                  </div>
                </div>
              );

              return item.type === "business" ? (
                <Link key={`${item.type}-${item.id}`} href={`/business/${item.id}`}>
                  {cardContent}
                </Link>
              ) : (
                <div key={`${item.type}-${item.id}`}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

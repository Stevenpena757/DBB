import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article, HowTo } from "@shared/schema";
import { FileText, Lightbulb } from "lucide-react";

export default function Explore() {
  const [filter, setFilter] = useState<"all" | "articles" | "how-tos">("all");

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  const { data: howTos = [], isLoading: howTosLoading } = useQuery<HowTo[]>({
    queryKey: ['/api/how-tos'],
  });

  const isLoading = articlesLoading || howTosLoading;

  const filteredContent = () => {
    if (filter === "articles") return articles.map(a => ({ ...a, type: "article" as const }));
    if (filter === "how-tos") return howTos.map(h => ({ ...h, type: "how-to" as const }));
    return [
      ...articles.map(a => ({ ...a, type: "article" as const })),
      ...howTos.map(h => ({ ...h, type: "how-to" as const }))
    ].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-6">
      <div className="sticky top-0 bg-white border-b z-10 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Explore Content</h1>
          <div className="flex gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button 
              variant={filter === "articles" ? "default" : "outline"}
              onClick={() => setFilter("articles")}
              data-testid="button-filter-articles"
            >
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </Button>
            <Button 
              variant={filter === "how-tos" ? "default" : "outline"}
              onClick={() => setFilter("how-tos")}
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
            {filteredContent().map((item, idx) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`pin-${item.type}-${item.id}`}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {item.type === "article" ? (
                      <FileText className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Lightbulb className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">{item.type === "article" ? "Article" : "How-To"}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {"excerpt" in item ? item.excerpt : item.description}
                  </p>
                  {"views" in item && (
                    <p className="text-xs text-muted-foreground mt-2">{item.views} views</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

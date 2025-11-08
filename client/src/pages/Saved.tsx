import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import type { Save } from "@shared/schema";

export default function Saved() {
  // In a real app, you'd get the session ID from context/auth
  const sessionId = "demo-session";

  const { data: saves = [], isLoading } = useQuery<Save[]>({
    queryKey: ['/api/saves', sessionId],
  });

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-6">
      <div className="sticky top-0 bg-white border-b z-10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Saved</h1>
          </div>
          <p className="text-muted-foreground mt-1">Your saved businesses and content</p>
        </div>
      </div>

      <div className="container mx-auto px-3 py-6">
        {isLoading ? (
          <div className="text-center py-12">Loading saved items...</div>
        ) : saves.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved items yet</h2>
            <p className="text-muted-foreground">Save businesses, articles, and how-tos to find them here</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
            {saves.map((save) => (
              <div 
                key={save.id}
                className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`save-${save.id}`}
              >
                <div className="p-4">
                  <p className="text-sm">Saved {save.itemType} #{save.itemId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

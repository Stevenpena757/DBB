import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Vendor } from "@shared/schema";
import { Package, ShoppingBag } from "lucide-react";

export default function Shop() {
  const { data: vendors = [], isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
  });

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-6">
      <div className="sticky top-0 bg-white border-b z-10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Shop Vendors & Suppliers</h1>
              <p className="text-muted-foreground">Find equipment, products, and supplies for your business</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-6">
        {isLoading ? (
          <div className="text-center py-12">Loading vendors...</div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No vendors yet</h2>
            <p className="text-muted-foreground">Check back soon for vendor listings</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
            {vendors.map((vendor) => (
              <div 
                key={vendor.id}
                className="mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`vendor-${vendor.id}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{vendor.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{vendor.description}</p>
                  <span className="inline-block px-2 py-1 bg-muted rounded-full text-xs mt-2">{vendor.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

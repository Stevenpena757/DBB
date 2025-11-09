import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Building2, Sparkles, ShoppingCart, Heart, MessageCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">About</a>
          <a href="#" className="hover:text-foreground">Business</a>
          <a href="#" className="hover:text-foreground">Blog</a>
          <a href="#" className="hover:text-foreground">Help</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          &copy; 2025 Dallas Beauty Book
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50 pb-safe">
        <div className="grid grid-cols-5 h-16">
          <a href="/" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-home">
            <Building2 className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </a>
          <a href="/explore" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-explore">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-medium">Explore</span>
          </a>
          <a href="/shop" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-vendors">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs font-medium">Shop</span>
          </a>
          <a href="/forum" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-forum">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Forum</span>
          </a>
          <a href="/saved" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-saved">
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">Saved</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

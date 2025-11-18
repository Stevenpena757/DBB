import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Building2, Sparkles, ShoppingCart, Heart, MessageCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">Business</a>
          <a href="#" className="hover:text-primary transition-colors">Blog</a>
          <a href="#" className="hover:text-primary transition-colors">Help</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4" style={{ fontFamily: 'var(--font-ui)' }}>
          &copy; 2025 Dallas Beauty Book
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50 pb-safe">
        <div className="grid grid-cols-5 h-16">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-home">
            <Building2 className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-explore">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-medium">Explore</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-vendors">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs font-medium">Shop</span>
          </Link>
          <Link href="/forum" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-forum">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Community</span>
          </Link>
          <Link href="/saved" className="flex flex-col items-center justify-center gap-1 hover-elevate active-elevate-2" data-testid="button-mobile-nav-saved">
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">Saved</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

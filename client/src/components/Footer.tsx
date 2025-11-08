import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">
              Dallas <span className="text-primary">Beauty Book</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              DFW's exclusive directory for Health, Beauty, and Aesthetics professionals. Claim your listing and join our community.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-social-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-tiktok">
                <SiTiktok className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">For Businesses</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Claim Your Business
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Submit Free Content
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Become a Vendor
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Explore</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Health Services
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Beauty Salons
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Medical Aesthetics
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Shop Vendors
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Stay Connected</h4>
            <p className="text-sm text-muted-foreground">
              Get updates on new businesses and special offers
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-newsletter-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Dallas Beauty Book. DFW's exclusive Health, Beauty & Aesthetics directory.</p>
        </div>
      </div>
    </footer>
  );
}

import { Input } from "@/components/ui/input";
import { Search, Bell, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <a href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-accent)' }}>G</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
              GENESIS
            </span>
          </div>
        </a>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search health, beauty & aesthetics services..."
              className="pl-10 h-12 rounded-full border-2 border-border bg-card/80 focus:bg-card focus:border-primary transition-colors"
              data-testid="input-header-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="/submit-content" className="hidden md:block" title="Share content and grow your business for FREE">
            <Button variant="default" size="sm" data-testid="button-submit-content" className="font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              Get Visibility →
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" data-testid="button-messages">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-profile">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

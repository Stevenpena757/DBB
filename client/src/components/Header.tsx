import { Input } from "@/components/ui/input";
import { Search, Bell, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <a href="/" className="flex items-center" data-testid="link-logo">
          <div className="text-xl font-bold text-primary">
            Dallas Beauty Book
          </div>
        </a>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search for beauty services..."
              className="pl-10 h-12 rounded-full border-2 border-border bg-muted/50 focus:bg-white"
              data-testid="input-header-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
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

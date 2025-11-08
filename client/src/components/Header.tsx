import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LogIn, UserPlus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="font-bold text-xl tracking-tight">
              Dallas <span className="text-primary">Beauty Book</span>
            </div>
          </a>
          
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" data-testid="button-nav-discover">
              Explore
            </Button>
            <Button data-testid="button-nav-claim">
              Claim Your Listing
            </Button>
          </nav>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md">
          <SearchBar variant="header" />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" data-testid="button-login">
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
          <Button size="sm" data-testid="button-signup">
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}

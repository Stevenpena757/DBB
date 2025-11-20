import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, Bell, MessageCircle, User, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 hover-elevate px-2 py-1 rounded-md transition-all" data-testid="link-logo">
          <span className="text-2xl font-semibold tracking-tight text-dbb-charcoal dark:text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            DallasBeautyBook
          </span>
        </Link>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <form onSubmit={(e) => { e.preventDefault(); if(searchQuery.trim()) setLocation(`/explore?search=${encodeURIComponent(searchQuery)}`); }} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search businesses, tips, and suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-card border-dbb-sand dark:border-border focus:border-dbb-forest dark:focus:border-primary transition-colors"
              data-testid="input-header-search"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dbb-forest dark:text-primary hover:opacity-70 transition-opacity"
              data-testid="button-header-search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/explore" className="hidden lg:block">
            <Button variant="ghost" size="sm" data-testid="button-explore">
              Explore Businesses
            </Button>
          </Link>
          <Link href="/forum" className="hidden lg:block">
            <Button variant="ghost" size="sm" data-testid="button-forum">
              Ask the Community
            </Button>
          </Link>
          <Link href="/my-beauty-book" className="hidden lg:block">
            <Button variant="ghost" size="sm" data-testid="button-beauty-book">
              Beauty Book
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:flex">
              <Button variant="ghost" size="sm" data-testid="button-for-professionals">
                For Professionals
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/for-professionals" className="cursor-pointer" data-testid="menu-item-for-pros">
                  About Business Benefits
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/claim-listing" className="cursor-pointer" data-testid="menu-item-claim">
                  Claim Your Listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/add-listing" className="cursor-pointer" data-testid="menu-item-add">
                  Add Listing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isAuthenticated && user?.role === "admin" && (
            <Link href="/dbb-management-x7k" className="hidden lg:block">
              <Button variant="ghost" size="sm" data-testid="button-admin">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
          
          {!isLoading && !isAuthenticated && (
            <a href="/api/login">
              <Button variant="default" size="sm" data-testid="button-login" className="bg-dbb-forest hover:bg-dbb-forest/90 text-white">
                Log In
              </Button>
            </a>
          )}

          {isAuthenticated && (
            <>
              <Link href={user?.claimedBusinesses?.[0] ? `/business/${user.claimedBusinesses[0].id}` : "/submit-content"} className="hidden md:block" title="Share content and grow your business for FREE">
                <Button variant="default" size="sm" data-testid="button-submit-content" className="bg-dbb-forest hover:bg-dbb-forest/90 text-white">
                  Share & Get Noticed
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="hidden md:flex" data-testid="button-notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex" data-testid="button-messages">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </>
          )}

          <ThemeToggle />
          
          {isAuthenticated && user && (
            <>
              <Link href="/dashboard">
                <Avatar className="h-8 w-8 hover-elevate cursor-pointer" data-testid="avatar-user" title="View Dashboard">
                  <AvatarImage src={user.profileImage || undefined} alt={user.username} />
                  <AvatarFallback className="bg-dbb-forestLight text-dbb-charcoal dark:bg-dbb-forest dark:text-white">{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <a href="/api/logout">
                <Button variant="ghost" size="icon" data-testid="button-logout" title="Log out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </a>
            </>
          )}

          {!isAuthenticated && !isLoading && (
            <Button variant="ghost" size="icon" data-testid="button-profile">
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

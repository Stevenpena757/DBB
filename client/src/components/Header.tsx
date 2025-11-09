import { Input } from "@/components/ui/input";
import { Search, Bell, MessageCircle, User, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <a href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-accent)' }}>D</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
              DallasBeautyBook
            </span>
          </div>
        </a>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Find beauty businesses, tips, and suppliers..."
              className="pl-10 h-12 rounded-full border-2 border-border bg-card/80 focus:bg-card focus:border-primary transition-colors"
              data-testid="input-header-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="/forum" className="hidden lg:block">
            <Button variant="ghost" size="sm" data-testid="button-forum">
              Forum
            </Button>
          </a>
          <a href="/claim-listing" className="hidden lg:block">
            <Button variant="ghost" size="sm" data-testid="button-claim-listing">
              Claim Your Listing
            </Button>
          </a>
          
          {isAuthenticated && user?.role === "admin" && (
            <a href="/admin" className="hidden lg:block">
              <Button variant="ghost" size="sm" data-testid="button-admin">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </a>
          )}
          
          {!isLoading && !isAuthenticated && (
            <a href="/api/login">
              <Button variant="default" size="sm" data-testid="button-login" className="font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                Log In
              </Button>
            </a>
          )}

          {isAuthenticated && (
            <>
              <a href={user?.claimedBusinesses?.[0] ? `/business/${user.claimedBusinesses[0].id}` : "/submit-content"} className="hidden md:block" title="Share content and grow your business for FREE">
                <Button variant="default" size="sm" data-testid="button-submit-content" className="font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Share & Get Noticed
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" data-testid="button-messages">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </>
          )}

          <ThemeToggle />
          
          {isAuthenticated && user && (
            <>
              <a href="/dashboard">
                <Avatar className="h-8 w-8 hover-elevate cursor-pointer" data-testid="avatar-user" title="View Dashboard">
                  <AvatarImage src={user.profileImage || undefined} alt={user.username} />
                  <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </a>
              <a href="/api/logout">
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-logout" title="Log out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </a>
            </>
          )}

          {!isAuthenticated && !isLoading && (
            <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-profile">
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

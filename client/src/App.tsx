import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Shop from "@/pages/Shop";
import Saved from "@/pages/Saved";
import Pricing from "@/pages/Pricing";
import Vendors from "@/pages/Vendors";
import BusinessProfile from "@/pages/BusinessProfile";
import SubmitContent from "@/pages/SubmitContent";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Forum from "@/pages/Forum";
import ForumPost from "@/pages/ForumPost";
import ClaimListing from "@/pages/ClaimListing";
import AddListing from "@/pages/AddListing";
import StartHere from "@/pages/StartHere";
import CreateBeautyBookPage from "@/pages/CreateBeautyBookPage";
import UserProfile from "@/pages/UserProfile";
import ForProfessionalsPage from "@/pages/ForProfessionalsPage";
import BusinessDashboard from "@/pages/BusinessDashboard";
import StartJourney from "@/pages/StartJourney";
import BusinessOnboarding from "@/pages/BusinessOnboarding";
import BusinessOnboardingSubmit from "@/pages/BusinessOnboardingSubmit";
import { LandingPage } from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";

function PostAuthRedirectHandler() {
  const [, navigate] = useLocation();
  const { data: user } = useQuery<{ id: number } | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (user) {
      const redirectPath = localStorage.getItem('postAuthRedirect');
      if (redirectPath) {
        localStorage.removeItem('postAuthRedirect');
        navigate(redirectPath);
      }
    }
  }, [user, navigate]);

  return null;
}

function Router() {
  return (
    <>
      <PostAuthRedirectHandler />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/shop" component={Shop} />
      <Route path="/saved" component={Saved} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/submit-content" component={SubmitContent} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dbb-management-x7k" component={Admin} />
      <Route path="/forum" component={Forum} />
      <Route path="/forum/:id" component={ForumPost} />
      <Route path="/claim-listing" component={ClaimListing} />
      <Route path="/add-listing" component={AddListing} />
      <Route path="/start-here" component={StartHere} />
      <Route path="/start" component={StartJourney} />
      <Route path="/my-beauty-book" component={CreateBeautyBookPage} />
      <Route path="/business-onboarding" component={BusinessOnboarding} />
      <Route path="/business-onboarding-submit" component={BusinessOnboardingSubmit} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/for-professionals" component={ForProfessionalsPage} />
      <Route path="/business-dashboard" component={BusinessDashboard} />
      <Route path="/business/:id" component={BusinessProfile} />
      
      {/* IMPORTANT: SEO Landing Page catch-all route.
          This route MUST be declared after all other specific routes.
          It dynamically renders 50+ SEO landing pages from SEO_LANDING_PAGES.
          Adding new routes below this line will break them - always add above. */}
      <Route path="/:slug" component={LandingPage} />
      
      <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

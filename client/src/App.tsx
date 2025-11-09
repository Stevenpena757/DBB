import { Switch, Route } from "wouter";
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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/shop" component={Shop} />
      <Route path="/saved" component={Saved} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/submit-content" component={SubmitContent} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/forum" component={Forum} />
      <Route path="/forum/:id" component={ForumPost} />
      <Route path="/business/:id" component={BusinessProfile} />
      <Route component={NotFound} />
    </Switch>
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

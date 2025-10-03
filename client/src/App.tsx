import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CelebrityProfile from "@/pages/CelebrityProfile";
import ContentCreator from "@/pages/ContentCreator";
import ViewportSimulator from "./components/ViewportSimulator";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AdminPanel from "@/pages/AdminPanel";
import AdminUserProfile from "@/pages/AdminUserProfile";
import UserProfile from "@/pages/UserProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/celebrity/:id" component={CelebrityProfile} />
      <Route path="/content-creator" component={ContentCreator} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin/users/:id" component={AdminUserProfile} />
      <Route path="/profile" component={UserProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check if we're in development mode to show the viewport simulator
  const isDevelopment = import.meta.env.DEV;
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      {isDevelopment && <ViewportSimulator />}
    </QueryClientProvider>
  );
}

export default App;

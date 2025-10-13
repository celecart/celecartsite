import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CelebrityProfile from "@/pages/CelebrityProfile";
import ContentCreator from "@/pages/ContentCreator";
import Login from "@/pages/Login";
import ViewportSimulator from "./components/ViewportSimulator";
import SignUp from "@/pages/SignUp";
import AdminRoles from "@/pages/AdminRoles";
import AdminUsers from "@/pages/AdminUsers";
import AdminUserActivities from "@/pages/AdminUserActivities";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCategories from "@/pages/AdminCategories";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import AdminPlans from "@/pages/AdminPlans";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/profile" component={Profile} />
      <Route path="/celebrity/:id" component={CelebrityProfile} />
      <Route path="/content-creator" component={ContentCreator} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/roles" component={AdminRoles} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/users/:id/activities" component={AdminUserActivities} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/plans" component={AdminPlans} />
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

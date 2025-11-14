import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CelebrityProfile from "@/pages/CelebrityProfile";
import Product from "@/pages/Product";
import ContentCreator from "@/pages/ContentCreator";
import AIStylist from "@/pages/AIStylist";
import Login from "@/pages/Login";
import ViewportSimulator from "./components/ViewportSimulator";
import SignUp from "@/pages/SignUp";
import CelebritySignUp from "@/pages/CelebritySignUp";
import AdminRoles from "@/pages/AdminRoles";
import AdminUsers from "@/pages/AdminUsers";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCategories from "@/pages/AdminCategories";
import AdminCelebrities from "@/pages/AdminCelebrities";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import AdminPlans from "@/pages/AdminPlans";
import Plans from "@/pages/Plans";
import Celebrities from "@/pages/Celebrities";
import CeleWorld from "@/pages/CeleWorld";
import AddBlog from "@/pages/AddBlog";
import EditBlog from "@/pages/EditBlog";
import AdminProducts from "@/pages/AdminProducts";
import AdminBrands from "@/pages/AdminBrands";
import AdminBrandProducts from "@/pages/AdminBrandProducts";
import AdminBrandMarketingApi from "@/pages/AdminBrandMarketingApi";
import Brands from "@/pages/Brands";
import AdminSettings from "@/pages/AdminSettings";
import BrandProducts from "@/pages/BrandProducts";

function Router() {
  return (
  <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/celebrity-signup" component={CelebritySignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/profile" component={Profile} />
      <Route path="/plans" component={Plans} />
      <Route path="/celebrities" component={Celebrities} />
      <Route path="/celebrity/:id" component={CelebrityProfile} />
      <Route path="/product/:id" component={Product} />
      <Route path="/ai-stylist" component={AIStylist} />
      <Route path="/content-creator" component={ContentCreator} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/roles" component={AdminRoles} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/celebrities" component={AdminCelebrities} />
      <Route path="/admin/plans" component={AdminPlans} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/brands" component={AdminBrands} />
      <Route path="/admin/brands/:id/products" component={AdminBrandProducts} />
      <Route path="/admin/brands/:id/marketing-api" component={AdminBrandMarketingApi} />
    <Route path="/brands/:id/products" component={BrandProducts} />
      <Route path="/admin/brand-products" component={AdminBrandProducts} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/brands" component={Brands} />
      <Route path="/cele-world" component={CeleWorld} />
      <Route path="/add-blog" component={AddBlog} />
      <Route path="/edit-blog/:id" component={EditBlog} />
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

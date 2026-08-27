import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ConversionTracker from "./components/ConversionTracker";

const NotFound = lazy(() => import("@/pages/NotFound"));
const ServicesList = lazy(() => import("./pages/ServicesList"));
const DoctorsList = lazy(() => import("./pages/DoctorsList"));
const Branches = lazy(() => import("./pages/Branches"));
const BranchDetail = lazy(() => import("./pages/BranchDetail"));
const About = lazy(() => import("./pages/About"));
const Vision = lazy(() => import("./pages/Vision"));
const Partners = lazy(() => import("./pages/Partners"));
const BookingForm = lazy(() => import("./pages/BookingForm"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BranchLanding = lazy(() => import("./pages/BranchLanding"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-live="polite" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/specialties" component={ServicesList} />
        <Route path="/services" component={ServicesList} />
        <Route path="/doctors" component={DoctorsList} />
        <Route path="/branches" component={Branches} />
        <Route path="/branches/:slug" component={BranchDetail} />
        <Route path="/go/:slug" component={BranchLanding} />
        <Route path="/about" component={About} />
        <Route path="/vision" component={Vision} />
        <Route path="/partners" component={Partners} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/booking" component={BookingForm} />
        <Route path="/confirmation/:reference" component={BookingConfirmation} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <ConversionTracker />
          <Toaster position="top-center" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

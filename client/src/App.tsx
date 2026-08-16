import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicesList from "./pages/ServicesList";
import DoctorsList from "./pages/DoctorsList";
import Branches from "./pages/Branches";
import BranchDetail from "./pages/BranchDetail";
import About from "./pages/About";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/specialties" component={ServicesList} />
      <Route path="/services" component={ServicesList} />
      <Route path="/doctors" component={DoctorsList} />
      <Route path="/branches" component={Branches} />
      <Route path="/branches/:slug" component={BranchDetail} />
      <Route path="/about" component={About} />
      <Route path="/booking" component={BookingForm} />
      <Route path="/confirmation/:reference" component={BookingConfirmation} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

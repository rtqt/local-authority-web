// src/App.tsx (Revised)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AllIssues } from "./pages/AllIssues";
import { UrgentIssues } from "./pages/UrgentIssues";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/sign-in" element={<SignIn />} />

          {/* Protected Routes:
            The key here is that ProtectedRoute is the 'element' of a parent Route.
            Its children are the routes that require protection.
            ProtectedRoute will render an <Outlet /> if conditions are met,
            which then renders the matching child Route.
          */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["LocalAuthority", "SystemAdministrator"]}
              />
            }
          >
            {/* These are the protected child routes */}
            <Route path="/" element={<Index />} /> {/* Dashboard */}
            <Route path="/issues/all" element={<AllIssues />} />
            <Route path="/issues/urgent" element={<UrgentIssues />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add any other protected routes here */}
          </Route>

          {/* Catch-all for 404 - make sure this is *after* all other routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

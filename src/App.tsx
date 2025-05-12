
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import FileUploadPage from "./pages/Upload";
import Scenarios from "./pages/Scenarios";
import RiskAnalysis from "./pages/RiskAnalysis";
import TermsExplorer from "./pages/TermsExplorer";
import RiskRegister from "./pages/RiskRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="upload" element={<FileUploadPage />} />
            <Route path="scenarios" element={<Scenarios />} />
            <Route path="risk" element={<RiskAnalysis />} />
            <Route path="risk-register" element={<RiskRegister />} />
            <Route path="terms" element={<TermsExplorer />} />
            {/* These routes will be implemented in future iterations */}
            <Route path="reports" element={<NotFound />} />
            <Route path="analytics" element={<NotFound />} />
            <Route path="team" element={<NotFound />} />
          </Route>
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

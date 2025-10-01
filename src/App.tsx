import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EventProvider } from "@/contexts/EventContext";
import { QuizProvider } from "@/contexts/QuizContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Quiz from "./pages/Quiz";
import MyQR from "./pages/MyQR";
import Scan from "./pages/Scan";
import Match from "./pages/Match";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EventProvider>
        <QuizProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/onboarding" replace />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/myqr" element={<MyQR />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/match" element={<Match />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QuizProvider>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/context/DataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import OrdersPage from "./pages/OrdersPage";
import CaloriesPage from "./pages/CaloriesPage";
import HealthPage from "./pages/HealthPage";
import InsightsPage from "./pages/InsightsPage";
import DataPage from "./pages/DataPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/calories" element={<CaloriesPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

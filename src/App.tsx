
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analista from "./pages/Analista";
import Juridico from "./pages/Juridico";
import SDR from "./pages/SDR";
import Executivo from "./pages/Executivo";
import Imobiliaria from "./pages/Imobiliaria";
import Inquilino from "./pages/Inquilino";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/analista" element={
              <ProtectedRoute allowedRoles={['analista', 'admin']}>
                <Analista />
              </ProtectedRoute>
            } />
            
            <Route path="/juridico" element={
              <ProtectedRoute allowedRoles={['juridico', 'admin']}>
                <Juridico />
              </ProtectedRoute>
            } />
            
            <Route path="/sdr" element={
              <ProtectedRoute allowedRoles={['sdr', 'admin']}>
                <SDR />
              </ProtectedRoute>
            } />
            
            <Route path="/executivo" element={
              <ProtectedRoute allowedRoles={['executivo', 'admin']}>
                <Executivo />
              </ProtectedRoute>
            } />
            
            <Route path="/imobiliaria" element={
              <ProtectedRoute allowedRoles={['imobiliaria', 'admin']}>
                <Imobiliaria />
              </ProtectedRoute>
            } />
            
            <Route path="/inquilino" element={
              <ProtectedRoute allowedRoles={['inquilino', 'admin']}>
                <Inquilino />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

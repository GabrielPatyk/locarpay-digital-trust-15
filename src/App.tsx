
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Analista from "./pages/Analista";
import Juridico from "./pages/Juridico";
import SDR from "./pages/SDR";
import Executivo from "./pages/Executivo";
import Imobiliaria from "./pages/Imobiliaria";
import Inquilino from "./pages/Inquilino";
import Financeiro from "./pages/Financeiro";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Contratos from "./pages/Contratos";
import Fiancas from "./pages/Fiancas";
import Pagamentos from "./pages/Pagamentos";

// Financeiro Pages
import PagamentosFinanceiro from "./pages/PagamentosFinanceiro";
import RelatoriosFinanceiro from "./pages/RelatoriosFinanceiro";
import ConfiguracoesFinanceiro from "./pages/ConfiguracoesFinanceiro";
import InadimplenciaFinanceiro from "./pages/InadimplenciaFinanceiro";

// Executivo Pages
import ImobiliariasExecutivo from "./pages/ImobiliariasExecutivo";
import PropostasExecutivo from "./pages/PropostasExecutivo";
import PerformanceExecutivo from "./pages/PerformanceExecutivo";
import ConfiguracoesExecutivo from "./pages/ConfiguracoesExecutivo";

// Juridico Pages
import ContratosJuridico from "./pages/ContratosJuridico";
import Processos from "./pages/Processos";
import Documentos from "./pages/Documentos";
import ConfiguracoesJuridico from "./pages/ConfiguracoesJuridico";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/unauthorized' || location.pathname === '/forgot-password';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/contratos" element={
            <ProtectedRoute allowedRoles={['inquilino', 'admin']}>
              <Contratos />
            </ProtectedRoute>
          } />
          
          <Route path="/fiancas" element={
            <ProtectedRoute allowedRoles={['inquilino', 'admin']}>
              <Fiancas />
            </ProtectedRoute>
          } />
          
          <Route path="/pagamentos" element={
            <ProtectedRoute allowedRoles={['inquilino', 'admin']}>
              <Pagamentos />
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

          {/* Juridico specific routes */}
          <Route path="/contratos-juridico" element={
            <ProtectedRoute allowedRoles={['juridico', 'admin']}>
              <ContratosJuridico />
            </ProtectedRoute>
          } />

          <Route path="/processos" element={
            <ProtectedRoute allowedRoles={['juridico', 'admin']}>
              <Processos />
            </ProtectedRoute>
          } />

          <Route path="/documentos" element={
            <ProtectedRoute allowedRoles={['juridico', 'admin']}>
              <Documentos />
            </ProtectedRoute>
          } />

          <Route path="/configuracoes-juridico" element={
            <ProtectedRoute allowedRoles={['juridico', 'admin']}>
              <ConfiguracoesJuridico />
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

          {/* Executivo specific routes */}
          <Route path="/imobiliarias-executivo" element={
            <ProtectedRoute allowedRoles={['executivo', 'admin']}>
              <ImobiliariasExecutivo />
            </ProtectedRoute>
          } />

          <Route path="/propostas-executivo" element={
            <ProtectedRoute allowedRoles={['executivo', 'admin']}>
              <PropostasExecutivo />
            </ProtectedRoute>
          } />

          <Route path="/performance-executivo" element={
            <ProtectedRoute allowedRoles={['executivo', 'admin']}>
              <PerformanceExecutivo />
            </ProtectedRoute>
          } />

          <Route path="/configuracoes-executivo" element={
            <ProtectedRoute allowedRoles={['executivo', 'admin']}>
              <ConfiguracoesExecutivo />
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
          
          <Route path="/financeiro" element={
            <ProtectedRoute allowedRoles={['financeiro', 'admin']}>
              <Financeiro />
            </ProtectedRoute>
          } />

          {/* Financeiro specific routes */}
          <Route path="/pagamentos-financeiro" element={
            <ProtectedRoute allowedRoles={['financeiro', 'admin']}>
              <PagamentosFinanceiro />
            </ProtectedRoute>
          } />

          <Route path="/relatorios-financeiro" element={
            <ProtectedRoute allowedRoles={['financeiro', 'admin']}>
              <RelatoriosFinanceiro />
            </ProtectedRoute>
          } />

          <Route path="/configuracoes-financeiro" element={
            <ProtectedRoute allowedRoles={['financeiro', 'admin']}>
              <ConfiguracoesFinanceiro />
            </ProtectedRoute>
          } />

          <Route path="/inadimplencia-financeiro" element={
            <ProtectedRoute allowedRoles={['financeiro', 'admin']}>
              <InadimplenciaFinanceiro />
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
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

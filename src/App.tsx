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

// Imobiliaria Pages
import InquilinosImobiliaria from "./pages/InquilinosImobiliaria";
import ContratosImobiliaria from "./pages/ContratosImobiliaria";
import ConfiguracoesImobiliaria from "./pages/ConfiguracoesImobiliaria";

// Juridico Pages
import ContratosJuridico from "./pages/ContratosJuridico";
import Processos from "./pages/Processos";
import Documentos from "./pages/Documentos";
import ConfiguracoesJuridico from "./pages/ConfiguracoesJuridico";

// Analista Pages
import Analises from "./pages/Analises";
import Clientes from "./pages/Clientes";
import RelatoriosAnalista from "./pages/RelatoriosAnalista";
import ConfiguracoesAnalista from "./pages/ConfiguracoesAnalista";

// SDR Pages
import Leads from "./pages/Leads";
import Campanhas from "./pages/Campanhas";
import RelatoriosSDR from "./pages/RelatoriosSDR";

// Admin Pages
import FiancasAdmin from "./pages/FiancasAdmin";
import ImobiliariasAdmin from "./pages/ImobiliariasAdmin";
import ExecutivosAdmin from "./pages/ExecutivosAdmin";
import SinistrosAdmin from "./pages/SinistrosAdmin";
import LeadsAdmin from "./pages/LeadsAdmin";
import ConfiguracoesAdmin from "./pages/ConfiguracoesAdmin";

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

          {/* Analista specific routes */}
          <Route path="/analises" element={
            <ProtectedRoute allowedRoles={['analista', 'admin']}>
              <Analises />
            </ProtectedRoute>
          } />

          <Route path="/clientes" element={
            <ProtectedRoute allowedRoles={['analista', 'admin']}>
              <Clientes />
            </ProtectedRoute>
          } />

          <Route path="/relatorios-analista" element={
            <ProtectedRoute allowedRoles={['analista', 'admin']}>
              <RelatoriosAnalista />
            </ProtectedRoute>
          } />

          <Route path="/configuracoes-analista" element={
            <ProtectedRoute allowedRoles={['analista', 'admin']}>
              <ConfiguracoesAnalista />
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

          {/* SDR specific routes */}
          <Route path="/leads" element={
            <ProtectedRoute allowedRoles={['sdr', 'admin']}>
              <Leads />
            </ProtectedRoute>
          } />

          <Route path="/campanhas" element={
            <ProtectedRoute allowedRoles={['sdr', 'admin']}>
              <Campanhas />
            </ProtectedRoute>
          } />

          <Route path="/relatorios-sdr" element={
            <ProtectedRoute allowedRoles={['sdr', 'admin']}>
              <RelatoriosSDR />
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

          {/* Imobiliaria specific routes */}
          <Route path="/inquilinos-imobiliaria" element={
            <ProtectedRoute allowedRoles={['imobiliaria', 'admin']}>
              <InquilinosImobiliaria />
            </ProtectedRoute>
          } />

          <Route path="/contratos-imobiliaria" element={
            <ProtectedRoute allowedRoles={['imobiliaria', 'admin']}>
              <ContratosImobiliaria />
            </ProtectedRoute>
          } />

          <Route path="/configuracoes-imobiliaria" element={
            <ProtectedRoute allowedRoles={['imobiliaria', 'admin']}>
              <ConfiguracoesImobiliaria />
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

          {/* Admin specific routes */}
          <Route path="/fiancas-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FiancasAdmin />
            </ProtectedRoute>
          } />

          <Route path="/imobiliarias-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ImobiliariasAdmin />
            </ProtectedRoute>
          } />

          <Route path="/executivos-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ExecutivosAdmin />
            </ProtectedRoute>
          } />

          <Route path="/sinistros-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SinistrosAdmin />
            </ProtectedRoute>
          } />

          <Route path="/leads-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LeadsAdmin />
            </ProtectedRoute>
          } />

          <Route path="/configuracoes-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ConfiguracoesAdmin />
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

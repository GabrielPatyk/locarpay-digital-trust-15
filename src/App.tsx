
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InactivityProvider } from "@/contexts/InactivityContext";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RedefinirSenha from "./pages/RedefinirSenha";
import Dashboard from "./pages/Dashboard";
import Inquilino from "./pages/Inquilino";
import Imobiliaria from "./pages/Imobiliaria";
import Analista from "./pages/Analista";
import Juridico from "./pages/Juridico";
import SDR from "./pages/SDR";
import Executivo from "./pages/Executivo";
import Financeiro from "./pages/Financeiro";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Admin pages
import FiancasAdmin from "./pages/FiancasAdmin";
import ImobiliariasAdmin from "./pages/ImobiliariasAdmin";
import ExecutivosAdmin from "./pages/ExecutivosAdmin";
import LeadsAdmin from "./pages/LeadsAdmin";
import RelatoriosAdmin from "./pages/RelatoriosAdmin";
import SinistrosAdmin from "./pages/SinistrosAdmin";
import ConfiguracoesAdmin from "./pages/ConfiguracoesAdmin";

// Imobiliaria pages
import FiancasImobiliaria from "./pages/FiancasImobiliaria";
import InquilinosImobiliaria from "./pages/InquilinosImobiliaria";
import ContratosImobiliaria from "./pages/ContratosImobiliaria";
import ConfiguracoesImobiliaria from "./pages/ConfiguracoesImobiliaria";

// Analista pages
import Analises from "./pages/Analises";
import RelatoriosAnalista from "./pages/RelatoriosAnalista";
import ConfiguracoesAnalista from "./pages/ConfiguracoesAnalista";

// Juridico pages
import Processos from "./pages/Processos";
import ContratosJuridico from "./pages/ContratosJuridico";
import ConfiguracoesJuridico from "./pages/ConfiguracoesJuridico";

// SDR pages
import Leads from "./pages/Leads";
import Campanhas from "./pages/Campanhas";
import RelatoriosSDR from "./pages/RelatoriosSDR";

// Executivo pages
import ImobiliariasExecutivo from "./pages/ImobiliariasExecutivo";
import PropostasExecutivo from "./pages/PropostasExecutivo";
import PerformanceExecutivo from "./pages/PerformanceExecutivo";
import ConfiguracoesExecutivo from "./pages/ConfiguracoesExecutivo";

// Financeiro pages
import PagamentosFinanceiro from "./pages/PagamentosFinanceiro";
import InadimplenciaFinanceiro from "./pages/InadimplenciaFinanceiro";
import RelatoriosFinanceiro from "./pages/RelatoriosFinanceiro";
import ConfiguracoesFinanceiro from "./pages/ConfiguracoesFinanceiro";

// Shared pages
import DetalheFianca from "./pages/DetalheFianca";
import Fiancas from "./pages/Fiancas";
import Documentos from "./pages/Documentos";
import Contratos from "./pages/Contratos";
import Pagamentos from "./pages/Pagamentos";
import Clientes from "./pages/Clientes";

// Components
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InactivityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes with Layout */}
              <Route element={<Layout />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* Inquilino routes */}
                <Route path="/inquilino" element={
                  <ProtectedRoute allowedTypes={['inquilino']}>
                    <Inquilino />
                  </ProtectedRoute>
                } />
                
                {/* Imobiliaria routes */}
                <Route path="/imobiliaria" element={
                  <ProtectedRoute allowedTypes={['imobiliaria']}>
                    <Imobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliaria/fiancas" element={
                  <ProtectedRoute allowedTypes={['imobiliaria']}>
                    <FiancasImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliaria/inquilinos" element={
                  <ProtectedRoute allowedTypes={['imobiliaria']}>
                    <InquilinosImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliaria/contratos" element={
                  <ProtectedRoute allowedTypes={['imobiliaria']}>
                    <ContratosImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliaria/configuracoes" element={
                  <ProtectedRoute allowedTypes={['imobiliaria']}>
                    <ConfiguracoesImobiliaria />
                  </ProtectedRoute>
                } />
                
                {/* Analista routes */}
                <Route path="/analista" element={
                  <ProtectedRoute allowedTypes={['analista']}>
                    <Analista />
                  </ProtectedRoute>
                } />
                <Route path="/analista/analises" element={
                  <ProtectedRoute allowedTypes={['analista']}>
                    <Analises />
                  </ProtectedRoute>
                } />
                <Route path="/analista/relatorios" element={
                  <ProtectedRoute allowedTypes={['analista']}>
                    <RelatoriosAnalista />
                  </ProtectedRoute>
                } />
                <Route path="/analista/configuracoes" element={
                  <ProtectedRoute allowedTypes={['analista']}>
                    <ConfiguracoesAnalista />
                  </ProtectedRoute>
                } />
                
                {/* Juridico routes */}
                <Route path="/juridico" element={
                  <ProtectedRoute allowedTypes={['juridico']}>
                    <Juridico />
                  </ProtectedRoute>
                } />
                <Route path="/juridico/processos" element={
                  <ProtectedRoute allowedTypes={['juridico']}>
                    <Processos />
                  </ProtectedRoute>
                } />
                <Route path="/juridico/contratos" element={
                  <ProtectedRoute allowedTypes={['juridico']}>
                    <ContratosJuridico />
                  </ProtectedRoute>
                } />
                <Route path="/juridico/configuracoes" element={
                  <ProtectedRoute allowedTypes={['juridico']}>
                    <ConfiguracoesJuridico />
                  </ProtectedRoute>
                } />
                
                {/* SDR routes */}
                <Route path="/sdr" element={
                  <ProtectedRoute allowedTypes={['sdr']}>
                    <SDR />
                  </ProtectedRoute>
                } />
                <Route path="/sdr/leads" element={
                  <ProtectedRoute allowedTypes={['sdr']}>
                    <Leads />
                  </ProtectedRoute>
                } />
                <Route path="/sdr/campanhas" element={
                  <ProtectedRoute allowedTypes={['sdr']}>
                    <Campanhas />
                  </ProtectedRoute>
                } />
                <Route path="/sdr/relatorios" element={
                  <ProtectedRoute allowedTypes={['sdr']}>
                    <RelatoriosSDR />
                  </ProtectedRoute>
                } />
                
                {/* Executivo routes */}
                <Route path="/executivo" element={
                  <ProtectedRoute allowedTypes={['executivo']}>
                    <Executivo />
                  </ProtectedRoute>
                } />
                <Route path="/executivo/imobiliarias" element={
                  <ProtectedRoute allowedTypes={['executivo']}>
                    <ImobiliariasExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/executivo/propostas" element={
                  <ProtectedRoute allowedTypes={['executivo']}>
                    <PropostasExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/executivo/performance" element={
                  <ProtectedRoute allowedTypes={['executivo']}>
                    <PerformanceExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/executivo/configuracoes" element={
                  <ProtectedRoute allowedTypes={['executivo']}>
                    <ConfiguracoesExecutivo />
                  </ProtectedRoute>
                } />
                
                {/* Financeiro routes */}
                <Route path="/financeiro" element={
                  <ProtectedRoute allowedTypes={['financeiro']}>
                    <Financeiro />
                  </ProtectedRoute>
                } />
                <Route path="/financeiro/pagamentos" element={
                  <ProtectedRoute allowedTypes={['financeiro']}>
                    <PagamentosFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/financeiro/inadimplencia" element={
                  <ProtectedRoute allowedTypes={['financeiro']}>
                    <InadimplenciaFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/financeiro/relatorios" element={
                  <ProtectedRoute allowedTypes={['financeiro']}>
                    <RelatoriosFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/financeiro/configuracoes" element={
                  <ProtectedRoute allowedTypes={['financeiro']}>
                    <ConfiguracoesFinanceiro />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/fiancas" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <FiancasAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/imobiliarias" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <ImobiliariasAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/executivos" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <ExecutivosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/leads" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <LeadsAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/relatorios" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <RelatoriosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/sinistros" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <SinistrosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/configuracoes" element={
                  <ProtectedRoute allowedTypes={['admin']}>
                    <ConfiguracoesAdmin />
                  </ProtectedRoute>
                } />
                
                {/* Shared routes accessible by multiple user types */}
                <Route path="/fiancas" element={
                  <ProtectedRoute>
                    <Fiancas />
                  </ProtectedRoute>
                } />
                <Route path="/fianca/:id" element={
                  <ProtectedRoute>
                    <DetalheFianca />
                  </ProtectedRoute>
                } />
                <Route path="/documentos" element={
                  <ProtectedRoute>
                    <Documentos />
                  </ProtectedRoute>
                } />
                <Route path="/contratos" element={
                  <ProtectedRoute>
                    <Contratos />
                  </ProtectedRoute>
                } />
                <Route path="/pagamentos" element={
                  <ProtectedRoute>
                    <Pagamentos />
                  </ProtectedRoute>
                } />
                <Route path="/clientes" element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InactivityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

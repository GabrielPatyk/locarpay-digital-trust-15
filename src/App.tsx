
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
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout title="Dashboard">
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Inquilino routes */}
              <Route path="/inquilino" element={
                <ProtectedRoute allowedRoles={['inquilino']}>
                  <Layout title="Inquilino">
                    <Inquilino />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Imobiliaria routes */}
              <Route path="/imobiliaria" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Layout title="Imobiliária">
                    <Imobiliaria />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/imobiliaria/fiancas" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Layout title="Fianças">
                    <FiancasImobiliaria />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/imobiliaria/inquilinos" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Layout title="Inquilinos">
                    <InquilinosImobiliaria />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/imobiliaria/contratos" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Layout title="Contratos">
                    <ContratosImobiliaria />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/imobiliaria/configuracoes" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Layout title="Configurações">
                    <ConfiguracoesImobiliaria />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Analista routes */}
              <Route path="/analista" element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <Layout title="Analista">
                    <Analista />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analista/analises" element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <Layout title="Análises">
                    <Analises />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analista/relatorios" element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <Layout title="Relatórios">
                    <RelatoriosAnalista />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analista/configuracoes" element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <Layout title="Configurações">
                    <ConfiguracoesAnalista />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Juridico routes */}
              <Route path="/juridico" element={
                <ProtectedRoute allowedRoles={['juridico']}>
                  <Layout title="Jurídico">
                    <Juridico />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/juridico/processos" element={
                <ProtectedRoute allowedRoles={['juridico']}>
                  <Layout title="Processos">
                    <Processos />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/juridico/contratos" element={
                <ProtectedRoute allowedRoles={['juridico']}>
                  <Layout title="Contratos">
                    <ContratosJuridico />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/juridico/configuracoes" element={
                <ProtectedRoute allowedRoles={['juridico']}>
                  <Layout title="Configurações">
                    <ConfiguracoesJuridico />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* SDR routes */}
              <Route path="/sdr" element={
                <ProtectedRoute allowedRoles={['sdr']}>
                  <Layout title="SDR">
                    <SDR />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/sdr/leads" element={
                <ProtectedRoute allowedRoles={['sdr']}>
                  <Layout title="Leads">
                    <Leads />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/sdr/campanhas" element={
                <ProtectedRoute allowedRoles={['sdr']}>
                  <Layout title="Campanhas">
                    <Campanhas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/sdr/relatorios" element={
                <ProtectedRoute allowedRoles={['sdr']}>
                  <Layout title="Relatórios">
                    <RelatoriosSDR />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Executivo routes */}
              <Route path="/executivo" element={
                <ProtectedRoute allowedRoles={['executivo']}>
                  <Layout title="Executivo">
                    <Executivo />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/executivo/imobiliarias" element={
                <ProtectedRoute allowedRoles={['executivo']}>
                  <Layout title="Imobiliárias">
                    <ImobiliariasExecutivo />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/executivo/propostas" element={
                <ProtectedRoute allowedRoles={['executivo']}>
                  <Layout title="Propostas">
                    <PropostasExecutivo />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/executivo/performance" element={
                <ProtectedRoute allowedRoles={['executivo']}>
                  <Layout title="Performance">
                    <PerformanceExecutivo />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/executivo/configuracoes" element={
                <ProtectedRoute allowedRoles={['executivo']}>
                  <Layout title="Configurações">
                    <ConfiguracoesExecutivo />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Financeiro routes */}
              <Route path="/financeiro" element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Layout title="Financeiro">
                    <Financeiro />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/financeiro/pagamentos" element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Layout title="Pagamentos">
                    <PagamentosFinanceiro />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/financeiro/inadimplencia" element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Layout title="Inadimplência">
                    <InadimplenciaFinanceiro />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/financeiro/relatorios" element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Layout title="Relatórios">
                    <RelatoriosFinanceiro />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/financeiro/configuracoes" element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Layout title="Configurações">
                    <ConfiguracoesFinanceiro />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Admin">
                    <Admin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/fiancas" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Fianças">
                    <FiancasAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/imobiliarias" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Imobiliárias">
                    <ImobiliariasAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/executivos" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Executivos">
                    <ExecutivosAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/leads" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Leads">
                    <LeadsAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/relatorios" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Relatórios">
                    <RelatoriosAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/sinistros" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Sinistros">
                    <SinistrosAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/configuracoes" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout title="Configurações">
                    <ConfiguracoesAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Shared routes accessible by multiple user types */}
              <Route path="/fiancas" element={
                <ProtectedRoute>
                  <Layout title="Fianças">
                    <Fiancas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/fianca/:id" element={
                <ProtectedRoute>
                  <Layout title="Detalhe da Fiança">
                    <DetalheFianca />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/documentos" element={
                <ProtectedRoute>
                  <Layout title="Documentos">
                    <Documentos />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/contratos" element={
                <ProtectedRoute>
                  <Layout title="Contratos">
                    <Contratos />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pagamentos" element={
                <ProtectedRoute>
                  <Layout title="Pagamentos">
                    <Pagamentos />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <Layout title="Clientes">
                    <Clientes />
                  </Layout>
                </ProtectedRoute>
              } />
              
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

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InactivityProvider } from "@/contexts/InactivityContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppSidebar from "@/components/AppSidebar";
import ContractGuard from "@/components/ContractGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RedefinirSenha from "./pages/RedefinirSenha";
import VerificarEmail from "./pages/VerificarEmail";
import Dashboard from "./pages/Dashboard";
import Fiancas from "./pages/Fiancas";
import Contratos from "./pages/Contratos";
import Clientes from "./pages/Clientes";
import Analises from "./pages/Analises";
import Documentos from "./pages/Documentos";
import ConfiguracoesImobiliaria from "./pages/ConfiguracoesImobiliaria";
import Admin from "./pages/Admin";
import Analista from "./pages/Analista";
import Executivo from "./pages/Executivo";
import Financeiro from "./pages/Financeiro";
import Juridico from "./pages/Juridico";
import Imobiliaria from "./pages/Imobiliaria";
import ImoveisImobiliaria from "./pages/ImoveisImobiliaria";
import Inquilino from "./pages/Inquilino";
import SDR from "./pages/SDR";
import ConfiguracoesAdmin from "./pages/ConfiguracoesAdmin";
import ConfiguracoesAnalista from "./pages/ConfiguracoesAnalista";
import ConfiguracoesExecutivo from "./pages/ConfiguracoesExecutivo";
import ConfiguracoesFinanceiro from "./pages/ConfiguracoesFinanceiro";
import ConfiguracoesJuridico from "./pages/ConfiguracoesJuridico";
import ConfiguracoesSDR from "./pages/ConfiguracoesSDR";
import FiancasAdmin from "./pages/FiancasAdmin";
import FiancasImobiliaria from "./pages/FiancasImobiliaria";
import ImobiliariasAdmin from "./pages/ImobiliariasAdmin";
import ImobiliariasExecutivo from "./pages/ImobiliariasExecutivo";
import ExecutivosAdmin from "./pages/ExecutivosAdmin";
import LeadsAdmin from "./pages/LeadsAdmin";
import RelatoriosAdmin from "./pages/RelatoriosAdmin";
import RelatoriosAnalista from "./pages/RelatoriosAnalista";
import RelatoriosFinanceiro from "./pages/RelatoriosFinanceiro";
import RelatoriosSDR from "./pages/RelatoriosSDR";
import SinistrosAdmin from "./pages/SinistrosAdmin";
import ContratosImobiliaria from "./pages/ContratosImobiliaria";
import ContratosJuridico from "./pages/ContratosJuridico";
import InquilinosImobiliaria from "./pages/InquilinosImobiliaria";
import Pagamentos from "./pages/Pagamentos";
import PagamentosFinanceiro from "./pages/PagamentosFinanceiro";
import InadimplenciaFinanceiro from "./pages/InadimplenciaFinanceiro";
import Processos from "./pages/Processos";
import PropostasExecutivo from "./pages/PropostasExecutivo";
import PerformanceExecutivo from "./pages/PerformanceExecutivo";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import DetalheFianca from './pages/DetalheFianca';
import DetalheImobiliaria from './pages/DetalheImobiliaria';
import EditarImobiliaria from './pages/EditarImobiliaria';
import CRM from './pages/CRM';
import Automacao from './pages/Automacao';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <InactivityProvider>
              <ContractGuard>
                <div className="min-h-screen flex w-full">
                <SidebarProvider>
                  <Routes>
                    {/* Public routes without sidebar */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                    <Route path="/verificar-email" element={<VerificarEmail />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />

                    {/* Dashboard restricted to admin only */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <ConfiguracoesAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/fiancas-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <FiancasAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/imobiliarias-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <ImobiliariasAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/detalhe-imobiliaria/:id" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <DetalheImobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/editar-imobiliaria/:id" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <EditarImobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/executivos-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <ExecutivosAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/leads-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <LeadsAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/relatorios-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <RelatoriosAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/sinistros-admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AppSidebar />
                        <SinistrosAdmin />
                      </ProtectedRoute>
                    } />

                    {/* Analista routes */}
                    <Route path="/analista" element={
                      <ProtectedRoute allowedRoles={['analista']}>
                        <AppSidebar />
                        <Analista />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-analista" element={
                      <ProtectedRoute allowedRoles={['analista']}>
                        <AppSidebar />
                        <ConfiguracoesAnalista />
                      </ProtectedRoute>
                    } />
                    <Route path="/relatorios-analista" element={
                      <ProtectedRoute allowedRoles={['analista']}>
                        <AppSidebar />
                        <RelatoriosAnalista />
                      </ProtectedRoute>
                    } />

                    {/* Executivo routes */}
                    <Route path="/executivo" element={
                      <ProtectedRoute allowedRoles={['executivo']}>
                        <AppSidebar />
                        <Executivo />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-executivo" element={
                      <ProtectedRoute allowedRoles={['executivo']}>
                        <AppSidebar />
                        <ConfiguracoesExecutivo />
                      </ProtectedRoute>
                    } />
                    <Route path="/imobiliarias-executivo" element={
                      <ProtectedRoute allowedRoles={['executivo']}>
                        <AppSidebar />
                        <ImobiliariasExecutivo />
                      </ProtectedRoute>
                    } />
                    <Route path="/propostas-executivo" element={
                      <ProtectedRoute allowedRoles={['executivo']}>
                        <AppSidebar />
                        <PropostasExecutivo />
                      </ProtectedRoute>
                    } />
                    <Route path="/performance-executivo" element={
                      <ProtectedRoute allowedRoles={['executivo']}>
                        <AppSidebar />
                        <PerformanceExecutivo />
                      </ProtectedRoute>
                    } />

                    {/* Financeiro routes */}
                    <Route path="/financeiro" element={
                      <ProtectedRoute allowedRoles={['financeiro']}>
                        <AppSidebar />
                        <Financeiro />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-financeiro" element={
                      <ProtectedRoute allowedRoles={['financeiro']}>
                        <AppSidebar />
                        <ConfiguracoesFinanceiro />
                      </ProtectedRoute>
                    } />
                    <Route path="/relatorios-financeiro" element={
                      <ProtectedRoute allowedRoles={['financeiro']}>
                        <AppSidebar />
                        <RelatoriosFinanceiro />
                      </ProtectedRoute>
                    } />
                    <Route path="/pagamentos-financeiro" element={
                      <ProtectedRoute allowedRoles={['financeiro']}>
                        <AppSidebar />
                        <PagamentosFinanceiro />
                      </ProtectedRoute>
                    } />
                    <Route path="/inadimplencia-financeiro" element={
                      <ProtectedRoute allowedRoles={['financeiro']}>
                        <AppSidebar />
                        <InadimplenciaFinanceiro />
                      </ProtectedRoute>
                    } />

                    {/* Juridico routes */}
                    <Route path="/juridico" element={
                      <ProtectedRoute allowedRoles={['juridico']}>
                        <AppSidebar />
                        <Juridico />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-juridico" element={
                      <ProtectedRoute allowedRoles={['juridico']}>
                        <AppSidebar />
                        <ConfiguracoesJuridico />
                      </ProtectedRoute>
                    } />
                    <Route path="/contratos-juridico" element={
                      <ProtectedRoute allowedRoles={['juridico']}>
                        <AppSidebar />
                        <ContratosJuridico />
                      </ProtectedRoute>
                    } />
                    <Route path="/processos" element={
                      <ProtectedRoute allowedRoles={['juridico']}>
                        <AppSidebar />
                        <Processos />
                      </ProtectedRoute>
                    } />

                    {/* Imobiliária routes */}
                    <Route path="/imobiliaria" element={
                      <ProtectedRoute allowedRoles={['imobiliaria']}>
                        <AppSidebar />
                        <Imobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-imobiliaria" element={
                      <ProtectedRoute allowedRoles={['imobiliaria']}>
                        <AppSidebar />
                        <ConfiguracoesImobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/fiancas-imobiliaria" element={
                      <ProtectedRoute allowedRoles={['imobiliaria']}>
                        <AppSidebar />
                        <FiancasImobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/contratos-imobiliaria" element={
                      <ProtectedRoute allowedRoles={['imobiliaria']}>
                        <AppSidebar />
                        <ContratosImobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/inquilinos-imobiliaria" element={
                      <ProtectedRoute allowedRoles={['imobiliaria']}>
                        <AppSidebar />
                        <InquilinosImobiliaria />
                      </ProtectedRoute>
                    } />
                    <Route path="/imoveis-imobiliaria" element={
                      <ProtectedRoute allowedRoles={['imobiliaria']}>
                        <AppSidebar />
                        <ImoveisImobiliaria />
                      </ProtectedRoute>
                    } />

                    {/* Inquilino routes */}
                    <Route path="/inquilino" element={
                      <ProtectedRoute allowedRoles={['inquilino']}>
                        <AppSidebar />
                        <Inquilino />
                      </ProtectedRoute>
                    } />

                    {/* SDR routes */}
                    <Route path="/sdr" element={
                      <ProtectedRoute allowedRoles={['sdr']}>
                        <AppSidebar />
                        <SDR />
                      </ProtectedRoute>
                    } />
                    <Route path="/configuracoes-sdr" element={
                      <ProtectedRoute allowedRoles={['sdr']}>
                        <AppSidebar />
                        <ConfiguracoesSDR />
                      </ProtectedRoute>
                    } />
                    <Route path="/relatorios-sdr" element={
                      <ProtectedRoute allowedRoles={['sdr']}>
                        <AppSidebar />
                        <RelatoriosSDR />
                      </ProtectedRoute>
                    } />
                    <Route path="/crm" element={
                      <ProtectedRoute allowedRoles={['sdr']}>
                        <AppSidebar />
                        <CRM />
                      </ProtectedRoute>
                    } />
                    <Route path="/automacao" element={
                      <ProtectedRoute allowedRoles={['sdr']}>
                        <AppSidebar />
                        <Automacao />
                      </ProtectedRoute>
                    } />

                    {/* Shared routes */}
                    <Route path="/fiancas" element={
                      <ProtectedRoute>
                        <AppSidebar />
                        <Fiancas />
                      </ProtectedRoute>
                    } />
                    <Route path="/contratos" element={
                      <ProtectedRoute>
                        <AppSidebar />
                        <Contratos />
                      </ProtectedRoute>
                    } />
                    <Route path="/clientes" element={
                      <ProtectedRoute>
                        <AppSidebar />
                        <Clientes />
                      </ProtectedRoute>
                    } />
                    <Route path="/analises" element={
                      <ProtectedRoute>
                        <AppSidebar />
                        <Analises />
                      </ProtectedRoute>
                    } />
                    <Route path="/documentos" element={
                      <ProtectedRoute>
                        <AppSidebar />
                        <Documentos />
                      </ProtectedRoute>
                    } />
                    <Route path="/pagamentos" element={
                      <ProtectedRoute>
                        <AppSidebar />
                        <Pagamentos />
                      </ProtectedRoute>
                    } />

                    <Route path="/detalhe-fianca/:id" element={<ProtectedRoute><DetalheFianca /></ProtectedRoute>} />
                  </Routes>
                </SidebarProvider>
                </div>
              </ContractGuard>
            </InactivityProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

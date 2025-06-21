
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileCompletionCheck from '@/components/ProfileCompletionCheck';

// Public pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Admin pages
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import FiancasAdmin from '@/pages/FiancasAdmin';
import ImobiliariasAdmin from '@/pages/ImobiliariasAdmin';
import ExecutivosAdmin from '@/pages/ExecutivosAdmin';
import SinistrosAdmin from '@/pages/SinistrosAdmin';
import LeadsAdmin from '@/pages/LeadsAdmin';
import RelatoriosAdmin from '@/pages/RelatoriosAdmin';
import ConfiguracoesAdmin from '@/pages/ConfiguracoesAdmin';

// Analyst pages
import Analista from '@/pages/Analista';
import Analises from '@/pages/Analises';
import Clientes from '@/pages/Clientes';
import RelatoriosAnalista from '@/pages/RelatoriosAnalista';
import ConfiguracoesAnalista from '@/pages/ConfiguracoesAnalista';

// Legal pages
import Juridico from '@/pages/Juridico';
import ContratosJuridico from '@/pages/ContratosJuridico';
import Processos from '@/pages/Processos';
import Documentos from '@/pages/Documentos';
import ConfiguracoesJuridico from '@/pages/ConfiguracoesJuridico';

// SDR pages
import SDR from '@/pages/SDR';
import Leads from '@/pages/Leads';
import Campanhas from '@/pages/Campanhas';
import RelatoriosSDR from '@/pages/RelatoriosSDR';

// Executive pages
import Executivo from '@/pages/Executivo';
import ImobiliariasExecutivo from '@/pages/ImobiliariasExecutivo';
import PropostasExecutivo from '@/pages/PropostasExecutivo';
import PerformanceExecutivo from '@/pages/PerformanceExecutivo';
import ConfiguracoesExecutivo from '@/pages/ConfiguracoesExecutivo';

// Real Estate pages
import Imobiliaria from '@/pages/Imobiliaria';
import FiancasImobiliaria from '@/pages/FiancasImobiliaria';
import InquilinosImobiliaria from '@/pages/InquilinosImobiliaria';
import ContratosImobiliaria from '@/pages/ContratosImobiliaria';
import ConfiguracoesImobiliaria from '@/pages/ConfiguracoesImobiliaria';

// Tenant pages
import Inquilino from '@/pages/Inquilino';
import Contratos from '@/pages/Contratos';
import Fiancas from '@/pages/Fiancas';
import Pagamentos from '@/pages/Pagamentos';

// Finance pages
import Financeiro from '@/pages/Financeiro';
import PagamentosFinanceiro from '@/pages/PagamentosFinanceiro';
import InadimplenciaFinanceiro from '@/pages/InadimplenciaFinanceiro';
import RelatoriosFinanceiro from '@/pages/RelatoriosFinanceiro';
import ConfiguracoesFinanceiro from '@/pages/ConfiguracoesFinanceiro';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Admin routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/fiancas-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <FiancasAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliarias-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <ImobiliariasAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/executivos-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <ExecutivosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/sinistros-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <SinistrosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/leads-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <LeadsAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <RelatoriosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfileCompletionCheck />
                    <ConfiguracoesAdmin />
                  </ProtectedRoute>
                } />

                {/* Analyst routes */}
                <Route path="/analista" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <ProfileCompletionCheck />
                    <Analista />
                  </ProtectedRoute>
                } />
                <Route path="/analises" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <ProfileCompletionCheck />
                    <Analises />
                  </ProtectedRoute>
                } />
                <Route path="/clientes" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <ProfileCompletionCheck />
                    <Clientes />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-analista" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <ProfileCompletionCheck />
                    <RelatoriosAnalista />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-analista" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <ProfileCompletionCheck />
                    <ConfiguracoesAnalista />
                  </ProtectedRoute>
                } />

                {/* Legal routes */}
                <Route path="/juridico" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ProfileCompletionCheck />
                    <Juridico />
                  </ProtectedRoute>
                } />
                <Route path="/contratos-juridico" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ProfileCompletionCheck />
                    <ContratosJuridico />
                  </ProtectedRoute>
                } />
                <Route path="/processos" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ProfileCompletionCheck />
                    <Processos />
                  </ProtectedRoute>
                } />
                <Route path="/documentos" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ProfileCompletionCheck />
                    <Documentos />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-juridico" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ProfileCompletionCheck />
                    <ConfiguracoesJuridico />
                  </ProtectedRoute>
                } />

                {/* SDR routes */}
                <Route path="/sdr" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <ProfileCompletionCheck />
                    <SDR />
                  </ProtectedRoute>
                } />
                <Route path="/leads" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <ProfileCompletionCheck />
                    <Leads />
                  </ProtectedRoute>
                } />
                <Route path="/campanhas" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <ProfileCompletionCheck />
                    <Campanhas />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-sdr" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <ProfileCompletionCheck />
                    <RelatoriosSDR />
                  </ProtectedRoute>
                } />

                {/* Executive routes */}
                <Route path="/executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ProfileCompletionCheck />
                    <Executivo />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliarias-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ProfileCompletionCheck />
                    <ImobiliariasExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/propostas-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ProfileCompletionCheck />
                    <PropostasExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/performance-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ProfileCompletionCheck />
                    <PerformanceExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ProfileCompletionCheck />
                    <ConfiguracoesExecutivo />
                  </ProtectedRoute>
                } />

                {/* Real Estate routes */}
                <Route path="/imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ProfileCompletionCheck />
                    <Imobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/fiancas-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ProfileCompletionCheck />
                    <FiancasImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/inquilinos-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ProfileCompletionCheck />
                    <InquilinosImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/contratos-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ProfileCompletionCheck />
                    <ContratosImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ConfiguracoesImobiliaria />
                  </ProtectedRoute>
                } />

                {/* Tenant routes */}
                <Route path="/inquilino" element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <ProfileCompletionCheck />
                    <Inquilino />
                  </ProtectedRoute>
                } />
                <Route path="/contratos" element={
                  <ProtectedRoute allowedRoles={['inquilino', 'admin']}>
                    <ProfileCompletionCheck />
                    <Contratos />
                  </ProtectedRoute>
                } />
                <Route path="/fiancas" element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <ProfileCompletionCheck />
                    <Fiancas />
                  </ProtectedRoute>
                } />
                <Route path="/pagamentos" element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <ProfileCompletionCheck />
                    <Pagamentos />
                  </ProtectedRoute>
                } />

                {/* Finance routes */}
                <Route path="/financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <ProfileCompletionCheck />
                    <Financeiro />
                  </ProtectedRoute>
                } />
                <Route path="/pagamentos-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <ProfileCompletionCheck />
                    <PagamentosFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/inadimplencia-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <ProfileCompletionCheck />
                    <InadimplenciaFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <ProfileCompletionCheck />
                    <RelatoriosFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <ProfileCompletionCheck />
                    <ConfiguracoesFinanceiro />
                  </ProtectedRoute>
                } />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

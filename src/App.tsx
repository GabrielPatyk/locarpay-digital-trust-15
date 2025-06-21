
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileCompletionCheck from '@/components/ProfileCompletionCheck';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Unauthorized from '@/pages/Unauthorized';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import Inquilino from '@/pages/Inquilino';
import Analista from '@/pages/Analista';
import Juridico from '@/pages/Juridico';
import SDR from '@/pages/SDR';
import Executivo from '@/pages/Executivo';
import Imobiliaria from '@/pages/Imobiliaria';
import Financeiro from '@/pages/Financeiro';
import Contratos from '@/pages/Contratos';
import ContratosJuridico from '@/pages/ContratosJuridico';
import Processos from '@/pages/Processos';
import Documentos from '@/pages/Documentos';
import Leads from '@/pages/Leads';
import Campanhas from '@/pages/Campanhas';
import RelatoriosSDR from '@/pages/RelatoriosSDR';
import ImobiliariasExecutivo from '@/pages/ImobiliariasExecutivo';
import PropostasExecutivo from '@/pages/PropostasExecutivo';
import PerformanceExecutivo from '@/pages/PerformanceExecutivo';
import InquilinosImobiliaria from '@/pages/InquilinosImobiliaria';
import ContratosImobiliaria from '@/pages/ContratosImobiliaria';
import PagamentosFinanceiro from '@/pages/PagamentosFinanceiro';
import InadimplenciaFinanceiro from '@/pages/InadimplenciaFinanceiro';
import RelatoriosFinanceiro from '@/pages/RelatoriosFinanceiro';
import ConfiguracoesAdmin from '@/pages/ConfiguracoesAdmin';
import ConfiguracoesAnalista from '@/pages/ConfiguracoesAnalista';
import ConfiguracoesJuridico from '@/pages/ConfiguracoesJuridico';
import ConfiguracoesExecutivo from '@/pages/ConfiguracoesExecutivo';
import ConfiguracoesImobiliaria from '@/pages/ConfiguracoesImobiliaria';
import ConfiguracoesFinanceiro from '@/pages/ConfiguracoesFinanceiro';
import RelatoriosAdmin from '@/pages/RelatoriosAdmin';
import LeadsAdmin from '@/pages/LeadsAdmin';
import FiancasAdmin from '@/pages/FiancasAdmin';
import ExecutivosAdmin from '@/pages/ExecutivosAdmin';
import ImobiliariasAdmin from '@/pages/ImobiliariasAdmin';
import SinistrosAdmin from '@/pages/SinistrosAdmin';
import RelatoriosAnalista from '@/pages/RelatoriosAnalista';
import Pagamentos from '@/pages/Pagamentos';
import Fiancas from '@/pages/Fiancas';
import FiancasImobiliaria from '@/pages/FiancasImobiliaria';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <Admin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/inquilino" element={
                  <ProtectedRoute requiredUserType="inquilino">
                    <>
                      <AppSidebar />
                      <Inquilino />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/analista" element={
                  <ProtectedRoute requiredUserType="analista">
                    <>
                      <AppSidebar />
                      <Analista />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/juridico" element={
                  <ProtectedRoute requiredUserType="juridico">
                    <>
                      <AppSidebar />
                      <Juridico />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/sdr" element={
                  <ProtectedRoute requiredUserType="sdr">
                    <>
                      <AppSidebar />
                      <SDR />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/executivo" element={
                  <ProtectedRoute requiredUserType="executivo">
                    <>
                      <AppSidebar />
                      <Executivo />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/imobiliaria" element={
                  <ProtectedRoute requiredUserType="imobiliaria">
                    <>
                      <AppSidebar />
                      <ProfileCompletionCheck />
                      <Imobiliaria />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/financeiro" element={
                  <ProtectedRoute requiredUserType="financeiro">
                    <>
                      <AppSidebar />
                      <Financeiro />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/contratos" element={
                  <ProtectedRoute>
                    <>
                      <AppSidebar />
                      <Contratos />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/contratos-juridico" element={
                  <ProtectedRoute requiredUserType="juridico">
                    <>
                      <AppSidebar />
                      <ContratosJuridico />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/processos" element={
                  <ProtectedRoute requiredUserType="juridico">
                    <>
                      <AppSidebar />
                      <Processos />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/documentos" element={
                  <ProtectedRoute requiredUserType="juridico">
                    <>
                      <AppSidebar />
                      <Documentos />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/leads" element={
                  <ProtectedRoute requiredUserType="sdr">
                    <>
                      <AppSidebar />
                      <Leads />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/campanhas" element={
                  <ProtectedRoute requiredUserType="sdr">
                    <>
                      <AppSidebar />
                      <Campanhas />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/relatorios-sdr" element={
                  <ProtectedRoute requiredUserType="sdr">
                    <>
                      <AppSidebar />
                      <RelatoriosSDR />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/imobiliarias-executivo" element={
                  <ProtectedRoute requiredUserType="executivo">
                    <>
                      <AppSidebar />
                      <ImobiliariasExecutivo />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/propostas-executivo" element={
                  <ProtectedRoute requiredUserType="executivo">
                    <>
                      <AppSidebar />
                      <PropostasExecutivo />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/performance-executivo" element={
                  <ProtectedRoute requiredUserType="executivo">
                    <>
                      <AppSidebar />
                      <PerformanceExecutivo />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/inquilinos-imobiliaria" element={
                  <ProtectedRoute requiredUserType="imobiliaria">
                    <>
                      <AppSidebar />
                      <InquilinosImobiliaria />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/contratos-imobiliaria" element={
                  <ProtectedRoute requiredUserType="imobiliaria">
                    <>
                      <AppSidebar />
                      <ContratosImobiliaria />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/pagamentos-financeiro" element={
                  <ProtectedRoute requiredUserType="financeiro">
                    <>
                      <AppSidebar />
                      <PagamentosFinanceiro />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/inadimplencia-financeiro" element={
                  <ProtectedRoute requiredUserType="financeiro">
                    <>
                      <AppSidebar />
                      <InadimplenciaFinanceiro />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/relatorios-financeiro" element={
                  <ProtectedRoute requiredUserType="financeiro">
                    <>
                      <AppSidebar />
                      <RelatoriosFinanceiro />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/configuracoes-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <ConfiguracoesAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/configuracoes-analista" element={
                  <ProtectedRoute requiredUserType="analista">
                    <>
                      <AppSidebar />
                      <ConfiguracoesAnalista />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/configuracoes-juridico" element={
                  <ProtectedRoute requiredUserType="juridico">
                    <>
                      <AppSidebar />
                      <ConfiguracoesJuridico />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/configuracoes-executivo" element={
                  <ProtectedRoute requiredUserType="executivo">
                    <>
                      <AppSidebar />
                      <ConfiguracoesExecutivo />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/configuracoes-imobiliaria" element={
                  <ProtectedRoute requiredUserType="imobiliaria">
                    <>
                      <AppSidebar />
                      <ConfiguracoesImobiliaria />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/configuracoes-financeiro" element={
                  <ProtectedRoute requiredUserType="financeiro">
                    <>
                      <AppSidebar />
                      <ConfiguracoesFinanceiro />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/relatorios-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <RelatoriosAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/leads-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <LeadsAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/fiancas-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <FiancasAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/executivos-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <ExecutivosAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/imobiliarias-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <ImobiliariasAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/sinistros-admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <>
                      <AppSidebar />
                      <SinistrosAdmin />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/relatorios-analista" element={
                  <ProtectedRoute requiredUserType="analista">
                    <>
                      <AppSidebar />
                      <RelatoriosAnalista />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/pagamentos" element={
                  <ProtectedRoute requiredUserType="inquilino">
                    <>
                      <AppSidebar />
                      <Pagamentos />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/fiancas" element={
                  <ProtectedRoute requiredUserType="inquilino">
                    <>
                      <AppSidebar />
                      <Fiancas />
                    </>
                  </ProtectedRoute>
                } />
                
                <Route path="/fiancas-imobiliaria" element={
                  <ProtectedRoute requiredUserType="imobiliaria">
                    <>
                      <AppSidebar />
                      <ProfileCompletionCheck />
                      <FiancasImobiliaria />
                    </>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Toaster />
          </SidebarProvider>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

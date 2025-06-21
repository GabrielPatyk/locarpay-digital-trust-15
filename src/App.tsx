import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileCompletionCheck from '@/components/ProfileCompletionCheck';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
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
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={
                <ProtectedRoute requiredUserType="admin">
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute requiredUserType="admin">
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <Admin />
                </ProtectedRoute>
              } />

              <Route path="/inquilino" element={
                <ProtectedRoute requiredUserType="inquilino">
                  <Inquilino />
                </ProtectedRoute>
              } />

              <Route path="/analista" element={
                <ProtectedRoute requiredUserType="analista">
                  <Analista />
                </ProtectedRoute>
              } />

              <Route path="/juridico" element={
                <ProtectedRoute requiredUserType="juridico">
                  <Juridico />
                </ProtectedRoute>
              } />

              <Route path="/sdr" element={
                <ProtectedRoute requiredUserType="sdr">
                  <SDR />
                </ProtectedRoute>
              } />

              <Route path="/executivo" element={
                <ProtectedRoute requiredUserType="executivo">
                  <Executivo />
                </ProtectedRoute>
              } />

              <Route path="/imobiliaria" element={
                <ProtectedRoute requiredUserType="imobiliaria">
                  <>
                    <ProfileCompletionCheck />
                    <Imobiliaria />
                  </>
                </ProtectedRoute>
              } />

              <Route path="/financeiro" element={
                <ProtectedRoute requiredUserType="financeiro">
                  <Financeiro />
                </ProtectedRoute>
              } />

              <Route path="/contratos" element={
                <ProtectedRoute>
                  <Contratos />
                </ProtectedRoute>
              } />

              <Route path="/contratos-juridico" element={
                <ProtectedRoute requiredUserType="juridico">
                  <ContratosJuridico />
                </ProtectedRoute>
              } />

              <Route path="/processos" element={
                <ProtectedRoute requiredUserType="juridico">
                  <Processos />
                </ProtectedRoute>
              } />

              <Route path="/documentos" element={
                <ProtectedRoute requiredUserType="juridico">
                  <Documentos />
                </ProtectedRoute>
              } />

              <Route path="/leads" element={
                <ProtectedRoute requiredUserType="sdr">
                  <Leads />
                </ProtectedRoute>
              } />

              <Route path="/campanhas" element={
                <ProtectedRoute requiredUserType="sdr">
                  <Campanhas />
                </ProtectedRoute>
              } />

              <Route path="/relatorios-sdr" element={
                <ProtectedRoute requiredUserType="sdr">
                  <RelatoriosSDR />
                </ProtectedRoute>
              } />

              <Route path="/imobiliarias-executivo" element={
                <ProtectedRoute requiredUserType="executivo">
                  <ImobiliariasExecutivo />
                </ProtectedRoute>
              } />

              <Route path="/propostas-executivo" element={
                <ProtectedRoute requiredUserType="executivo">
                  <PropostasExecutivo />
                </ProtectedRoute>
              } />

              <Route path="/performance-executivo" element={
                <ProtectedRoute requiredUserType="executivo">
                  <PerformanceExecutivo />
                </ProtectedRoute>
              } />

              <Route path="/inquilinos-imobiliaria" element={
                <ProtectedRoute requiredUserType="imobiliaria">
                  <InquilinosImobiliaria />
                </ProtectedRoute>
              } />

              <Route path="/contratos-imobiliaria" element={
                <ProtectedRoute requiredUserType="imobiliaria">
                  <ContratosImobiliaria />
                </ProtectedRoute>
              } />

              <Route path="/pagamentos-financeiro" element={
                <ProtectedRoute requiredUserType="financeiro">
                  <PagamentosFinanceiro />
                </ProtectedRoute>
              } />

              <Route path="/inadimplencia-financeiro" element={
                <ProtectedRoute requiredUserType="financeiro">
                  <InadimplenciaFinanceiro />
                </ProtectedRoute>
              } />

              <Route path="/relatorios-financeiro" element={
                <ProtectedRoute requiredUserType="financeiro">
                  <RelatoriosFinanceiro />
                </ProtectedRoute>
              } />

              <Route path="/configuracoes-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <ConfiguracoesAdmin />
                </ProtectedRoute>
              } />

              <Route path="/configuracoes-analista" element={
                <ProtectedRoute requiredUserType="analista">
                  <ConfiguracoesAnalista />
                </ProtectedRoute>
              } />

              <Route path="/configuracoes-juridico" element={
                <ProtectedRoute requiredUserType="juridico">
                  <ConfiguracoesJuridico />
                </ProtectedRoute>
              } />

              <Route path="/configuracoes-executivo" element={
                <ProtectedRoute requiredUserType="executivo">
                  <ConfiguracoesExecutivo />
                </ProtectedRoute>
              } />

              <Route path="/configuracoes-imobiliaria" element={
                <ProtectedRoute requiredUserType="imobiliaria">
                  <ConfiguracoesImobiliaria />
                </ProtectedRoute>
              } />

              <Route path="/configuracoes-financeiro" element={
                <ProtectedRoute requiredUserType="financeiro">
                  <ConfiguracoesFinanceiro />
                </ProtectedRoute>
              } />

              <Route path="/relatorios-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <RelatoriosAdmin />
                </ProtectedRoute>
              } />

              <Route path="/leads-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <LeadsAdmin />
                </ProtectedRoute>
              } />

              <Route path="/fiancas-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <FiancasAdmin />
                </ProtectedRoute>
              } />

              <Route path="/executivos-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <ExecutivosAdmin />
                </ProtectedRoute>
              } />

              <Route path="/imobiliarias-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <ImobiliariasAdmin />
                </ProtectedRoute>
              } />

              <Route path="/sinistros-admin" element={
                <ProtectedRoute requiredUserType="admin">
                  <SinistrosAdmin />
                </ProtectedRoute>
              } />

              <Route path="/relatorios-analista" element={
                <ProtectedRoute requiredUserType="analista">
                  <RelatoriosAnalista />
                </ProtectedRoute>
              } />

              <Route path="/pagamentos" element={
                <ProtectedRoute requiredUserType="inquilino">
                  <Pagamentos />
                </ProtectedRoute>
              } />

              <Route path="/fiancas" element={
                <ProtectedRoute requiredUserType="inquilino">
                  <Fiancas />
                </ProtectedRoute>
              } />
              
              <Route path="/fiancas-imobiliaria" element={
                <ProtectedRoute requiredUserType="imobiliaria">
                  <>
                    <ProfileCompletionCheck />
                    <FiancasImobiliaria />
                  </>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

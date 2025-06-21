
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import all pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import Contratos from '@/pages/Contratos';
import Fiancas from '@/pages/Fiancas';
import Pagamentos from '@/pages/Pagamentos';
import Analista from '@/pages/Analista';
import Analises from '@/pages/Analises';
import Clientes from '@/pages/Clientes';
import RelatoriosAnalista from '@/pages/RelatoriosAnalista';
import ConfiguracoesAnalista from '@/pages/ConfiguracoesAnalista';
import Juridico from '@/pages/Juridico';
import ContratosJuridico from '@/pages/ContratosJuridico';
import Processos from '@/pages/Processos';
import Documentos from '@/pages/Documentos';
import ConfiguracoesJuridico from '@/pages/ConfiguracoesJuridico';
import SDR from '@/pages/SDR';
import Leads from '@/pages/Leads';
import Campanhas from '@/pages/Campanhas';
import RelatoriosSDR from '@/pages/RelatoriosSDR';
import Executivo from '@/pages/Executivo';
import ImobiliariasExecutivo from '@/pages/ImobiliariasExecutivo';
import PropostasExecutivo from '@/pages/PropostasExecutivo';
import PerformanceExecutivo from '@/pages/PerformanceExecutivo';
import ConfiguracoesExecutivo from '@/pages/ConfiguracoesExecutivo';
import Imobiliaria from '@/pages/Imobiliaria';
import InquilinosImobiliaria from '@/pages/InquilinosImobiliaria';
import ContratosImobiliaria from '@/pages/ContratosImobiliaria';
import ConfiguracoesImobiliaria from '@/pages/ConfiguracoesImobiliaria';
import Inquilino from '@/pages/Inquilino';
import Financeiro from '@/pages/Financeiro';
import PagamentosFinanceiro from '@/pages/PagamentosFinanceiro';
import InadimplenciaFinanceiro from '@/pages/InadimplenciaFinanceiro';
import RelatoriosFinanceiro from '@/pages/RelatoriosFinanceiro';
import ConfiguracoesFinanceiro from '@/pages/ConfiguracoesFinanceiro';
import FiancasAdmin from '@/pages/FiancasAdmin';
import ImobiliariasAdmin from '@/pages/ImobiliariasAdmin';
import ExecutivosAdmin from '@/pages/ExecutivosAdmin';
import SinistrosAdmin from '@/pages/SinistrosAdmin';
import LeadsAdmin from '@/pages/LeadsAdmin';
import RelatoriosAdmin from '@/pages/RelatoriosAdmin';
import ConfiguracoesAdmin from '@/pages/ConfiguracoesAdmin';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Dashboard Admin */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fiancas-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <FiancasAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/imobiliarias-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <ImobiliariasAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/executivos-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <ExecutivosAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contratos" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin', 'inquilino']}>
                    <Contratos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sinistros-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <SinistrosAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leads-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <LeadsAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/relatorios-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <RelatoriosAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes-admin" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <ConfiguracoesAdmin />
                  </ProtectedRoute>
                } 
              />

              {/* Analista Routes */}
              <Route 
                path="/analista" 
                element={
                  <ProtectedRoute allowedUserTypes={['analista']}>
                    <Analista />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analises" 
                element={
                  <ProtectedRoute allowedUserTypes={['analista']}>
                    <Analises />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clientes" 
                element={
                  <ProtectedRoute allowedUserTypes={['analista']}>
                    <Clientes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/relatorios-analista" 
                element={
                  <ProtectedRoute allowedUserTypes={['analista']}>
                    <RelatoriosAnalista />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes-analista" 
                element={
                  <ProtectedRoute allowedUserTypes={['analista']}>
                    <ConfiguracoesAnalista />
                  </ProtectedRoute>
                } 
              />

              {/* Jurídico Routes */}
              <Route 
                path="/juridico" 
                element={
                  <ProtectedRoute allowedUserTypes={['juridico']}>
                    <Juridico />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contratos-juridico" 
                element={
                  <ProtectedRoute allowedUserTypes={['juridico']}>
                    <ContratosJuridico />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/processos" 
                element={
                  <ProtectedRoute allowedUserTypes={['juridico']}>
                    <Processos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documentos" 
                element={
                  <ProtectedRoute allowedUserTypes={['juridico']}>
                    <Documentos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes-juridico" 
                element={
                  <ProtectedRoute allowedUserTypes={['juridico']}>
                    <ConfiguracoesJuridico />
                  </ProtectedRoute>
                } 
              />

              {/* SDR Routes */}
              <Route 
                path="/sdr" 
                element={
                  <ProtectedRoute allowedUserTypes={['sdr']}>
                    <SDR />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leads" 
                element={
                  <ProtectedRoute allowedUserTypes={['sdr']}>
                    <Leads />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/campanhas" 
                element={
                  <ProtectedRoute allowedUserTypes={['sdr']}>
                    <Campanhas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/relatorios-sdr" 
                element={
                  <ProtectedRoute allowedUserTypes={['sdr']}>
                    <RelatoriosSDR />
                  </ProtectedRoute>
                } 
              />

              {/* Executivo Routes */}
              <Route 
                path="/executivo" 
                element={
                  <ProtectedRoute allowedUserTypes={['executivo']}>
                    <Executivo />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/imobiliarias-executivo" 
                element={
                  <ProtectedRoute allowedUserTypes={['executivo']}>
                    <ImobiliariasExecutivo />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/propostas-executivo" 
                element={
                  <ProtectedRoute allowedUserTypes={['executivo']}>
                    <PropostasExecutivo />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/performance-executivo" 
                element={
                  <ProtectedRoute allowedUserTypes={['executivo']}>
                    <PerformanceExecutivo />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes-executivo" 
                element={
                  <ProtectedRoute allowedUserTypes={['executivo']}>
                    <ConfiguracoesExecutivo />
                  </ProtectedRoute>
                } 
              />

              {/* Imobiliária Routes */}
              <Route 
                path="/imobiliaria" 
                element={
                  <ProtectedRoute allowedUserTypes={['imobiliaria']}>
                    <Imobiliaria />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inquilinos-imobiliaria" 
                element={
                  <ProtectedRoute allowedUserTypes={['imobiliaria']}>
                    <InquilinosImobiliaria />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contratos-imobiliaria" 
                element={
                  <ProtectedRoute allowedUserTypes={['imobiliaria']}>
                    <ContratosImobiliaria />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes-imobiliaria" 
                element={
                  <ProtectedRoute allowedUserTypes={['imobiliaria']}>
                    <ConfiguracoesImobiliaria />
                  </ProtectedRoute>
                } 
              />

              {/* Inquilino Routes */}
              <Route 
                path="/inquilino" 
                element={
                  <ProtectedRoute allowedUserTypes={['inquilino']}>
                    <Inquilino />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fiancas" 
                element={
                  <ProtectedRoute allowedUserTypes={['inquilino']}>
                    <Fiancas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pagamentos" 
                element={
                  <ProtectedRoute allowedUserTypes={['inquilino']}>
                    <Pagamentos />
                  </ProtectedRoute>
                } 
              />

              {/* Financeiro Routes */}
              <Route 
                path="/financeiro" 
                element={
                  <ProtectedRoute allowedUserTypes={['financeiro']}>
                    <Financeiro />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pagamentos-financeiro" 
                element={
                  <ProtectedRoute allowedUserTypes={['financeiro']}>
                    <PagamentosFinanceiro />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inadimplencia-financeiro" 
                element={
                  <ProtectedRoute allowedUserTypes={['financeiro']}>
                    <InadimplenciaFinanceiro />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/relatorios-financeiro" 
                element={
                  <ProtectedRoute allowedUserTypes={['financeiro']}>
                    <RelatoriosFinanceiro />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes-financeiro" 
                element={
                  <ProtectedRoute allowedUserTypes={['financeiro']}>
                    <ConfiguracoesFinanceiro />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
        <Toaster />
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;

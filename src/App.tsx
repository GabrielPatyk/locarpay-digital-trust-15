
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import ForgotPassword from '@/pages/ForgotPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import Inquilino from '@/pages/Inquilino';
import Analista from '@/pages/Analista';
import Juridico from '@/pages/Juridico';
import SDR from '@/pages/SDR';
import Executivo from '@/pages/Executivo';
import Imobiliaria from '@/pages/Imobiliaria';
import Financeiro from '@/pages/Financeiro';
import Contratos from '@/pages/Contratos';
import Fiancas from '@/pages/Fiancas';
import Pagamentos from '@/pages/Pagamentos';
import Analises from '@/pages/Analises';
import Clientes from '@/pages/Clientes';
import RelatoriosAnalista from '@/pages/RelatoriosAnalista';
import ConfiguracoesAnalista from '@/pages/ConfiguracoesAnalista';
import ContratosJuridico from '@/pages/ContratosJuridico';
import Processos from '@/pages/Processos';
import Documentos from '@/pages/Documentos';
import ConfiguracoesJuridico from '@/pages/ConfiguracoesJuridico';
import Leads from '@/pages/Leads';
import Campanhas from '@/pages/Campanhas';
import RelatoriosSDR from '@/pages/RelatoriosSDR';
import ImobiliariasExecutivo from '@/pages/ImobiliariasExecutivo';
import PropostasExecutivo from '@/pages/PropostasExecutivo';
import PerformanceExecutivo from '@/pages/PerformanceExecutivo';
import ConfiguracoesExecutivo from '@/pages/ConfiguracoesExecutivo';
import InquilinosImobiliaria from '@/pages/InquilinosImobiliaria';
import ContratosImobiliaria from '@/pages/ContratosImobiliaria';
import ConfiguracoesImobiliaria from '@/pages/ConfiguracoesImobiliaria';
import FiancasImobiliaria from '@/pages/FiancasImobiliaria';
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
import ProfileCompletionCheck from '@/components/ProfileCompletionCheck';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <div className="min-h-screen flex w-full">
              <ProfileCompletionCheck />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Admin routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } />
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
                <Route path="/relatorios-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <RelatoriosAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ConfiguracoesAdmin />
                  </ProtectedRoute>
                } />

                {/* Inquilino routes */}
                <Route path="/inquilino" element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <Inquilino />
                  </ProtectedRoute>
                } />
                <Route path="/contratos" element={
                  <ProtectedRoute allowedRoles={['inquilino', 'admin']}>
                    <Contratos />
                  </ProtectedRoute>
                } />
                <Route path="/fiancas" element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <Fiancas />
                  </ProtectedRoute>
                } />
                <Route path="/pagamentos" element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <Pagamentos />
                  </ProtectedRoute>
                } />

                {/* Analista routes */}
                <Route path="/analista" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <Analista />
                  </ProtectedRoute>
                } />
                <Route path="/analises" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <Analises />
                  </ProtectedRoute>
                } />
                <Route path="/clientes" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <Clientes />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-analista" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <RelatoriosAnalista />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-analista" element={
                  <ProtectedRoute allowedRoles={['analista']}>
                    <ConfiguracoesAnalista />
                  </ProtectedRoute>
                } />

                {/* Juridico routes */}
                <Route path="/juridico" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <Juridico />
                  </ProtectedRoute>
                } />
                <Route path="/contratos-juridico" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ContratosJuridico />
                  </ProtectedRoute>
                } />
                <Route path="/processos" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <Processos />
                  </ProtectedRoute>
                } />
                <Route path="/documentos" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <Documentos />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-juridico" element={
                  <ProtectedRoute allowedRoles={['juridico']}>
                    <ConfiguracoesJuridico />
                  </ProtectedRoute>
                } />

                {/* SDR routes */}
                <Route path="/sdr" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <SDR />
                  </ProtectedRoute>
                } />
                <Route path="/leads" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <Leads />
                  </ProtectedRoute>
                } />
                <Route path="/campanhas" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <Campanhas />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-sdr" element={
                  <ProtectedRoute allowedRoles={['sdr']}>
                    <RelatoriosSDR />
                  </ProtectedRoute>
                } />

                {/* Executivo routes */}
                <Route path="/executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <Executivo />
                  </ProtectedRoute>
                } />
                <Route path="/imobiliarias-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ImobiliariasExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/propostas-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <PropostasExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/performance-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <PerformanceExecutivo />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-executivo" element={
                  <ProtectedRoute allowedRoles={['executivo']}>
                    <ConfiguracoesExecutivo />
                  </ProtectedRoute>
                } />

                {/* Imobiliaria routes */}
                <Route path="/imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <Imobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/fiancas-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <FiancasImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/inquilinos-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <InquilinosImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/contratos-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ContratosImobiliaria />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-imobiliaria" element={
                  <ProtectedRoute allowedRoles={['imobiliaria']}>
                    <ConfiguracoesImobiliaria />
                  </ProtectedRoute>
                } />

                {/* Financeiro routes */}
                <Route path="/financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <Financeiro />
                  </ProtectedRoute>
                } />
                <Route path="/pagamentos-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <PagamentosFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/inadimplencia-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <InadimplenciaFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/relatorios-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <RelatoriosFinanceiro />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes-financeiro" element={
                  <ProtectedRoute allowedRoles={['financeiro']}>
                    <ConfiguracoesFinanceiro />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

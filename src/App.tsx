
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Fiancas from "./pages/Fiancas";
import Contratos from "./pages/Contratos";
import Clientes from "./pages/Clientes";
import Analises from "./pages/Analises";
import Documentos from "./pages/Documentos";
import Campanhas from "./pages/Campanhas";
import Leads from "./pages/Leads";
import ConfiguracoesImobiliaria from "./pages/ConfiguracoesImobiliaria";
import Admin from "./pages/Admin";
import Analista from "./pages/Analista";
import Executivo from "./pages/Executivo";
import Financeiro from "./pages/Financeiro";
import Juridico from "./pages/Juridico";
import Imobiliaria from "./pages/Imobiliaria";
import Inquilino from "./pages/Inquilino";
import SDR from "./pages/SDR";
import ConfiguracoesAdmin from "./pages/ConfiguracoesAdmin";
import ConfiguracoesAnalista from "./pages/ConfiguracoesAnalista";
import ConfiguracoesExecutivo from "./pages/ConfiguracoesExecutivo";
import ConfiguracoesFinanceiro from "./pages/ConfiguracoesFinanceiro";
import ConfiguracoesJuridico from "./pages/ConfiguracoesJuridico";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Rotas protegidas por tipo de usuário */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
              <Route path="/configuracoes-admin" element={<ProtectedRoute allowedRoles={['admin']}><ConfiguracoesAdmin /></ProtectedRoute>} />
              <Route path="/fiancas-admin" element={<ProtectedRoute allowedRoles={['admin']}><FiancasAdmin /></ProtectedRoute>} />
              <Route path="/imobiliarias-admin" element={<ProtectedRoute allowedRoles={['admin']}><ImobiliariasAdmin /></ProtectedRoute>} />
              <Route path="/executivos-admin" element={<ProtectedRoute allowedRoles={['admin']}><ExecutivosAdmin /></ProtectedRoute>} />
              <Route path="/leads-admin" element={<ProtectedRoute allowedRoles={['admin']}><LeadsAdmin /></ProtectedRoute>} />
              <Route path="/relatorios-admin" element={<ProtectedRoute allowedRoles={['admin']}><RelatoriosAdmin /></ProtectedRoute>} />
              <Route path="/sinistros-admin" element={<ProtectedRoute allowedRoles={['admin']}><SinistrosAdmin /></ProtectedRoute>} />

              {/* Analista routes */}
              <Route path="/analista" element={<ProtectedRoute allowedRoles={['analista']}><Analista /></ProtectedRoute>} />
              <Route path="/configuracoes-analista" element={<ProtectedRoute allowedRoles={['analista']}><ConfiguracoesAnalista /></ProtectedRoute>} />
              <Route path="/relatorios-analista" element={<ProtectedRoute allowedRoles={['analista']}><RelatoriosAnalista /></ProtectedRoute>} />

              {/* Executivo routes */}
              <Route path="/executivo" element={<ProtectedRoute allowedRoles={['executivo']}><Executivo /></ProtectedRoute>} />
              <Route path="/configuracoes-executivo" element={<ProtectedRoute allowedRoles={['executivo']}><ConfiguracoesExecutivo /></ProtectedRoute>} />
              <Route path="/imobiliarias-executivo" element={<ProtectedRoute allowedRoles={['executivo']}><ImobiliariasExecutivo /></ProtectedRoute>} />
              <Route path="/propostas-executivo" element={<ProtectedRoute allowedRoles={['executivo']}><PropostasExecutivo /></ProtectedRoute>} />
              <Route path="/performance-executivo" element={<ProtectedRoute allowedRoles={['executivo']}><PerformanceExecutivo /></ProtectedRoute>} />

              {/* Financeiro routes */}
              <Route path="/financeiro" element={<ProtectedRoute allowedRoles={['financeiro']}><Financeiro /></ProtectedRoute>} />
              <Route path="/configuracoes-financeiro" element={<ProtectedRoute allowedRoles={['financeiro']}><ConfiguracoesFinanceiro /></ProtectedRoute>} />
              <Route path="/relatorios-financeiro" element={<ProtectedRoute allowedRoles={['financeiro']}><RelatoriosFinanceiro /></ProtectedRoute>} />
              <Route path="/pagamentos-financeiro" element={<ProtectedRoute allowedRoles={['financeiro']}><PagamentosFinanceiro /></ProtectedRoute>} />
              <Route path="/inadimplencia-financeiro" element={<ProtectedRoute allowedRoles={['financeiro']}><InadimplenciaFinanceiro /></ProtectedRoute>} />

              {/* Juridico routes */}
              <Route path="/juridico" element={<ProtectedRoute allowedRoles={['juridico']}><Juridico /></ProtectedRoute>} />
              <Route path="/configuracoes-juridico" element={<ProtectedRoute allowedRoles={['juridico']}><ConfiguracoesJuridico /></ProtectedRoute>} />
              <Route path="/contratos-juridico" element={<ProtectedRoute allowedRoles={['juridico']}><ContratosJuridico /></ProtectedRoute>} />
              <Route path="/processos" element={<ProtectedRoute allowedRoles={['juridico']}><Processos /></ProtectedRoute>} />

              {/* Imobiliária routes */}
              <Route path="/imobiliaria" element={<ProtectedRoute allowedRoles={['imobiliaria']}><Imobiliaria /></ProtectedRoute>} />
              <Route path="/configuracoes-imobiliaria" element={<ProtectedRoute allowedRoles={['imobiliaria']}><ConfiguracoesImobiliaria /></ProtectedRoute>} />
              <Route path="/fiancas-imobiliaria" element={<ProtectedRoute allowedRoles={['imobiliaria']}><FiancasImobiliaria /></ProtectedRoute>} />
              <Route path="/contratos-imobiliaria" element={<ProtectedRoute allowedRoles={['imobiliaria']}><ContratosImobiliaria /></ProtectedRoute>} />
              <Route path="/inquilinos-imobiliaria" element={<ProtectedRoute allowedRoles={['imobiliaria']}><InquilinosImobiliaria /></ProtectedRoute>} />

              {/* Inquilino routes */}
              <Route path="/inquilino" element={<ProtectedRoute allowedRoles={['inquilino']}><Inquilino /></ProtectedRoute>} />

              {/* SDR routes */}
              <Route path="/sdr" element={<ProtectedRoute allowedRoles={['sdr']}><SDR /></ProtectedRoute>} />
              <Route path="/relatorios-sdr" element={<ProtectedRoute allowedRoles={['sdr']}><RelatoriosSDR /></ProtectedRoute>} />

              {/* Shared routes */}
              <Route path="/fiancas" element={<ProtectedRoute><Fiancas /></ProtectedRoute>} />
              <Route path="/contratos" element={<ProtectedRoute><Contratos /></ProtectedRoute>} />
              <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
              <Route path="/analises" element={<ProtectedRoute><Analises /></ProtectedRoute>} />
              <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
              <Route path="/campanhas" element={<ProtectedRoute><Campanhas /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
              <Route path="/pagamentos" element={<ProtectedRoute><Pagamentos /></ProtectedRoute>} />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

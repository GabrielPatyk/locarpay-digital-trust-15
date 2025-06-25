
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import VerificarEmail from '@/pages/VerificarEmail';
import Imobiliaria from '@/pages/Imobiliaria';
import Inquilino from '@/pages/Inquilino';
import Analista from '@/pages/Analista';
import Financeiro from '@/pages/Financeiro';
import Admin from '@/pages/Admin';
import ConfiguracoesImobiliaria from '@/pages/ConfiguracoesImobiliaria';
import ConfiguracoesInquilino from '@/pages/ConfiguracoesInquilino';
import InquilinosImobiliaria from '@/pages/InquilinosImobiliaria';
import DetalheFianca from '@/pages/DetalheFianca';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<VerificarEmail />} />
              <Route path="/email-verification" element={<VerificarEmail />} />
              
              <Route path="/imobiliaria" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Imobiliaria />
                </ProtectedRoute>
              } />
              
              <Route path="/inquilino" element={
                <ProtectedRoute allowedRoles={['inquilino']}>
                  <Inquilino />
                </ProtectedRoute>
              } />
              
              <Route path="/analista" element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <Analista />
                </ProtectedRoute>
              } />
              
              <Route path="/financeiro" element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Financeiro />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } />
              
              <Route path="/configuracoes-imobiliaria" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <ConfiguracoesImobiliaria />
                </ProtectedRoute>
              } />
              
              <Route path="/configuracoes-inquilino" element={
                <ProtectedRoute allowedRoles={['inquilino']}>
                  <ConfiguracoesInquilino />
                </ProtectedRoute>
              } />
              
              <Route path="/inquilinos-imobiliaria" element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <InquilinosImobiliaria />
                </ProtectedRoute>
              } />
              
              <Route path="/detalhe-fianca/:id" element={
                <ProtectedRoute allowedRoles={['imobiliaria', 'analista', 'financeiro', 'admin']}>
                  <DetalheFianca />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

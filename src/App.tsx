
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Imobiliaria from '@/pages/Imobiliaria';
import Analista from '@/pages/Analista';
import Financeiro from '@/pages/Financeiro';
import Inquilino from '@/pages/Inquilino';
import Admin from '@/pages/Admin';
import ProtectedRoute from '@/components/ProtectedRoute';
import InquilinosImobiliaria from '@/pages/InquilinosImobiliaria';
import ConfiguracoesImobiliaria from '@/pages/ConfiguracoesImobiliaria';
import ConfiguracoesAnalista from '@/pages/ConfiguracoesAnalista';
import ConfiguracoesInquilino from '@/pages/ConfiguracoesInquilino';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/imobiliaria" 
              element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <Imobiliaria />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analista" 
              element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <Analista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/financeiro" 
              element={
                <ProtectedRoute allowedRoles={['financeiro']}>
                  <Financeiro />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inquilino" 
              element={
                <ProtectedRoute allowedRoles={['inquilino']}>
                  <Inquilino />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inquilinos-imobiliaria" 
              element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <InquilinosImobiliaria />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes-imobiliaria" 
              element={
                <ProtectedRoute allowedRoles={['imobiliaria']}>
                  <ConfiguracoesImobiliaria />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes-analista" 
              element={
                <ProtectedRoute allowedRoles={['analista']}>
                  <ConfiguracoesAnalista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes-inquilino" 
              element={
                <ProtectedRoute allowedRoles={['inquilino']}>
                  <ConfiguracoesInquilino />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

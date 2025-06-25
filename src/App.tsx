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
                <ProtectedRoute allowedTypes={['imobiliaria']}>
                  <Imobiliaria />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analista" 
              element={
                <ProtectedRoute allowedTypes={['analista']}>
                  <Analista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/financeiro" 
              element={
                <ProtectedRoute allowedTypes={['financeiro']}>
                  <Financeiro />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inquilino" 
              element={
                <ProtectedRoute allowedTypes={['inquilino']}>
                  <Inquilino />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedTypes={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inquilinos-imobiliaria" 
              element={
                <ProtectedRoute allowedTypes={['imobiliaria']}>
                  <InquilinosImobiliaria />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes-imobiliaria" 
              element={
                <ProtectedRoute allowedTypes={['imobiliaria']}>
                  <ConfiguracoesImobiliaria />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes-analista" 
              element={
                <ProtectedRoute allowedTypes={['analista']}>
                  <ConfiguracoesAnalista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes-inquilino" 
              element={
                <ProtectedRoute allowedTypes={['inquilino']}>
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

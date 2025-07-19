
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ImoveisImobiliaria from './pages/ImoveisImobiliaria';
import FiancasImobiliaria from './pages/FiancasImobiliaria';
import DetalheFianca from './pages/DetalheFianca';
import Clientes from './pages/Clientes';
import DetalheInquilino from '@/pages/DetalheInquilino';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/imoveis"
                element={
                  <ProtectedRoute>
                    <ImoveisImobiliaria />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fiancas"
                element={
                  <ProtectedRoute>
                    <FiancasImobiliaria />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/detalhe-fianca/:id"
                element={
                  <ProtectedRoute>
                    <DetalheFianca />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes"
                element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/detalhe-inquilino/:id"
                element={
                  <ProtectedRoute>
                    <DetalheInquilino />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default App;

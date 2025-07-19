
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
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
                path="/*"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <div className="flex min-h-screen w-full">
                        <AppSidebar />
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/imoveis" element={<ImoveisImobiliaria />} />
                          <Route path="/fiancas" element={<FiancasImobiliaria />} />
                          <Route path="/detalhe-fianca/:id" element={<DetalheFianca />} />
                          <Route path="/clientes" element={<Clientes />} />
                          <Route path="/detalhe-inquilino/:id" element={<DetalheInquilino />} />
                        </Routes>
                      </div>
                    </SidebarProvider>
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

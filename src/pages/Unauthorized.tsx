
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getUserDashboard = () => {
    if (!user) return '/login';
    
    switch (user.type) {
      case 'admin':
        return '/admin';
      case 'analista':
        return '/analista';
      case 'executivo':
        return '/executivo';
      case 'financeiro':
        return '/financeiro';
      case 'juridico':
        return '/juridico';
      case 'imobiliaria':
        return '/imobiliaria';
      case 'inquilino':
        return '/inquilino';
      case 'sdr':
        return '/sdr';
      default:
        return '/login';
    }
  };

  // Se o usuário não está logado, mostrar apenas botão para login
  if (!user) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(12, 28, 46, 0.95) 0%, rgba(12, 28, 46, 0.8) 100%), url("/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0C1C2E]">
              Acesso Negado
            </CardTitle>
            <CardDescription className="text-gray-600">
              Você precisa estar logado para acessar esta página
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Faça login para continuar navegando no sistema.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(12, 28, 46, 0.95) 0%, rgba(12, 28, 46, 0.8) 100%), url("/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#0C1C2E]">
            Acesso Negado
          </CardTitle>
          <CardDescription className="text-gray-600">
            Você não tem permissão para acessar esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Entre em contato com o administrador do sistema se você acredita que deveria ter acesso a esta área.
          </p>
          <div className="flex space-x-2">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button 
              onClick={() => navigate(getUserDashboard())}
              className="flex-1 bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-medium"
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;

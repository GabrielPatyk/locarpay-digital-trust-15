
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useContratoParceria } from '@/hooks/useContratoParceria';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileCheck } from 'lucide-react';

interface ImobiliariaAccessGuardProps {
  children: React.ReactNode;
}

const ImobiliariaAccessGuard: React.FC<ImobiliariaAccessGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const { precisaAssinarContrato, loading } = useContratoParceria();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user?.type === 'imobiliaria' && precisaAssinarContrato()) {
      // Se não estiver na página de configurações, redirecionar
      if (location.pathname !== '/configuracoes-imobiliaria') {
        navigate('/configuracoes-imobiliaria#contrato-parceria', { replace: true });
      }
    }
  }, [user, precisaAssinarContrato, loading, location.pathname, navigate]);

  // Se estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C]"></div>
      </div>
    );
  }

  // Se não for imobiliária, renderizar normalmente
  if (user?.type !== 'imobiliaria') {
    return <>{children}</>;
  }

  // Se precisa assinar contrato e não está na página de configurações
  if (precisaAssinarContrato() && location.pathname !== '/configuracoes-imobiliaria') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="flex items-center justify-center">
              <FileCheck className="mr-2 h-5 w-5" />
              Contrato de Parceria Necessário
            </CardTitle>
            <CardDescription>
              Para continuar usando a plataforma LocarPay, é necessário assinar o Contrato de Parceria. 
              Você será redirecionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirecionando para a página de configurações...
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#BC942C] mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se tudo estiver ok, renderizar os children
  return <>{children}</>;
};

export default ImobiliariaAccessGuard;

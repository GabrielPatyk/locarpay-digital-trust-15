
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useContratoParceria } from '@/hooks/useContratoParceria';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ImobiliariaAccessGuardProps {
  children: React.ReactNode;
}

const ImobiliariaAccessGuard: React.FC<ImobiliariaAccessGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { podeAcessarPlataforma, precisaAssinarContrato, isLoading } = useContratoParceria();

  useEffect(() => {
    if (user?.type === 'imobiliaria' && !isLoading) {
      if (precisaAssinarContrato() && !location.pathname.includes('/configuracoes-imobiliaria')) {
        // Redirecionar para a página de configurações com hash para verificações
        navigate('/configuracoes-imobiliaria#verificacoes-conta', { replace: true });
      }
    }
  }, [user, navigate, location.pathname, precisaAssinarContrato, isLoading]);

  // Se for imobiliária e precisar assinar contrato, mas não estiver na página de configurações
  if (user?.type === 'imobiliaria' && !isLoading && precisaAssinarContrato() && !location.pathname.includes('/configuracoes-imobiliaria')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contrato de Parceria Pendente</h2>
            <p className="text-gray-600 mb-4">
              Para continuar utilizando a LocarPay, é necessário assinar o Contrato de Parceria. 
              Você será redirecionado.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Para outros tipos de usuário ou se pode acessar, renderizar normalmente
  return <>{children}</>;
};

export default ImobiliariaAccessGuard;

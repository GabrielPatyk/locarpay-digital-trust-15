
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';

export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading, contratoPendente } = useAuth();
  const navigate = useNavigate();
  const { getCargoHomePage } = useCargoRedirect();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Se há contrato pendente, não redirecionar (o modal irá bloquear)
      if (contratoPendente && !contratoPendente.assinado) {
        return;
      }
      
      const redirectPath = getCargoHomePage();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, getCargoHomePage, contratoPendente]);

  return { isAuthenticated, isLoading };
};

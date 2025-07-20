
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';
import { useContratoParceria } from '@/hooks/useContratoParceria';

export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { getCargoHomePage } = useCargoRedirect();
  const { precisaAssinarContrato, loading: contratoLoading } = useContratoParceria();

  useEffect(() => {
    if (!isLoading && !contratoLoading && isAuthenticated && user) {
      // Se for imobiliária e precisa assinar contrato, vai para configurações
      if (user.type === 'imobiliaria' && precisaAssinarContrato()) {
        navigate('/configuracoes-imobiliaria#contrato-parceria', { replace: true });
      } else {
        // Caso contrário, vai para a página padrão do cargo
        const redirectPath = getCargoHomePage();
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, contratoLoading, navigate, getCargoHomePage, user, precisaAssinarContrato]);

  return { isAuthenticated, isLoading };
};

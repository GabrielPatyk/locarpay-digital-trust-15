
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';

export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading, user, contratoPendente } = useAuth();
  const navigate = useNavigate();
  const { getCargoHomePage } = useCargoRedirect();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // If user is imobiliaria and has a pending contract, don't redirect (the modal will block)
      if (user?.type === 'imobiliaria' && contratoPendente && !contratoPendente.assinado) {
        return;
      }
      
      const redirectPath = getCargoHomePage();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, getCargoHomePage, user, contratoPendente]);

  return { isAuthenticated, isLoading };
};

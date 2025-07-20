
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';

export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { getCargoHomePage } = useCargoRedirect();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectPath = getCargoHomePage();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, getCargoHomePage, user]);

  return { isAuthenticated, isLoading };
};

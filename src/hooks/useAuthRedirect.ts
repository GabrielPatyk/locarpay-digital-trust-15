
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';
import { useContratoParceria } from '@/hooks/useContratoParceria';

export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { getCargoHomePage } = useCargoRedirect();
  const { contrato, isLoading: contratoLoading } = useContratoParceria();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Se é imobiliária, verificar status do contrato antes do redirecionamento
      if (user.type === 'imobiliaria') {
        if (contratoLoading) return; // Aguardar carregar informações do contrato
        
        // Se não tem contrato ou está pendente, redirecionar para configurações
        if (!contrato || contrato.status_assinatura === 'pendente') {
          navigate('/configuracoes-imobiliaria', { replace: true });
          return;
        }
      }
      
      // Para outros tipos de usuário ou imobiliárias com contrato assinado
      const redirectPath = getCargoHomePage();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, getCargoHomePage, user, contrato, contratoLoading]);

  return { isAuthenticated, isLoading };
};

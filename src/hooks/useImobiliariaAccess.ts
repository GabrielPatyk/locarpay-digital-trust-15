
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useContratoParceria } from './useContratoParceria';

export const useImobiliariaAccess = () => {
  const { user } = useAuth();
  const { contrato, isLoading, criarContrato } = useContratoParceria();
  const navigate = useNavigate();
  const location = useLocation();

  const isBlocked = user?.type === 'imobiliaria' && (
    !contrato || contrato.status_assinatura === 'pendente'
  );

  const canAccess = user?.type === 'imobiliaria' && 
    contrato && 
    contrato.status_assinatura === 'assinado';

  useEffect(() => {
    if (!user || user.type !== 'imobiliaria' || isLoading) return;

    // Se não existe contrato, criar um novo
    if (!contrato) {
      criarContrato();
      return;
    }

    // Se o contrato está pendente e não está na página de configurações
    if (contrato.status_assinatura === 'pendente' && 
        location.pathname !== '/configuracoes-imobiliaria') {
      navigate('/configuracoes-imobiliaria', { replace: true });
    }
  }, [user, contrato, isLoading, location.pathname, navigate, criarContrato]);

  return {
    isBlocked,
    canAccess,
    contrato,
    isLoading
  };
};

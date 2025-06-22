
import { useAuth } from '@/contexts/AuthContext';

export const useCargoRedirect = () => {
  const { user } = useAuth();

  const getCargoHomePage = () => {
    if (!user) return '/dashboard';
    
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
        return '/dashboard';
    }
  };

  return { getCargoHomePage };
};

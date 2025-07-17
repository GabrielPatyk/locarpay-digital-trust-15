
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading, user, contratoPendente } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Se o usuário é imobiliária e tem contrato pendente, mostrar modal
    if (user?.type === 'imobiliaria' && contratoPendente && !contratoPendente.assinado) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-[#0C1C2E] mb-4">
              Bem-vindo à LOCARPAY
            </h1>
            <p className="text-gray-600 mb-4">
              Carregando contrato de parceria...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C] mx-auto"></div>
          </div>
        </div>
      );
    }
    
    // Define redirect path based on user type
    const redirectPaths: Record<string, string> = {
      inquilino: '/inquilino',
      imobiliaria: '/imobiliaria',
      analista: '/analista',
      juridico: '/juridico',
      sdr: '/sdr',
      executivo: '/executivo',
      financeiro: '/financeiro',
      admin: '/admin'
    };
    
    return <Navigate to={redirectPaths[user.type] || '/dashboard'} replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;

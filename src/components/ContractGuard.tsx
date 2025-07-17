
import { useAuth } from '@/contexts/AuthContext';
import ContractPendingModal from '@/components/ContractPendingModal';

interface ContractGuardProps {
  children: React.ReactNode;
}

const ContractGuard: React.FC<ContractGuardProps> = ({ children }) => {
  const { user, contratoPendente } = useAuth();

  // Verificar se é imobiliária com contrato pendente
  const hasContractPending = user?.type === 'imobiliaria' && 
    contratoPendente && 
    !contratoPendente.assinado;

  if (hasContractPending) {
    return (
      <>
        {/* Renderizar apenas o modal de contrato pendente */}
        <ContractPendingModal 
          isOpen={true} 
          contrato={contratoPendente} 
        />
        {/* Bloquear toda a interface renderizando uma div vazia */}
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Aguardando assinatura do contrato...</p>
          </div>
        </div>
      </>
    );
  }

  // Se não há contrato pendente, renderizar normalmente
  return <>{children}</>;
};

export default ContractGuard;

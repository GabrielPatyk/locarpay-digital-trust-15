
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContratosLocarpay } from '@/hooks/useContratosLocarpay';
import ContratoAssinaturaModal from './ContratoAssinaturaModal';

const ContratoChecker: React.FC = () => {
  const { user } = useAuth();
  const { contratoImobiliaria, isLoading } = useContratosLocarpay();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Só mostrar o modal se:
    // 1. O usuário é uma imobiliária
    // 2. Existe um contrato
    // 3. O contrato não foi assinado
    // 4. Não está carregando
    if (
      user?.type === 'imobiliaria' && 
      contratoImobiliaria && 
      !contratoImobiliaria.assinado && 
      !isLoading
    ) {
      setShowModal(true);
    }
  }, [user, contratoImobiliaria, isLoading]);

  const handleClose = () => {
    setShowModal(false);
  };

  // Só renderizar se for imobiliária
  if (user?.type !== 'imobiliaria') {
    return null;
  }

  return (
    <ContratoAssinaturaModal
      isOpen={showModal}
      contrato={contratoImobiliaria}
      onClose={handleClose}
    />
  );
};

export default ContratoChecker;

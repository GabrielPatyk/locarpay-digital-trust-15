
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useLocation } from 'react-router-dom';
import ProfileCompletionModal from './ProfileCompletionModal';

const ProfileCompletionCheck: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.type === 'imobiliaria' && location.pathname !== '/configuracoes-imobiliaria') {
      // Verificar se existe perfil da empresa e se os campos obrigatórios estão preenchidos
      if (!profile) {
        setShowModal(true);
        return;
      }

      const requiredFields = [
        profile.nome_empresa,
        profile.cnpj,
        profile.endereco,
        profile.numero,
        profile.bairro,
        profile.cidade,
        profile.estado
      ];

      const hasEmptyFields = requiredFields.some(field => !field || field.trim() === '');

      if (hasEmptyFields) {
        setShowModal(true);
      }
    }
  }, [user, profile, location.pathname]);

  if (!showModal) {
    return null;
  }

  return (
    <ProfileCompletionModal 
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    />
  );
};

export default ProfileCompletionCheck;

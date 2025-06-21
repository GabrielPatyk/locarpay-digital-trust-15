
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ProfileCompletionCheck: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.type === 'imobiliaria' && profile && location.pathname !== '/configuracoes-imobiliaria') {
      // Verificar se os campos obrigatórios estão preenchidos
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
        toast({
          title: "Perfil Incompleto",
          description: "Você precisa preencher todos os dados da empresa para continuar usando a plataforma.",
          variant: "destructive",
        });
        
        navigate('/configuracoes-imobiliaria');
      }
    }
  }, [user, profile, location.pathname, navigate, toast]);

  return null;
};

export default ProfileCompletionCheck;

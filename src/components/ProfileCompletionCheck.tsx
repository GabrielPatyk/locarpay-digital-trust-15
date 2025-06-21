
import React, { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ProfileCompletionCheck: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);

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
        setShowModal(true);
      }
    }
  }, [user, profile, location.pathname]);

  const handleGoToSettings = () => {
    setShowModal(false);
    navigate('/configuracoes-imobiliaria');
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Dados Cadastrais Pendentes
          </DialogTitle>
          <DialogDescription className="text-base">
            Para utilizar a plataforma, você precisa completar o cadastro da sua empresa com todas as informações obrigatórias.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Os seguintes dados são obrigatórios:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Nome da Empresa</li>
            <li>CNPJ</li>
            <li>Endereço completo</li>
            <li>Bairro, Cidade e Estado</li>
          </ul>
          <Button onClick={handleGoToSettings} className="w-full mt-4">
            Completar Cadastro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionCheck;


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
import { AlertCircle } from 'lucide-react';

const ProfileCompletionCheck: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

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
        setShowDialog(true);
      }
    }
  }, [user, profile, location.pathname]);

  const handleGoToSettings = () => {
    setShowDialog(false);
    navigate('/configuracoes-imobiliaria');
  };

  if (!showDialog) return null;

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-center">
            Dados Cadastrais Pendentes
          </DialogTitle>
          <DialogDescription className="text-center">
            Você precisa completar o cadastro da sua empresa para continuar usando a plataforma. 
            Por favor, preencha todos os dados obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleGoToSettings}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            Completar Cadastro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionCheck;

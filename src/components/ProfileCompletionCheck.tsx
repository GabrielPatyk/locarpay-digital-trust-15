
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

  const handleClose = () => {
    setShowModal(false);
    toast({
      title: "Atenção",
      description: "Você precisa completar o cadastro da empresa para usar todas as funcionalidades da plataforma.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={showModal} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cadastro Incompleto
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            Para utilizar a plataforma, é necessário completar o cadastro da sua empresa.
            Alguns dados obrigatórios ainda não foram preenchidos.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleGoToSettings} className="w-full">
            Completar Cadastro
          </Button>
          <Button variant="outline" onClick={handleClose} className="w-full">
            Lembrar Depois
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionCheck;

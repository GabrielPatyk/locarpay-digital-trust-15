
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings } from 'lucide-react';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();

  const handleGoToSettings = () => {
    navigate('/configuracoes-imobiliaria');
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={undefined}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Dados Cadastrais Pendentes
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Para continuar usando a plataforma, você precisa completar o cadastro da sua empresa.
            Alguns dados obrigatórios ainda não foram preenchidos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-4">
          <Button 
            onClick={handleGoToSettings}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Settings className="mr-2 h-4 w-4" />
            Ir para Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionModal;

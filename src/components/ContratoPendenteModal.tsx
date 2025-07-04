
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText } from 'lucide-react';

interface ContratoPendenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkAssinatura?: string | null;
}

const ContratoPendenteModal: React.FC<ContratoPendenteModalProps> = ({ 
  isOpen, 
  onClose, 
  linkAssinatura 
}) => {
  const handleAssinarContrato = () => {
    if (linkAssinatura) {
      window.open(linkAssinatura, '_blank');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Contrato de Parceria Pendente
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Sua imobiliária ainda não assinou o contrato de parceria com a LocarPay. 
            Para utilizar todos os recursos da plataforma, é necessário assinar o contrato.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          {linkAssinatura ? (
            <Button 
              onClick={handleAssinarContrato}
              className="bg-[#F4D573] text-[#0C1C2E] hover:bg-[#BC942C] hover:text-white font-semibold"
            >
              <FileText className="mr-2 h-4 w-4" />
              Assinar Contrato
            </Button>
          ) : (
            <div className="text-center text-sm text-gray-500">
              O link para assinatura será disponibilizado em breve.
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mt-2"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoPendenteModal;

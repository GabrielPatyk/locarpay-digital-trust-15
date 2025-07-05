
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ContratoAssinadoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContratoAssinadoModal: React.FC<ContratoAssinadoModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Contrato Assinado com Sucesso!
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Parabéns! O contrato de parceria com a LocarPay foi assinado com sucesso. 
            A plataforma foi liberada e você já pode utilizar todos os recursos disponíveis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onClose}
            className="bg-[#F4D573] text-[#0C1C2E] hover:bg-[#BC942C] hover:text-white font-semibold"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoAssinadoModal;

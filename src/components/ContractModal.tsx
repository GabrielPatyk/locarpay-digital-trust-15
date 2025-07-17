
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { User } from '@/types/user';

interface ContractModalProps {
  isOpen: boolean;
  user: User;
  onAccept: () => void;
  linkAssinatura?: string | null;
}

const ContractModal: React.FC<ContractModalProps> = ({ 
  isOpen, 
  user, 
  onAccept,
  linkAssinatura 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0C1C2E] text-center">
            CONTRATO DE PARCERIA E DISPONIBILIZAÇÃO DE PLATAFORMA ENTRE LOCARPAY E IMOBILIÁRIA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>A assinatura do contrato é obrigatória para o uso da plataforma.</strong><br />
              No momento, o contrato ainda <strong>não foi assinado</strong>. A plataforma permanecerá bloqueada até que a assinatura seja concluída.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col space-y-4">
            {linkAssinatura ? (
              <Button 
                onClick={onAccept}
                className="w-full bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-semibold"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Assinar Contrato
              </Button>
            ) : (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  <strong>Estamos validando suas informações.</strong><br />
                  O link de assinatura do contrato ainda não está disponível.<br />
                  Pedimos um prazo de até 2 horas para a geração do link, mas ele pode ser disponibilizado antes disso.<br />
                  Fique atento ao seu e-mail e também à plataforma para acompanhar a liberação.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;

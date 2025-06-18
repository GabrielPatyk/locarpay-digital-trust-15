
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';

interface SignatureModalProps {
  isOpen: boolean;
  user: User;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignatureProcess = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('https://esignatures.io/api/contracts?token=28e1b771-3f76-4c66-834c-43209ca93aaa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: '9c7a86e4-4e05-470f-9a3a-dc5c815f3df4',
          signers: [
            {
              name: user.name,
              email: user.email
            }
          ],
          redirect_url: 'https://locarpay.com.br/sucesso-assinatura'
        })
      });

      const data = await response.json();

      if (data?.contract?.url) {
        window.location.href = data.contract.url;
      } else {
        throw new Error('URL de assinatura não encontrada na resposta');
      }
    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      alert(`Erro ao processar assinatura: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md max-h-[90vh] p-0" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-[#0C1C2E]">
            Contrato de Parceria LOCARPAY
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Por favor, leia todo o contrato para continuar
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-4 border-t">
          <div className="flex justify-center">
            <Button
              onClick={handleSignatureProcess}
              disabled={isProcessing}
              className="bg-[#F4D573] text-[#0C1C2E] hover:bg-[#BC942C] hover:text-white font-semibold px-8 py-2"
            >
              {isProcessing ? 'Processando...' : 'Aceitar e Continuar com a Assinatura'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;


import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useEmailVerification } from '@/hooks/useEmailVerification';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
}) => {
  const { sendVerificationEmail, isLoading } = useEmailVerification();

  const handleResendEmail = async () => {
    const result = await sendVerificationEmail(userEmail, userName);
    if (result.success) {
      // Não fechar o modal automaticamente, deixar o usuário decidir
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <Mail className="h-5 w-5" />
            E-mail não verificado
          </DialogTitle>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p>
              Seu e-mail <strong>{userEmail}</strong> ainda não foi verificado.
            </p>
            <p>
              Para acessar a plataforma LocarPay, é necessário verificar seu e-mail primeiro.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-yellow-800">
                <strong>Verifique:</strong>
              </p>
              <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
                <li>Sua caixa de entrada</li>
                <li>Pasta de spam/lixo eletrônico</li>
                <li>Pasta de promoções (Gmail)</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-semibold"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Reenviar e-mail de verificação
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Tentar mais tarde
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;

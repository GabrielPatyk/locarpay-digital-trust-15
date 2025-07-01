import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, AlertTriangle } from 'lucide-react';
import { usePrimeiroAcesso } from '@/hooks/usePrimeiroAcesso';

interface PrimeiroAcessoModalProps {
  open: boolean;
}

const PrimeiroAcessoModal: React.FC<PrimeiroAcessoModalProps> = ({ open }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { disparaWebhookPrimeiroAcesso, marcarPrimeiroAcessoConcluido } = usePrimeiroAcesso();

  const handleEnviarEmail = async () => {
    setIsLoading(true);

    try {
      // Disparar webhook e gerar token
      await disparaWebhookPrimeiroAcesso();

      // Marcar primeiro acesso como concluído
      await marcarPrimeiroAcessoConcluido();

      toast({
        title: "E-mail enviado com sucesso!",
        description: "Verifique sua caixa de entrada para redefinir sua senha."
      });
      
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error);
      toast({
        title: "Erro ao enviar e-mail",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Primeiro Acesso - Redefinição Obrigatória
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Bem-vindo!</strong> Por segurança, é necessário redefinir sua senha no primeiro acesso.
              Clique no botão abaixo para receber um e-mail com instruções para redefinir sua senha.
            </p>
          </div>

          <Button
            onClick={handleEnviarEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Mail className="mr-2 h-4 w-4 animate-spin" />
                Enviando E-mail...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar E-mail de Redefinição
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrimeiroAcessoModal;
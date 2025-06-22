
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import { Loader2, LinkIcon, CreditCard, Clock, AlertCircle } from 'lucide-react';

interface AdicionarLinkPagamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiancaId: string;
  inquilinoNome: string;
  valorFianca: number;
}

const AdicionarLinkPagamentoModal = ({
  isOpen,
  onClose,
  fiancaId,
  inquilinoNome,
  valorFianca
}: AdicionarLinkPagamentoModalProps) => {
  const { toast } = useToast();
  const { anexarLinkPagamento, isAttachingLink } = useFinanceiro();
  
  const [linkPagamento, setLinkPagamento] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [prazoPagamento, setPrazoPagamento] = useState('');

  const handleSubmit = () => {
    if (!linkPagamento.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um link de pagamento válido.",
        variant: "destructive"
      });
      return;
    }

    if (!metodoPagamento.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o método de pagamento.",
        variant: "destructive"
      });
      return;
    }

    if (!prazoPagamento.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o prazo de pagamento.",
        variant: "destructive"
      });
      return;
    }

    anexarLinkPagamento.mutate({
      fiancaId,
      linkPagamento,
      metodoPagamento,
      prazoPagamento
    }, {
      onSuccess: () => {
        toast({
          title: "Link anexado com sucesso!",
          description: "Link de pagamento anexado e disponibilizado para o inquilino.",
        });
        setLinkPagamento('');
        setMetodoPagamento('');
        setPrazoPagamento('');
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Erro ao anexar link",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleClose = () => {
    setLinkPagamento('');
    setMetodoPagamento('');
    setPrazoPagamento('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-blue-600" />
            <span>Anexar Link de Pagamento</span>
          </DialogTitle>
          <DialogDescription>
            {inquilinoNome} - R$ {valorFianca.toLocaleString('pt-BR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="linkPagamento" className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4" />
              <span>Link de Pagamento do Banco *</span>
            </Label>
            <Input
              id="linkPagamento"
              placeholder="https://banco.com.br/pagamento/..."
              value={linkPagamento}
              onChange={(e) => setLinkPagamento(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Detalhes do Pagamento</span>
            </h4>
            
            <div>
              <Label htmlFor="metodoPagamento" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Método *</span>
              </Label>
              <Input
                id="metodoPagamento"
                placeholder="Ex: PIX, Transferência Bancária, Boleto..."
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prazoPagamento" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Prazo *</span>
              </Label>
              <Input
                id="prazoPagamento"
                placeholder="Ex: Até 2 dias úteis, 24 horas, Imediato..."
                value={prazoPagamento}
                onChange={(e) => setPrazoPagamento(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Situação:</span>
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Aguardando Link</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Atualizado em:</span>
                <div className="mt-1">
                  {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isAttachingLink}
            >
              {isAttachingLink ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Anexando...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Anexar Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isAttachingLink}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdicionarLinkPagamentoModal;

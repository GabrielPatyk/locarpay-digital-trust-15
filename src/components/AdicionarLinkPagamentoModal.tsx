
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdicionarLinkPagamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiancaId: string;
  onSuccess?: () => void;
}

const AdicionarLinkPagamentoModal: React.FC<AdicionarLinkPagamentoModalProps> = ({
  isOpen,
  onClose,
  fiancaId,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    link_pagamento: '',
    metodo_pagamento: '',
    prazo_pagamento: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          link_pagamento: formData.link_pagamento,
          metodo_pagamento: formData.metodo_pagamento,
          prazo_pagamento: formData.prazo_pagamento,
          situacao_pagamento: 'link_enviado',
          data_envio_link: new Date().toISOString(),
          data_atualizacao_pagamento: new Date().toISOString(),
          status_fianca: 'pagamento_disponivel'
        })
        .eq('id', fiancaId);

      if (error) throw error;

      toast({
        title: "Link de pagamento adicionado!",
        description: "O inquilino poderá acessar o link para realizar o pagamento.",
      });

      onSuccess?.();
      onClose();
      setFormData({
        link_pagamento: '',
        metodo_pagamento: '',
        prazo_pagamento: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar link de pagamento: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Link de Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="link_pagamento">Link de Pagamento *</Label>
            <Input
              id="link_pagamento"
              type="url"
              value={formData.link_pagamento}
              onChange={(e) => setFormData(prev => ({ ...prev, link_pagamento: e.target.value }))}
              placeholder="https://exemplo.com/pagamento"
              required
            />
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800">Detalhes do Pagamento</h4>
            
            <div>
              <Label htmlFor="metodo_pagamento">Método *</Label>
              <Select 
                value={formData.metodo_pagamento} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pagamento: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia_bancaria">Transferência Bancária</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="boleto">Boleto Bancário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prazo_pagamento">Prazo *</Label>
              <Select 
                value={formData.prazo_pagamento} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, prazo_pagamento: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_dia">Até 1 dia útil</SelectItem>
                  <SelectItem value="2_dias">Até 2 dias úteis</SelectItem>
                  <SelectItem value="3_dias">Até 3 dias úteis</SelectItem>
                  <SelectItem value="5_dias">Até 5 dias úteis</SelectItem>
                  <SelectItem value="7_dias">Até 7 dias úteis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Situação:</span> Link será enviado
              </div>
              <div>
                <span className="font-medium">Atualizado em:</span> {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.link_pagamento || !formData.metodo_pagamento || !formData.prazo_pagamento}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdicionarLinkPagamentoModal;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFiancas, FiancaFormData } from '@/hooks/useFiancas';

interface CriarFiancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

const CriarFiancaModal: React.FC<CriarFiancaModalProps> = ({ isOpen, onClose, refetch }) => {
  const { createFianca, isCreating } = useFiancas();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FiancaFormData>({
    nomeCompleto: '',
    cpf: '',
    email: '',
    whatsapp: '',
    rendaMensal: '',
    inquilinoEndereco: '',
    inquilinoNumero: '',
    inquilinoComplemento: '',
    inquilinoBairro: '',
    inquilinoCidade: '',
    inquilinoEstado: '',
    inquilinoPais: 'Brasil',
    tipoImovel: '',
    tipoLocacao: '',
    valorAluguel: '',
    descricaoImovel: '',
    areaMetros: '',
    tempoLocacao: '',
    imovelEndereco: '',
    imovelNumero: '',
    imovelComplemento: '',
    imovelBairro: '',
    imovelCidade: '',
    imovelEstado: '',
    imovelPais: 'Brasil'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createFianca(formData);
      toast({
        title: "Fiança criada com sucesso!",
        description: "A solicitação foi enviada para análise.",
      });
      refetch?.();
      onClose();
      setFormData({
        nomeCompleto: '',
        cpf: '',
        email: '',
        whatsapp: '',
        rendaMensal: '',
        inquilinoEndereco: '',
        inquilinoNumero: '',
        inquilinoComplemento: '',
        inquilinoBairro: '',
        inquilinoCidade: '',
        inquilinoEstado: '',
        inquilinoPais: 'Brasil',
        tipoImovel: '',
        tipoLocacao: '',
        valorAluguel: '',
        descricaoImovel: '',
        areaMetros: '',
        tempoLocacao: '',
        imovelEndereco: '',
        imovelNumero: '',
        imovelComplemento: '',
        imovelBairro: '',
        imovelCidade: '',
        imovelEstado: '',
        imovelPais: 'Brasil'
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao criar fiança: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Fiança</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Inquilino */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Inquilino</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rendaMensal">Renda Mensal *</Label>
                <Input
                  id="rendaMensal"
                  value={formData.rendaMensal}
                  onChange={(e) => setFormData({...formData, rendaMensal: e.target.value})}
                  placeholder="R$ 0,00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados do Imóvel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Imóvel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoImovel">Tipo de Imóvel *</Label>
                <Select value={formData.tipoImovel} onValueChange={(value) => setFormData({...formData, tipoImovel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valorAluguel">Valor do Aluguel *</Label>
                <Input
                  id="valorAluguel"
                  value={formData.valorAluguel}
                  onChange={(e) => setFormData({...formData, valorAluguel: e.target.value})}
                  placeholder="R$ 0,00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="imovelEndereco">Endereço *</Label>
                <Input
                  id="imovelEndereco"
                  value={formData.imovelEndereco}
                  onChange={(e) => setFormData({...formData, imovelEndereco: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imovelNumero">Número *</Label>
                <Input
                  id="imovelNumero"
                  value={formData.imovelNumero}
                  onChange={(e) => setFormData({...formData, imovelNumero: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imovelBairro">Bairro *</Label>
                <Input
                  id="imovelBairro"
                  value={formData.imovelBairro}
                  onChange={(e) => setFormData({...formData, imovelBairro: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imovelCidade">Cidade *</Label>
                <Input
                  id="imovelCidade"
                  value={formData.imovelCidade}
                  onChange={(e) => setFormData({...formData, imovelCidade: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Criando...' : 'Criar Fiança'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarFiancaModal;

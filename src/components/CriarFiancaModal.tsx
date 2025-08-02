
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFiancas, FiancaFormData } from '@/hooks/useFiancas';
import { useImobiliariaData } from '@/hooks/useImobiliariaData';

interface CriarFiancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

const CriarFiancaModal: React.FC<CriarFiancaModalProps> = ({ isOpen, onClose, refetch }) => {
  const { createFianca, isCreating } = useFiancas();
  const { cnpj } = useImobiliariaData();
  const { toast } = useToast();

  // Função para buscar endereço por CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }
        return data;
      } catch (error) {
        toast({
          title: "Erro",
          description: "CEP não encontrado ou inválido",
          variant: "destructive",
        });
        return null;
      }
    }
    return null;
  };

  // Função para formatar CEP
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };
  
  const [formData, setFormData] = useState<FiancaFormData>({
    nomeCompleto: '',
    cpf: '',
    email: '',
    whatsapp: '',
    rendaMensal: '',
    inquilinoCep: '',
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
    imovelCep: '',
    imovelEndereco: '',
    imovelNumero: '',
    imovelComplemento: '',
    imovelBairro: '',
    imovelCidade: '',
    imovelEstado: '',
    imovelPais: 'Brasil',
    cnpjImobiliaria: ''
  });

  const handleCepChange = async (field: 'inquilinoCep' | 'imovelCep', value: string) => {
    const formattedCep = formatCep(value);
    setFormData(prev => ({ ...prev, [field]: formattedCep }));

    // Se CEP está completo, buscar endereço
    if (formattedCep.replace(/\D/g, '').length === 8) {
      const endereco = await buscarEnderecoPorCep(formattedCep);
      if (endereco) {
        if (field === 'inquilinoCep') {
          setFormData(prev => ({
            ...prev,
            inquilinoEndereco: endereco.logradouro || '',
            inquilinoBairro: endereco.bairro || '',
            inquilinoCidade: endereco.localidade || '',
            inquilinoEstado: endereco.uf || ''
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            imovelEndereco: endereco.logradouro || '',
            imovelBairro: endereco.bairro || '',
            imovelCidade: endereco.localidade || '',
            imovelEstado: endereco.uf || ''
          }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar CEPs
    const inquilinoCepLimpo = formData.inquilinoCep.replace(/\D/g, '');
    const imovelCepLimpo = formData.imovelCep.replace(/\D/g, '');
    
    if (inquilinoCepLimpo.length !== 8) {
      toast({
        title: "Erro de validação",
        description: "CEP do inquilino deve ter 8 dígitos",
        variant: "destructive",
      });
      return;
    }
    
    if (imovelCepLimpo.length !== 8) {
      toast({
        title: "Erro de validação", 
        description: "CEP do imóvel deve ter 8 dígitos",
        variant: "destructive",
      });
      return;
    }
    
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
        inquilinoCep: '',
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
        imovelCep: '',
        imovelEndereco: '',
        imovelNumero: '',
        imovelComplemento: '',
        imovelBairro: '',
        imovelCidade: '',
        imovelEstado: '',
        imovelPais: 'Brasil',
        cnpjImobiliaria: ''
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
              <div>
                <Label htmlFor="inquilinoCep">CEP *</Label>
                <Input
                  id="inquilinoCep"
                  value={formData.inquilinoCep}
                  onChange={(e) => handleCepChange('inquilinoCep', e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnpjImobiliaria">CNPJ da Imobiliária</Label>
                <Input
                  id="cnpjImobiliaria"
                  value={formData.cnpjImobiliaria}
                  onChange={(e) => setFormData({...formData, cnpjImobiliaria: e.target.value})}
                  placeholder={cnpj || "00.000.000/0000-00"}
                />
              </div>
            </div>
            
            {/* Endereço do Inquilino */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inquilinoEndereco">Endereço *</Label>
                <Input
                  id="inquilinoEndereco"
                  value={formData.inquilinoEndereco}
                  onChange={(e) => setFormData({...formData, inquilinoEndereco: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="inquilinoNumero">Número *</Label>
                <Input
                  id="inquilinoNumero"
                  value={formData.inquilinoNumero}
                  onChange={(e) => setFormData({...formData, inquilinoNumero: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="inquilinoComplemento">Complemento</Label>
                <Input
                  id="inquilinoComplemento"
                  value={formData.inquilinoComplemento}
                  onChange={(e) => setFormData({...formData, inquilinoComplemento: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="inquilinoBairro">Bairro *</Label>
                <Input
                  id="inquilinoBairro"
                  value={formData.inquilinoBairro}
                  onChange={(e) => setFormData({...formData, inquilinoBairro: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="inquilinoCidade">Cidade *</Label>
                <Input
                  id="inquilinoCidade"
                  value={formData.inquilinoCidade}
                  onChange={(e) => setFormData({...formData, inquilinoCidade: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="inquilinoEstado">Estado *</Label>
                <Input
                  id="inquilinoEstado"
                  value={formData.inquilinoEstado}
                  onChange={(e) => setFormData({...formData, inquilinoEstado: e.target.value})}
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
                <Label htmlFor="imovelCep">CEP *</Label>
                <Input
                  id="imovelCep"
                  value={formData.imovelCep}
                  onChange={(e) => handleCepChange('imovelCep', e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
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
              <div>
                <Label htmlFor="imovelEstado">Estado *</Label>
                <Input
                  id="imovelEstado"
                  value={formData.imovelEstado}
                  onChange={(e) => setFormData({...formData, imovelEstado: e.target.value})}
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


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFiancas, FiancaFormData } from '@/hooks/useFiancas';
import { useImobiliariaData } from '@/hooks/useImobiliariaData';
import { useFormFormatters } from '@/hooks/useFormFormatters';
import { Loader2 } from 'lucide-react';

interface CriarFiancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
}

const CriarFiancaModal: React.FC<CriarFiancaModalProps> = ({ isOpen, onClose, refetch }) => {
  const { createFianca, isCreating } = useFiancas();
  const { cnpj } = useImobiliariaData();
  const { toast } = useToast();
  const {
    formatCPF,
    validateCPF,
    formatWhatsApp,
    formatCurrency,
    formatCEP,
    fetchAddressByCEP,
    parseCurrencyToNumber
  } = useFormFormatters();
  
  const [formData, setFormData] = useState<Omit<FiancaFormData, 'cnpjImobiliaria'>>({
    nomeCompleto: '',
    cpf: '',
    email: '',
    whatsapp: '+55 ',
    rendaMensal: 'R$ 0,00',
    inquilinoEndereco: '',
    inquilinoNumero: '',
    inquilinoComplemento: '',
    inquilinoBairro: '',
    inquilinoCidade: '',
    inquilinoEstado: '',
    inquilinoPais: 'Brasil',
    inquilinoCep: '',
    tipoImovel: '',
    tipoLocacao: '',
    valorAluguel: 'R$ 0,00',
    descricaoImovel: '',
    areaMetros: '',
    tempoLocacao: '',
    imovelEndereco: '',
    imovelNumero: '',
    imovelComplemento: '',
    imovelBairro: '',
    imovelCidade: '',
    imovelEstado: '',
    imovelPais: 'Brasil',
    imovelCep: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    handleInputChange('cpf', formatted);
  };

  const handleCPFBlur = () => {
    if (formData.cpf && !validateCPF(formData.cpf, () => handleInputChange('cpf', ''))) {
      // CPF is invalid, field will be cleared by the validator
    }
  };

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsApp(value);
    handleInputChange('whatsapp', formatted);
  };

  const handleCurrencyChange = (field: 'rendaMensal' | 'valorAluguel', value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange(field, formatted);
  };

  const handleCEPChange = (field: 'inquilinoCep' | 'imovelCep', value: string) => {
    const formatted = formatCEP(value);
    handleInputChange(field, formatted);
  };

  const handleCEPBlur = async (field: 'inquilinoCep' | 'imovelCep') => {
    const cepValue = formData[field];
    if (cepValue) {
      await fetchAddressByCEP(cepValue, (address) => {
        if (field === 'inquilinoCep') {
          setFormData(prev => ({
            ...prev,
            inquilinoEndereco: address.logradouro,
            inquilinoBairro: address.bairro,
            inquilinoCidade: address.cidade,
            inquilinoEstado: address.estado
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            imovelEndereco: address.logradouro,
            imovelBairro: address.bairro,
            imovelCidade: address.cidade,
            imovelEstado: address.estado
          }));
        }
      });
    }
  };

  const handleSubmitFianca = async () => {
    try {
      const fiancaData: FiancaFormData = {
        ...formData,
        cnpjImobiliaria: cnpj || ''
      };
      
      // Convert currency values to numbers
      const rendaMensalNumber = parseCurrencyToNumber(formData.rendaMensal);
      const valorAluguelNumber = parseCurrencyToNumber(formData.valorAluguel);
      
      await createFianca({
        ...fiancaData,
        rendaMensal: rendaMensalNumber.toString(),
        valorAluguel: valorAluguelNumber.toString()
      });
      
      toast({
        title: "Fiança criada com sucesso!",
        description: "A solicitação foi enviada para análise.",
      });
      
      refetch?.();
      onClose();
      
      // Reset form
      setFormData({
        nomeCompleto: '',
        cpf: '',
        email: '',
        whatsapp: '+55 ',
        rendaMensal: 'R$ 0,00',
        inquilinoEndereco: '',
        inquilinoNumero: '',
        inquilinoComplemento: '',
        inquilinoBairro: '',
        inquilinoCidade: '',
        inquilinoEstado: '',
        inquilinoPais: 'Brasil',
        inquilinoCep: '',
        tipoImovel: '',
        tipoLocacao: '',
        valorAluguel: 'R$ 0,00',
        descricaoImovel: '',
        areaMetros: '',
        tempoLocacao: '',
        imovelEndereco: '',
        imovelNumero: '',
        imovelComplemento: '',
        imovelBairro: '',
        imovelCidade: '',
        imovelEstado: '',
        imovelPais: 'Brasil',
        imovelCep: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao criar fiança: " + error.message,
        variant: "destructive",
      });
    }
  };

  const setIsDialogOpen = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Fiança</DialogTitle>
          <DialogDescription>
            Preencha todos os dados obrigatórios (*) para gerar a fiança
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="inquilino">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inquilino">Dados do Inquilino</TabsTrigger>
            <TabsTrigger value="imovel">Dados do Imóvel</TabsTrigger>
          </TabsList>

          {/* Aba do Inquilino */}
          <TabsContent value="inquilino" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seção 1 - Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="font-medium">Dados Pessoais</h3>
                <div>
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                    placeholder="João da Silva"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    onBlur={handleCPFBlur}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="joao@exemplo.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleWhatsAppChange(e.target.value)}
                    placeholder="+55 (11) 9 8765-4321"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rendaMensal">Renda Mensal *</Label>
                  <Input
                    id="rendaMensal"
                    value={formData.rendaMensal}
                    onChange={(e) => handleCurrencyChange('rendaMensal', e.target.value)}
                    placeholder="R$ 5.000,00"
                    required
                  />
                </div>
              </div>

              {/* Seção 2 - Endereço do Inquilino */}
              <div className="space-y-4">
                <h3 className="font-medium">Endereço do Inquilino</h3>
                <div>
                  <Label htmlFor="inquilinoCep">CEP *</Label>
                  <Input
                    id="inquilinoCep"
                    value={formData.inquilinoCep}
                    onChange={(e) => handleCEPChange('inquilinoCep', e.target.value)}
                    onBlur={() => handleCEPBlur('inquilinoCep')}
                    placeholder="00000-000"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="inquilinoEndereco">Endereço *</Label>
                    <Input
                      id="inquilinoEndereco"
                      value={formData.inquilinoEndereco}
                      onChange={(e) => handleInputChange('inquilinoEndereco', e.target.value)}
                      placeholder="Rua das Flores"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoNumero">Número *</Label>
                    <Input
                      id="inquilinoNumero"
                      value={formData.inquilinoNumero}
                      onChange={(e) => handleInputChange('inquilinoNumero', e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoComplemento">Complemento</Label>
                    <Input
                      id="inquilinoComplemento"
                      value={formData.inquilinoComplemento}
                      onChange={(e) => handleInputChange('inquilinoComplemento', e.target.value)}
                      placeholder="Apto 42"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoBairro">Bairro *</Label>
                    <Input
                      id="inquilinoBairro"
                      value={formData.inquilinoBairro}
                      onChange={(e) => handleInputChange('inquilinoBairro', e.target.value)}
                      placeholder="Centro"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoCidade">Cidade *</Label>
                    <Input
                      id="inquilinoCidade"
                      value={formData.inquilinoCidade}
                      onChange={(e) => handleInputChange('inquilinoCidade', e.target.value)}
                      placeholder="São Paulo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoEstado">Estado *</Label>
                    <Input
                      id="inquilinoEstado"
                      value={formData.inquilinoEstado}
                      onChange={(e) => handleInputChange('inquilinoEstado', e.target.value)}
                      placeholder="SP"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="inquilinoPais">País</Label>
                    <Input
                      id="inquilinoPais"
                      value={formData.inquilinoPais}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aba do Imóvel */}
          <TabsContent value="imovel" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seção 1 - Características do Imóvel */}
              <div className="space-y-4">
                <h3 className="font-medium">Características do Imóvel</h3>
                <div>
                  <Label htmlFor="tipoImovel">Tipo de Imóvel *</Label>
                  <Select 
                    value={formData.tipoImovel} 
                    onValueChange={(value) => handleInputChange('tipoImovel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="kitnet">Kitnet</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipoLocacao">Tipo de Locação *</Label>
                  <Select 
                    value={formData.tipoLocacao} 
                    onValueChange={(value) => handleInputChange('tipoLocacao', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="mista">Mista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="valorAluguel">Valor do Aluguel *</Label>
                  <Input
                    id="valorAluguel"
                    value={formData.valorAluguel}
                    onChange={(e) => handleCurrencyChange('valorAluguel', e.target.value)}
                    placeholder="R$ 2.500,00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="areaMetros">Área (m²)</Label>
                  <Input
                    id="areaMetros"
                    value={formData.areaMetros}
                    onChange={(e) => handleInputChange('areaMetros', e.target.value)}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="tempoLocacao">Tempo de Locação (meses) *</Label>
                  <Input
                    id="tempoLocacao"
                    value={formData.tempoLocacao}
                    onChange={(e) => handleInputChange('tempoLocacao', e.target.value)}
                    placeholder="12"
                    required
                  />
                </div>
              </div>

              {/* Seção 2 - Endereço do Imóvel e Descrição */}
              <div className="space-y-4">
                <h3 className="font-medium">Endereço do Imóvel</h3>
                <div>
                  <Label htmlFor="imovelCep">CEP *</Label>
                  <Input
                    id="imovelCep"
                    value={formData.imovelCep}
                    onChange={(e) => handleCEPChange('imovelCep', e.target.value)}
                    onBlur={() => handleCEPBlur('imovelCep')}
                    placeholder="00000-000"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="imovelEndereco">Endereço *</Label>
                    <Input
                      id="imovelEndereco"
                      value={formData.imovelEndereco}
                      onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                      placeholder="Av. Paulista"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imovelNumero">Número *</Label>
                    <Input
                      id="imovelNumero"
                      value={formData.imovelNumero}
                      onChange={(e) => handleInputChange('imovelNumero', e.target.value)}
                      placeholder="1000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imovelComplemento">Complemento</Label>
                    <Input
                      id="imovelComplemento"
                      value={formData.imovelComplemento}
                      onChange={(e) => handleInputChange('imovelComplemento', e.target.value)}
                      placeholder="Bloco B"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imovelBairro">Bairro *</Label>
                    <Input
                      id="imovelBairro"
                      value={formData.imovelBairro}
                      onChange={(e) => handleInputChange('imovelBairro', e.target.value)}
                      placeholder="Bela Vista"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imovelCidade">Cidade *</Label>
                    <Input
                      id="imovelCidade"
                      value={formData.imovelCidade}
                      onChange={(e) => handleInputChange('imovelCidade', e.target.value)}
                      placeholder="São Paulo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imovelEstado">Estado *</Label>
                    <Input
                      id="imovelEstado"
                      value={formData.imovelEstado}
                      onChange={(e) => handleInputChange('imovelEstado', e.target.value)}
                      placeholder="SP"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricaoImovel">Descrição do Imóvel</Label>
                  <Textarea
                    id="descricaoImovel"
                    value={formData.descricaoImovel}
                    onChange={(e) => handleInputChange('descricaoImovel', e.target.value)}
                    placeholder="Descreva características importantes do imóvel..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitFianca}
            disabled={isCreating}
            className="bg-primary hover:bg-primary/90"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : 'Salvar Fiança'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CriarFiancaModal;

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useFiancas, type FiancaFormData } from '@/hooks/useFiancas';
import { validateFiancaForm, formatCurrency } from '@/components/FiancaFormValidation';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import RejectedFiancaTooltip from '@/components/RejectedFiancaTooltip';
import ApprovedFiancaTooltip from '@/components/ApprovedFiancaTooltip';
import AguardandoPagamentoTooltip from '@/components/AguardandoPagamentoTooltip';
import EmAnaliseTooltip from '@/components/EmAnaliseTooltip';
import PagamentoConfirmadoTooltip from '@/components/PagamentoConfirmadoTooltip';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Building,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Loader2
} from 'lucide-react';


async function buscarEnderecoPorCep(cep: string) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (data.erro) throw new Error('CEP não encontrado');
  return data;
}

const FiancasImobiliaria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { formatPhone } = usePhoneFormatter();
  const { fiancas, isLoading, createFianca, isCreating, acceptFianca, isAccepting, getFiancasStats } = useFiancas();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estado do formulário
  const [formData, setFormData] = useState<FiancaFormData>({
    // Dados do Inquilino
    nomeCompleto: '',
    cpf: '',
    email: '',
    whatsapp: '+55',
    rendaMensal: '',
    inquilinoCep: '',
    // Endereço do Inquilino
    inquilinoEndereco: '',
    inquilinoNumero: '',
    inquilinoComplemento: '',
    inquilinoBairro: '',
    inquilinoCidade: '',
    inquilinoEstado: '',
    inquilinoPais: 'Brasil',
    // Dados do Imóvel
    tipoImovel: '',
    tipoLocacao: '',
    valorAluguel: '',
    descricaoImovel: '',
    areaMetros: '',
    tempoLocacao: '',
    imovelCep: '',
    // Endereço do Imóvel
    imovelEndereco: '',
    imovelNumero: '',
    imovelComplemento: '',
    imovelBairro: '',
    imovelCidade: '',
    imovelEstado: '',
    imovelPais: 'Brasil',
    // CNPJ da Imobiliária
    cnpjImobiliaria: ''
  });

  const dashboardData = getFiancasStats();

  const handleInputChange = (field: keyof FiancaFormData, value: string) => {
    if (field === 'whatsapp') {
      setFormData(prev => ({
        ...prev,
        [field]: formatPhone(value)
      }));
    } else if (field === 'cpf') {
      // Formatar CPF
      const numbers = value.replace(/\D/g, '');
      let formatted = numbers;
      if (numbers.length > 3) formatted = numbers.slice(0, 3) + '.' + numbers.slice(3);
      if (numbers.length > 6) formatted = numbers.slice(0, 3) + '.' + numbers.slice(3, 6) + '.' + numbers.slice(6);
      if (numbers.length > 9) formatted = numbers.slice(0, 3) + '.' + numbers.slice(3, 6) + '.' + numbers.slice(6, 9) + '-' + numbers.slice(9, 11);
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }));
    } else if (field === 'rendaMensal' || field === 'valorAluguel') {
      // Formatar valores monetários
      const formatted = formatCurrency(value);
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmitFianca = async () => {
    const errors = validateFiancaForm(formData);

    if (errors.length > 0) {
      toast({
        title: "Erro na validação",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    try {
      await createFianca(formData);
      
      toast({
        title: "Sucesso!",
        description: "Fiança criada com sucesso.",
      });
      
      setIsDialogOpen(false);
      // Reset form
      setFormData({
        nomeCompleto: '',
        cpf: '',
        email: '',
        whatsapp: '+55',
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
        title: "Erro ao criar fiança",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAcceptFianca = (fiancaId: string) => {
    acceptFianca.mutate(fiancaId, {
      onSuccess: () => {
        toast({
          title: "Fiança aceita com sucesso!",
          description: "A fiança foi enviada ao financeiro.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao aceitar fiança",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'em_analise': 'bg-blue-500',
      'aprovada':  'bg-green-500', 
      'rejeitada': 'bg-red-500',
      'ativa': 'bg-green-500',
      'vencida': 'bg-red-500',
      'cancelada': 'bg-gray-500',
      'enviada_ao_financeiro': 'bg-green-500',
      'aguardando_geracao_pagamento': 'bg-yellow-500',
      'pagamento_disponivel': 'bg-yellow-500',
      'comprovante_enviado': 'bg-blue-500',
      'pagamento_confirmado': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'em_analise': 'Em Análise',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada', 
      'ativa': 'Ativa',
      'vencida': 'Vencida',
      'cancelada': 'Cancelada',
      'enviada_ao_financeiro': 'Enviada ao Financeiro',
      'aguardando_geracao_pagamento': 'Aguardando Pagamento',
      'pagamento_disponivel': 'Aguardando Pagamento',
      'comprovante_enviado': 'Comprovante Enviado',
      'pagamento_confirmado': 'Pagamento Confirmado'
    };
    return labels[status] || status;
  };

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = fianca.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${fianca.imovel_endereco}, ${fianca.imovel_numero}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || fianca.status_fianca === statusFilter;
    
    // Filtro de data
    let matchesDate = true;
    if (startDate || endDate) {
      const fiancaDate = new Date(fianca.data_criacao).toISOString().split('T')[0];
      if (startDate && fiancaDate < startDate) matchesDate = false;
      if (endDate && fiancaDate > endDate) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getDashboardStats = () => {
    const totalFiancas = filteredFiancas.length;
    const fiancasPendentes = filteredFiancas.filter(f => f.status_fianca === 'em_analise').length;
    const fiancasAtivas = filteredFiancas.filter(f => f.status_fianca === 'ativa').length;
    const fiancasVencidas = filteredFiancas.filter(f => f.status_fianca === 'vencida').length;
    const fiancasRejeitadas = filteredFiancas.filter(f => f.status_fianca === 'rejeitada').length;

    return {
      totalFiancas,
      fiancasPendentes,
      fiancasAtivas,
      fiancasVencidas,
      fiancasRejeitadas
    };
  };

  const stats = getDashboardStats();

  const handleViewFianca = (fiancaId: string) => {
    navigate(`/detalhe-fianca/${fiancaId}`);
  };

  const applyDateFilter = () => {
    // Força uma re-renderização para aplicar os filtros
    setSearchTerm(searchTerm);
  };

  if (isLoading) {
    return (
      <Layout title="Fianças">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Fianças">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-4 sm:p-6 text-[#0C1C2E]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Gestão de Fianças</h1>
              <p className="opacity-90 text-sm sm:text-base">Gerencie e acompanhe todas as suas fianças</p>
            </div>
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 opacity-50" />
          </div>
        </div>

        {/* Filtros de Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Filtros por Período
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={applyDateFilter}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total de Fianças</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl xl:text-2xl font-bold text-primary">{stats.totalFiancas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Fianças Pendentes</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl xl:text-2xl font-bold text-warning">{stats.fiancasPendentes}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Fianças Ativas</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl xl:text-2xl font-bold text-success">{stats.fiancasAtivas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Fianças Vencidas</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl xl:text-2xl font-bold text-destructive">{stats.fiancasVencidas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Fianças Rejeitadas</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-lg sm:text-xl xl:text-2xl font-bold text-red-500">{stats.fiancasRejeitadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ações e Lista de Fianças */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle className="text-base sm:text-lg">Lista de Fianças</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Gerar Fiança
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle>Nova Fiança</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do inquilino e do imóvel para gerar uma nova fiança
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="inquilino" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="inquilino">Dados do Inquilino</TabsTrigger>
                      <TabsTrigger value="imovel">Dados do Imóvel</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="inquilino" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                          <Input
                            id="nomeCompleto"
                            value={formData.nomeCompleto}
                            onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                            placeholder="Nome completo do inquilino"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input
                            id="cpf"
                            value={formData.cpf}
                            onChange={(e) => handleInputChange('cpf', e.target.value)}
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
                            placeholder="email@exemplo.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">WhatsApp *</Label>
                          <Input
                            id="whatsapp"
                            value={formData.whatsapp}
                            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                            placeholder="+55 (11) 9 9999-9999"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="rendaMensal">Renda Mensal *</Label>
                          <Input
                            id="rendaMensal"
                            value={formData.rendaMensal}
                            onChange={(e) => handleInputChange('rendaMensal', e.target.value)}
                            placeholder="R$ 5.000,00"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Endereço do Inquilino */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Endereço do Inquilino</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="inquilinoCep">CEP *</Label>
                            <Input
                              id="inquilinoCep"
                              value={formData.inquilinoCep}
                              onChange={async (e) => {
                                const cep = e.target.value.replace(/\D/g, '');
                                setFormData((prev) => ({ ...prev, inquilinoCep: cep }));
                                if (cep.length === 8) {
                                  try {
                                    const data = await buscarEnderecoPorCep(cep);
                                    setFormData((prev) => ({
                                      ...prev,
                                      inquilinoEndereco: data.logradouro || '',
                                      inquilinoBairro: data.bairro || '',
                                      inquilinoCidade: data.localidade || '',
                                      inquilinoEstado: data.uf || '',
                                      inquilinoCep: cep,
                                    }));
                                  } catch {
                                    // opcional: mostrar erro de CEP inválido
                                  }
                                }
                              }}
                              placeholder="00000000"
                              required
                              maxLength={8}
                            />
                          </div>
                          <div className="md:col-span-2 flex gap-4">
                            <div className="flex-1">
                              <Label htmlFor="inquilinoEndereco">Endereço *</Label>
                              <Input
                                id="inquilinoEndereco"
                                value={formData.inquilinoEndereco}
                                onChange={(e) => handleInputChange('inquilinoEndereco', e.target.value)}
                                placeholder="Rua, Avenida, etc."
                                required
                              />
                            </div>
                            <div style={{ minWidth: 90 }}>
                              <Label htmlFor="inquilinoNumero">Número *</Label>
                              <Input
                                id="inquilinoNumero"
                                value={formData.inquilinoNumero}
                                onChange={(e) => handleInputChange('inquilinoNumero', e.target.value)}
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="inquilinoComplemento">Complemento</Label>
                          <Input
                            id="inquilinoComplemento"
                            value={formData.inquilinoComplemento}
                            onChange={(e) => handleInputChange('inquilinoComplemento', e.target.value)}
                            placeholder="Apto, Sala, etc."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </div>
                        
                        <div>
                          <Label htmlFor="inquilinoPais">País</Label>
                          <Input
                            id="inquilinoPais"
                            value={formData.inquilinoPais}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="imovel" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tipoImovel">Tipo de Imóvel *</Label>
                          <Select value={formData.tipoImovel} onValueChange={(value) => handleInputChange('tipoImovel', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casa">Casa</SelectItem>
                              <SelectItem value="apartamento">Apartamento</SelectItem>
                              <SelectItem value="kitnet">Kitnet</SelectItem>
                              <SelectItem value="sobrado">Sobrado</SelectItem>
                              <SelectItem value="chacara">Chácara</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tipoLocacao">Tipo de Locação *</Label>
                          <Select value={formData.tipoLocacao} onValueChange={(value) => handleInputChange('tipoLocacao', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residencial">Residencial</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                              <SelectItem value="misto">Misto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="valorAluguel">Valor do Aluguel Mensal *</Label>
                          <Input
                            id="valorAluguel"
                            value={formData.valorAluguel}
                            onChange={(e) => handleInputChange('valorAluguel', e.target.value)}
                            placeholder="R$ 2.500,00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="areaMetros">Área em m²</Label>
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
                            placeholder="24"
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
                          placeholder="3 quartos, 2 banheiros, área externa, garagem..."
                          rows={3}
                        />
                      </div>
                      
                      {/* Endereço do Imóvel */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Endereço do Imóvel</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="imovelCep">CEP *</Label>
                            <Input
                              id="imovelCep"
                              value={formData.imovelCep}
                              onChange={async (e) => {
                                const cep = e.target.value.replace(/\D/g, '');
                                setFormData((prev) => ({ ...prev, imovelCep: cep }));
                                if (cep.length === 8) {
                                  try {
                                    const data = await buscarEnderecoPorCep(cep);
                                    setFormData((prev) => ({
                                      ...prev,
                                      imovelEndereco: data.logradouro || '',
                                      imovelBairro: data.bairro || '',
                                      imovelCidade: data.localidade || '',
                                      imovelEstado: data.uf || '',
                                      imovelCep: cep,
                                    }));
                                  } catch {
                                    // opcional: mostrar erro de CEP inválido
                                  }
                                }
                              }}
                              placeholder="00000000"
                              required
                              maxLength={8}
                            />
                          </div>
                          <div className="md:col-span-2 flex gap-4">
                            <div className="flex-1">
                              <Label htmlFor="imovelEndereco">Endereço *</Label>
                              <Input
                                id="imovelEndereco"
                                value={formData.imovelEndereco}
                                onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                                placeholder="Rua, Avenida, etc."
                                required
                              />
                            </div>
                            <div style={{ minWidth: 90 }}>
                              <Label htmlFor="imovelNumero">Número *</Label>
                              <Input
                                id="imovelNumero"
                                value={formData.imovelNumero}
                                onChange={(e) => handleInputChange('imovelNumero', e.target.value)}
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="imovelComplemento">Complemento</Label>
                          <Input
                            id="imovelComplemento"
                            value={formData.imovelComplemento}
                            onChange={(e) => handleInputChange('imovelComplemento', e.target.value)}
                            placeholder="Apto, Sala, etc."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="imovelBairro">Bairro *</Label>
                            <Input
                              id="imovelBairro"
                              value={formData.imovelBairro}
                              onChange={(e) => handleInputChange('imovelBairro', e.target.value)}
                              placeholder="Centro"
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
                          <Label htmlFor="imovelPais">País</Label>
                          <Input
                            id="imovelPais"
                            value={formData.imovelPais}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSubmitFianca} 
                      className="bg-primary hover:bg-primary/90"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        'Gerar Fiança'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por inquilino ou imóvel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovada">Aprovadas</SelectItem>
                  <SelectItem value="ativa">Ativas</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                  <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                  <SelectItem value="enviada_ao_financeiro">Enviada ao Financeiro</SelectItem>
                  <SelectItem value="pagamento_disponivel">Aguardando Pagamento</SelectItem>
                  <SelectItem value="comprovante_enviado">Comprovante Enviado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista responsiva para dispositivos móveis */}
            <div className="block lg:hidden space-y-4">
              {filteredFiancas.map((fianca) => (
                <Card key={fianca.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{fianca.inquilino_nome_completo}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {`${fianca.imovel_endereco}, ${fianca.imovel_numero}`}
                        </p>
                        <p className="text-xs text-gray-600">{fianca.imovel_bairro}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-gray-600">{new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex-1">
                        {fianca.status_fianca === 'rejeitada' ? (
                          <RejectedFiancaTooltip
                            rejectionReason={fianca.motivo_reprovacao || 'Não informado'}
                            rejectionDate={fianca.data_analise || fianca.data_atualizacao}
                            score={fianca.score_credito}
                            analystName="Analista Responsável"
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help text-xs`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </RejectedFiancaTooltip>
                        ) : fianca.status_fianca === 'aprovada' ? (
                          <ApprovedFiancaTooltip
                            approvalDate={fianca.data_analise || fianca.data_atualizacao}
                            score={fianca.score_credito}
                            rate={fianca.taxa_aplicada}
                            analystName="Analista Responsável"
                            observations={fianca.observacoes_aprovacao}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help text-xs`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </ApprovedFiancaTooltip>
                        ) : fianca.status_fianca === 'pagamento_disponivel' ? (
                          <AguardandoPagamentoTooltip
                            valorFianca={fianca.imovel_valor_aluguel}
                            nomeInquilino={fianca.inquilino_nome_completo}
                            dataEnvio={fianca.data_atualizacao}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help text-xs`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </AguardandoPagamentoTooltip>
                        ) : fianca.status_fianca === 'em_analise' ? (
                          <EmAnaliseTooltip
                            dataCriacao={fianca.data_criacao}
                            nomeInquilino={fianca.inquilino_nome_completo}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help text-xs`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </EmAnaliseTooltip>
                        ) : fianca.status_fianca === 'pagamento_confirmado' ? (
                          <PagamentoConfirmadoTooltip
                            dataConfirmacao={fianca.data_atualizacao}
                            valorFianca={fianca.imovel_valor_aluguel}
                            nomeInquilino={fianca.inquilino_nome_completo}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help text-xs`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </PagamentoConfirmadoTooltip>
                        ) : (
                          <Badge className={`${getStatusColor(fianca.status_fianca)} text-white text-xs`}>
                            {getStatusLabel(fianca.status_fianca)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewFianca(fianca.id)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {fianca.status_fianca === 'aprovada' && (
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                            onClick={() => handleAcceptFianca(fianca.id)}
                            disabled={isAccepting}
                          >
                            {isAccepting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Aceitar'
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Tabela para desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Inquilino</TableHead>
                    <TableHead className="min-w-[250px]">Imóvel</TableHead>
                    <TableHead className="min-w-[120px]">Valor</TableHead>
                    <TableHead className="min-w-[150px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Data Criação</TableHead>
                    <TableHead className="min-w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiancas.map((fianca) => (
                    <TableRow key={fianca.id}>
                      <TableCell className="font-medium">{fianca.inquilino_nome_completo}</TableCell>
                      <TableCell>{`${fianca.imovel_endereco}, ${fianca.imovel_numero} - ${fianca.imovel_bairro}`}</TableCell>
                      <TableCell>R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        {fianca.status_fianca === 'rejeitada' ? (
                          <RejectedFiancaTooltip
                            rejectionReason={fianca.motivo_reprovacao || 'Não informado'}
                            rejectionDate={fianca.data_analise || fianca.data_atualizacao}
                            score={fianca.score_credito}
                            analystName="Analista Responsável"
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </RejectedFiancaTooltip>
                        ) : fianca.status_fianca === 'aprovada' ? (
                          <ApprovedFiancaTooltip
                            approvalDate={fianca.data_analise || fianca.data_atualizacao}
                            score={fianca.score_credito}
                            rate={fianca.taxa_aplicada}
                            analystName="Analista Responsável"
                            observations={fianca.observacoes_aprovacao}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </ApprovedFiancaTooltip>
                        ) : fianca.status_fianca === 'pagamento_disponivel' ? (
                          <AguardandoPagamentoTooltip
                            valorFianca={fianca.imovel_valor_aluguel}
                            nomeInquilino={fianca.inquilino_nome_completo}
                            dataEnvio={fianca.data_atualizacao}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </AguardandoPagamentoTooltip>
                        ) : fianca.status_fianca === 'em_analise' ? (
                          <EmAnaliseTooltip
                            dataCriacao={fianca.data_criacao}
                            nomeInquilino={fianca.inquilino_nome_completo}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </EmAnaliseTooltip>
                        ) : fianca.status_fianca === 'pagamento_confirmado' ? (
                          <PagamentoConfirmadoTooltip
                            dataConfirmacao={fianca.data_atualizacao}
                            valorFianca={fianca.imovel_valor_aluguel}
                            nomeInquilino={fianca.inquilino_nome_completo}
                          >
                            <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-help`}>
                              {getStatusLabel(fianca.status_fianca)}
                            </Badge>
                          </PagamentoConfirmadoTooltip>
                        ) : (
                          <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                            {getStatusLabel(fianca.status_fianca)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewFianca(fianca.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {fianca.status_fianca === 'aprovada' && (
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleAcceptFianca(fianca.id)}
                              disabled={isAccepting}
                            >
                              {isAccepting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Aceitar'
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredFiancas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma fiança encontrada
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'todos' || startDate || endDate
                    ? 'Tente ajustar sua busca ou adicione uma nova fiança.'
                    : 'Adicione sua primeira fiança para começar.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;

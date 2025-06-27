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
import { validateFiancaForm, formatCurrency as formatCurrencyUtil } from '@/components/FiancaFormValidation';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import RejectedFiancaTooltip from '@/components/RejectedFiancaTooltip';
import ApprovedFiancaTooltip from '@/components/ApprovedFiancaTooltip';
import AguardandoPagamentoTooltip from '@/components/AguardandoPagamentoTooltip';
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
      const formatted = formatCurrencyUtil(value);
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

  const handleSubmitFianca = () => {
    const errors = validateFiancaForm(formData);
    
    if (errors.length > 0) {
      toast({
        title: "Erro na validação",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    createFianca(formData, {
      onSuccess: () => {
        toast({
          title: "Fiança criada com sucesso!",
          description: "A fiança foi enviada para análise.",
        });
        setIsDialogOpen(false);
        // Reset form
        setFormData({
          nomeCompleto: '',
          cpf: '',
          email: '',
          whatsapp: '+55',
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
          imovelPais: 'Brasil',
          cnpjImobiliaria: ''
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao criar fiança",
          description: error.message,
          variant: "destructive"
        });
      }
    });
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
      'comprovante_enviado': 'bg-blue-500'
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
      'comprovante_enviado': 'Comprovante Enviado'
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total de Fianças</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-primary">{stats.totalFiancas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Fianças Pendentes</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-warning">{stats.fiancasPendentes}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Fianças Ativas</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-success">{stats.fiancasAtivas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Fianças Vencidas</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-destructive">{stats.fiancasVencidas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Fianças Rejeitadas</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-red-500">{stats.fiancasRejeitadas}</div>
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
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Endereço do Inquilino</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="inquilinoEndereco">Endereço *</Label>
                            <Input
                              id="inquilinoEndereco"
                              value={formData.inquilinoEndereco}
                              onChange={(e) => handleInputChange('inquilinoEndereco', e.target.value)}
                              placeholder="Rua, Avenida, etc."
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
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Endereço do Imóvel</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="imovelEndereco">Endereço *</Label>
                            <Input
                              id="imovelEndereco"
                              value={formData.imovelEndereco}
                              onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                              placeholder="Rua, Avenida, etc."
                              required
                            />
                          </div>
                          <div>
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
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>Lista de Fianças</CardTitle>
              {/* Filtros (agora empilhados em mobile) */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
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
            </div>
          </CardHeader>

          <CardContent>
            {/* Tabela responsiva com scroll horizontal em mobile */}
            <div className="overflow-x-auto">
              <Table className="min-w-[600px] lg:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Inquilino</TableHead>
                    <TableHead className="lg:w-[250px]">Imóvel</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiancas.map((fianca) => (
                    <TableRow key={fianca.id}>
                      {/* Celulas com ajustes para mobile */}
                      <TableCell className="font-medium py-2">
                        <div className="line-clamp-1">
                          {fianca.inquilino_nome_completo}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2">
                        <div className="line-clamp-1">
                          {`${fianca.imovel_endereco}, ${fianca.imovel_numero}`}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {fianca.imovel_bairro}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-2">
                        {formatCurrency(fianca.imovel_valor_aluguel)}
                      </TableCell>
                      
                      <TableCell className="py-2">
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
                        ) : (
                          <Badge className={`${getStatusColor(fianca.status_fianca)} text-white text-xs`}>
                            {getStatusLabel(fianca.status_fianca)}
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell className="hidden sm:table-cell py-2">
                        {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      
                      <TableCell className="py-2">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleViewFianca(fianca.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {fianca.status_fianca === 'aprovada' && (
                            <Button 
                              size="icon"
                              className="h-8 w-8 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptFianca(fianca.id)}
                              disabled={isAccepting}
                            >
                              {isAccepting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
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

            {/* Mensagem quando não há resultados */}
            {filteredFiancas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Nenhuma fiança encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? "Tente ajustar sua busca" : "Adicione uma nova fiança"}
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

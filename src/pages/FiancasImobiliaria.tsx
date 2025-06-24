
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useFiancas, type FiancaFormData } from '@/hooks/useFiancas';
import { validateFiancaForm, formatCurrency } from '@/components/FiancaFormValidation';
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
      <div className="container mx-auto p-4 lg:p-6 space-y-6 max-w-full animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-4 lg:p-6 text-[#0C1C2E]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold mb-2">Gestão de Fianças</h1>
              <p className="opacity-90 text-sm lg:text-base">Gerencie e acompanhe todas as suas fianças</p>
            </div>
            <FileText className="h-8 w-8 lg:h-12 lg:w-12 opacity-50 flex-shrink-0" />
          </div>
        </div>

        {/* Filtros de Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base lg:text-lg">
              <Calendar className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Filtros por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Total de Fianças</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-primary">{stats.totalFiancas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Fianças Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-warning">{stats.fiancasPendentes}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Fianças Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-success">{stats.fiancasAtivas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Fianças Vencidas</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-destructive">{stats.fiancasVencidas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Fianças Rejeitadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-red-500">{stats.fiancasRejeitadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ações e Lista de Fianças */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <CardTitle className="text-base lg:text-lg">Lista de Fianças</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 w-full lg:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Gerar Fiança
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Nova Fiança</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do inquilino e do imóvel para gerar uma nova fiança
                    </DialogDescription>
                  </DialogHeader>
                  
                  <ScrollArea className="max-h-[calc(90vh-120px)]">
                    <Tabs defaultValue="inquilino" className="w-full px-1">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="inquilino" className="text-xs lg:text-sm">Dados do Inquilino</TabsTrigger>
                        <TabsTrigger value="imovel" className="text-xs lg:text-sm">Dados do Imóvel</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="inquilino" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeCompleto" className="text-sm">Nome Completo *</Label>
                            <Input
                              id="nomeCompleto"
                              value={formData.nomeCompleto}
                              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                              placeholder="Nome completo do inquilino"
                              className="w-full"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cpf" className="text-sm">CPF *</Label>
                            <Input
                              id="cpf"
                              value={formData.cpf}
                              onChange={(e) => handleInputChange('cpf', e.target.value)}
                              placeholder="000.000.000-00"
                              className="w-full"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="email@exemplo.com"
                              className="w-full"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-sm">WhatsApp *</Label>
                            <Input
                              id="whatsapp"
                              value={formData.whatsapp}
                              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                              placeholder="+55 (11) 9 9999-9999"
                              className="w-full"
                              required
                            />
                          </div>
                          <div className="space-y-2 lg:col-span-2">
                            <Label htmlFor="rendaMensal" className="text-sm">Renda Mensal *</Label>
                            <Input
                              id="rendaMensal"
                              value={formData.rendaMensal}
                              onChange={(e) => handleInputChange('rendaMensal', e.target.value)}
                              placeholder="R$ 5.000,00"
                              className="w-full"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-base lg:text-lg font-medium">Endereço do Inquilino</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 space-y-2">
                              <Label htmlFor="inquilinoEndereco" className="text-sm">Endereço *</Label>
                              <Input
                                id="inquilinoEndereco"
                                value={formData.inquilinoEndereco}
                                onChange={(e) => handleInputChange('inquilinoEndereco', e.target.value)}
                                placeholder="Rua, Avenida, etc."
                                className="w-full"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="inquilinoNumero" className="text-sm">Número *</Label>
                              <Input
                                id="inquilinoNumero"
                                value={formData.inquilinoNumero}
                                onChange={(e) => handleInputChange('inquilinoNumero', e.target.value)}
                                placeholder="123"
                                className="w-full"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="inquilinoComplemento" className="text-sm">Complemento</Label>
                            <Input
                              id="inquilinoComplemento"
                              value={formData.inquilinoComplemento}
                              onChange={(e) => handleInputChange('inquilinoComplemento', e.target.value)}
                              placeholder="Apto, Sala, etc."
                              className="w-full"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="inquilinoBairro" className="text-sm">Bairro *</Label>
                              <Input
                                id="inquilinoBairro"
                                value={formData.inquilinoBairro}
                                onChange={(e) => handleInputChange('inquilinoBairro', e.target.value)}
                                placeholder="Centro"
                                className="w-full"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="inquilinoCidade" className="text-sm">Cidade *</Label>
                              <Input
                                id="inquilinoCidade"
                                value={formData.inquilinoCidade}
                                onChange={(e) => handleInputChange('inquilinoCidade', e.target.value)}
                                placeholder="São Paulo"
                                className="w-full"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="inquilinoEstado" className="text-sm">Estado *</Label>
                              <Input
                                id="inquilinoEstado"
                                value={formData.inquilinoEstado}
                                onChange={(e) => handleInputChange('inquilinoEstado', e.target.value)}
                                placeholder="SP"
                                className="w-full"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="inquilinoPais" className="text-sm">País</Label>
                            <Input
                              id="inquilinoPais"
                              value={formData.inquilinoPais}
                              readOnly
                              className="bg-gray-100 w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="imovel" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tipoImovel" className="text-sm">Tipo de Imóvel *</Label>
                            <Select value={formData.tipoImovel} onValueChange={(value) => handleInputChange('tipoImovel', value)}>
                              <SelectTrigger className="w-full">
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
                          <div className="space-y-2">
                            <Label htmlFor="tipoLocacao" className="text-sm">Tipo de Locação *</Label>
                            <Select value={formData.tipoLocacao} onValueChange={(value) => handleInputChange('tipoLocacao', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="residencial">Residencial</SelectItem>
                                <SelectItem value="comercial">Comercial</SelectItem>
                                <SelectItem value="misto">Misto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="valorAluguel" className="text-sm">Valor do Aluguel Mensal *</Label>
                            <Input
                              id="valorAluguel"
                              value={formData.valorAluguel}
                              onChange={(e) => handleInputChange('valorAluguel', e.target.value)}
                              placeholder="R$ 2.500,00"
                              className="w-full"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="areaMetros" className="text-sm">Área em m²</Label>
                            <Input
                              id="areaMetros"
                              value={formData.areaMetros}
                              onChange={(e) => handleInputChange('areaMetros', e.target.value)}
                              placeholder="80"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2 lg:col-span-2">
                            <Label htmlFor="tempoLocacao" className="text-sm">Tempo de Locação (anos) *</Label>
                            <Input
                              id="tempoLocacao"
                              value={formData.tempoLocacao}
                              onChange={(e) => handleInputChange('tempoLocacao', e.target.value)}
                              placeholder="3"
                              className="w-full"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="descricaoImovel" className="text-sm">Descrição do Imóvel</Label>
                          <Textarea
                            id="descricaoImovel"
                            value={formData.descricaoImovel}
                            onChange={(e) => handleInputChange('descricaoImovel', e.target.value)}
                            placeholder="3 quartos, 2 banheiros, área externa, garagem..."
                            rows={3}
                            className="w-full resize-none"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-base lg:text-lg font-medium">Endereço do Imóvel</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 space-y-2">
                              <Label htmlFor="imovelEndereco" className="text-sm">Endereço *</Label>
                              <Input
                                id="imovelEndereco"
                                value={formData.imovelEndereco}
                                onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                                placeholder="Rua, Avenida, etc."
                                className="w-full"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="imovelNumero" className="text-sm">Número *</Label>
                              <Input
                                id="imovelNumero"
                                value={formData.imovelNumero}
                                onChange={(e) => handleInputChange('imovelNumero', e.target.value)}
                                placeholder="123"
                                className="w-full"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="imovelComplemento" className="text-sm">Complemento</Label>
                            <Input
                              id="imovelComplemento"
                              value={formData.imovelComplemento}
                              onChange={(e) => handleInputChange('imovelComplemento', e.target.value)}
                              placeholder="Apto, Sala, etc."
                              className="w-full"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="imovelBairro" className="text-sm">Bairro *</Label>
                              <Input
                                id="imovelBairro"
                                value={formData.imovelBairro}
                                onChange={(e) => handleInputChange('imovelBairro', e.target.value)}
                                placeholder="Centro"
                                className="w-full"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="imovelCidade" className="text-sm">Cidade *</Label>
                              <Input
                                id="imovelCidade"
                                value={formData.imovelCidade}
                                onChange={(e) => handleInputChange('imovelCidade', e.target.value)}
                                placeholder="São Paulo"
                                className="w-full"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="imovelEstado" className="text-sm">Estado *</Label>
                              <Input
                                id="imovelEstado"
                                value={formData.imovelEstado}
                                onChange={(e) => handleInputChange('imovelEstado', e.target.value)}
                                placeholder="SP"
                                className="w-full"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="imovelPais" className="text-sm">País</Label>
                            <Input
                              id="imovelPais"
                              value={formData.imovelPais}
                              readOnly
                              className="bg-gray-100 w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </ScrollArea>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSubmitFianca} 
                      className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
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
          <CardContent className="p-0 sm:p-6">
            <div className="p-4 sm:p-0 space-y-4">
              <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar por inquilino ou imóvel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
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
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Inquilino</TableHead>
                        <TableHead className="min-w-[200px]">Imóvel</TableHead>
                        <TableHead className="min-w-[100px]">Valor</TableHead>
                        <TableHead className="min-w-[120px]">Status</TableHead>
                        <TableHead className="min-w-[120px] hidden lg:table-cell">Data Criação</TableHead>
                        <TableHead className="min-w-[150px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiancas.map((fianca) => (
                        <TableRow key={fianca.id}>
                          <TableCell className="font-medium">
                            <div className="min-w-0 max-w-[150px]">
                              <p className="truncate text-sm">{fianca.inquilino_nome_completo}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-0 max-w-[200px]">
                              <p className="truncate text-sm">
                                {`${fianca.imovel_endereco}, ${fianca.imovel_numero} - ${fianca.imovel_bairro}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
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
                          <TableCell className="hidden lg:table-cell whitespace-nowrap text-sm">
                            {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewFianca(fianca.id)}
                                className="whitespace-nowrap text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver
                              </Button>
                              {fianca.status_fianca === 'aprovada' ? (
                                <Button 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap text-xs"
                                  onClick={() => handleAcceptFianca(fianca.id)}
                                  disabled={isAccepting}
                                >
                                  {isAccepting ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : null}
                                  Aceitar
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {filteredFiancas.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma fiança encontrada
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base">
                    {searchTerm || statusFilter !== 'todos' || startDate || endDate
                      ? 'Tente ajustar sua busca ou adicione uma nova fiança.'
                      : 'Adicione sua primeira fiança para começar.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;

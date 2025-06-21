
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  Building
} from 'lucide-react';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';

const FiancasImobiliaria = () => {
  const { formatPhone, formatCNPJ } = usePhoneFormatter();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Dados mock para as estatísticas
  const stats = {
    total: 45,
    pendentes: 8,
    ativas: 32,
    rejeitadas: 5
  };

  // Dados mock para a listagem de fianças
  const fiancas = [
    {
      id: 'F-001',
      inquilino: 'João Silva Santos',
      cpf: '123.456.789-10',
      imovel: 'Apartamento - Rua das Flores, 123',
      valor: 'R$ 2.500,00',
      status: 'ativa',
      dataCreated: '2024-01-15',
      dataVencimento: '2025-01-15'
    },
    {
      id: 'F-002',
      inquilino: 'Maria Oliveira Costa',
      cpf: '987.654.321-00',
      imovel: 'Casa - Av. Principal, 456',
      valor: 'R$ 3.200,00',
      status: 'pendente',
      dataCreated: '2024-01-20',
      dataVencimento: '2025-01-20'
    },
    {
      id: 'F-003',
      inquilino: 'Pedro Souza Lima',
      cpf: '456.789.123-45',
      imovel: 'Apartamento - Rua Central, 789',
      valor: 'R$ 1.800,00',
      status: 'rejeitada',
      dataCreated: '2024-01-10',
      dataVencimento: null
    }
  ];

  const [formData, setFormData] = useState({
    // Dados do Inquilino
    nomeCompleto: '',
    cpf: '',
    email: '',
    whatsapp: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    rendaMensal: '',
    
    // Dados do Imóvel
    tipoImovel: '',
    tipoLocacao: '',
    valorAluguel: '',
    descricao: '',
    areaMetros: '',
    imovelEndereco: '',
    imovelNumero: '',
    imovelComplemento: '',
    imovelBairro: '',
    imovelCidade: '',
    imovelEstado: '',
    imovelPais: 'Brasil',
    tempoLocacao: ''
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'whatsapp') {
      setFormData(prev => ({
        ...prev,
        [field]: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Dados da fiança:', formData);
    setShowModal(false);
    // Reset form
    setFormData({
      nomeCompleto: '',
      cpf: '',
      email: '',
      whatsapp: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil',
      rendaMensal: '',
      tipoImovel: '',
      tipoLocacao: '',
      valorAluguel: '',
      descricao: '',
      areaMetros: '',
      imovelEndereco: '',
      imovelNumero: '',
      imovelComplemento: '',
      imovelBairro: '',
      imovelCidade: '',
      imovelEstado: '',
      imovelPais: 'Brasil',
      tempoLocacao: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'rejeitada':
        return <Badge className="bg-red-100 text-red-800">Rejeitada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = fianca.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fianca.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todas' || fianca.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Fianças">
      <div className="space-y-6 animate-fade-in">
        {/* Dashboard de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Fianças</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold">{stats.ativas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                  <p className="text-2xl font-bold">89%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Aplicar Filtro
                </Button>
              </div>
              <div className="flex items-end">
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Gerar Fiança
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nova Fiança Locatícia</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do inquilino e do imóvel para gerar uma nova fiança.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Dados do Inquilino */}
                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-4">
                          <User className="mr-2 h-5 w-5" />
                          Dados do Inquilino
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                            <Input
                              id="nomeCompleto"
                              value={formData.nomeCompleto}
                              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                              placeholder="Nome completo do inquilino"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cpf">CPF *</Label>
                            <Input
                              id="cpf"
                              value={formData.cpf}
                              onChange={(e) => handleInputChange('cpf', e.target.value)}
                              placeholder="000.000.000-00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="email@exemplo.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="whatsapp">WhatsApp *</Label>
                            <Input
                              id="whatsapp"
                              value={formData.whatsapp}
                              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                              placeholder="+55 (11) 9 9999-9999"
                            />
                          </div>
                          <div>
                            <Label htmlFor="rendaMensal">Renda Mensal *</Label>
                            <Input
                              id="rendaMensal"
                              value={formData.rendaMensal}
                              onChange={(e) => handleInputChange('rendaMensal', e.target.value)}
                              placeholder="R$ 0,00"
                            />
                          </div>
                        </div>
                        
                        <h4 className="text-md font-medium mt-6 mb-3">Endereço do Inquilino</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="endereco">Endereço *</Label>
                            <Input
                              id="endereco"
                              value={formData.endereco}
                              onChange={(e) => handleInputChange('endereco', e.target.value)}
                              placeholder="Rua, Avenida, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor="numero">Número *</Label>
                            <Input
                              id="numero"
                              value={formData.numero}
                              onChange={(e) => handleInputChange('numero', e.target.value)}
                              placeholder="123"
                            />
                          </div>
                          <div>
                            <Label htmlFor="complemento">Complemento</Label>
                            <Input
                              id="complemento"
                              value={formData.complemento}
                              onChange={(e) => handleInputChange('complemento', e.target.value)}
                              placeholder="Apto, Sala, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor="bairro">Bairro *</Label>
                            <Input
                              id="bairro"
                              value={formData.bairro}
                              onChange={(e) => handleInputChange('bairro', e.target.value)}
                              placeholder="Centro"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cidade">Cidade *</Label>
                            <Input
                              id="cidade"
                              value={formData.cidade}
                              onChange={(e) => handleInputChange('cidade', e.target.value)}
                              placeholder="São Paulo"
                            />
                          </div>
                          <div>
                            <Label htmlFor="estado">Estado *</Label>
                            <Input
                              id="estado"
                              value={formData.estado}
                              onChange={(e) => handleInputChange('estado', e.target.value)}
                              placeholder="SP"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pais">País</Label>
                            <Input
                              id="pais"
                              value={formData.pais}
                              readOnly
                              className="bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dados do Imóvel */}
                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-4">
                          <Building className="mr-2 h-5 w-5" />
                          Dados do Imóvel
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tipoImovel">Tipo do Imóvel *</Label>
                            <Select value={formData.tipoImovel} onValueChange={(value) => handleInputChange('tipoImovel', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="casa">Casa</SelectItem>
                                <SelectItem value="apartamento">Apartamento</SelectItem>
                                <SelectItem value="kitnet">Kitnet</SelectItem>
                                <SelectItem value="sobrado">Sobrado</SelectItem>
                                <SelectItem value="comercial">Comercial</SelectItem>
                                <SelectItem value="galpao">Galpão</SelectItem>
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
                            <Label htmlFor="valorAluguel">Valor do Aluguel *</Label>
                            <Input
                              id="valorAluguel"
                              value={formData.valorAluguel}
                              onChange={(e) => handleInputChange('valorAluguel', e.target.value)}
                              placeholder="R$ 0,00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="areaMetros">Área (m²) *</Label>
                            <Input
                              id="areaMetros"
                              value={formData.areaMetros}
                              onChange={(e) => handleInputChange('areaMetros', e.target.value)}
                              placeholder="85"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tempoLocacao">Tempo de Locação (anos) *</Label>
                            <Input
                              id="tempoLocacao"
                              value={formData.tempoLocacao}
                              onChange={(e) => handleInputChange('tempoLocacao', e.target.value)}
                              placeholder="2"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label htmlFor="descricao">Descrição do Imóvel</Label>
                          <Input
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => handleInputChange('descricao', e.target.value)}
                            placeholder="3 quartos, 2 banheiros, área de serviço, garagem..."
                          />
                        </div>

                        <h4 className="text-md font-medium mt-6 mb-3">Endereço do Imóvel</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="imovelEndereco">Endereço *</Label>
                            <Input
                              id="imovelEndereco"
                              value={formData.imovelEndereco}
                              onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                              placeholder="Rua, Avenida, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor="imovelNumero">Número *</Label>
                            <Input
                              id="imovelNumero"
                              value={formData.imovelNumero}
                              onChange={(e) => handleInputChange('imovelNumero', e.target.value)}
                              placeholder="123"
                            />
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
                          <div>
                            <Label htmlFor="imovelBairro">Bairro *</Label>
                            <Input
                              id="imovelBairro"
                              value={formData.imovelBairro}
                              onChange={(e) => handleInputChange('imovelBairro', e.target.value)}
                              placeholder="Centro"
                            />
                          </div>
                          <div>
                            <Label htmlFor="imovelCidade">Cidade *</Label>
                            <Input
                              id="imovelCidade"
                              value={formData.imovelCidade}
                              onChange={(e) => handleInputChange('imovelCidade', e.target.value)}
                              placeholder="São Paulo"
                            />
                          </div>
                          <div>
                            <Label htmlFor="imovelEstado">Estado *</Label>
                            <Input
                              id="imovelEstado"
                              value={formData.imovelEstado}
                              onChange={(e) => handleInputChange('imovelEstado', e.target.value)}
                              placeholder="SP"
                            />
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
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setShowModal(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                          Gerar Fiança
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listagem de Fianças */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Fianças</CardTitle>
            <CardDescription>
              Gerencie todas as fianças locatícias da sua imobiliária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por inquilino ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="ativa">Ativas</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiancas.map((fianca) => (
                    <TableRow key={fianca.id}>
                      <TableCell className="font-medium">{fianca.id}</TableCell>
                      <TableCell>{fianca.inquilino}</TableCell>
                      <TableCell>{fianca.cpf}</TableCell>
                      <TableCell>{fianca.imovel}</TableCell>
                      <TableCell>{fianca.valor}</TableCell>
                      <TableCell>{getStatusBadge(fianca.status)}</TableCell>
                      <TableCell>{new Date(fianca.dataCreated).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
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
  Edit
} from 'lucide-react';

const FiancasImobiliaria = () => {
  const { user } = useAuth();
  const { formatPhone, formatCNPJ, unformatPhone, unformatCNPJ } = usePhoneFormatter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estado do formulário
  const [formData, setFormData] = useState({
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
    imovelPais: 'Brasil'
  });

  // Dados mockados para demonstração
  const dashboardData = {
    totalFiancas: 24,
    fiancasPendentes: 6,
    fiancasAtivas: 18,
    fiancasVencidas: 0
  };

  const fiancasMock = [
    {
      id: 1,
      inquilino: 'João Silva',
      imovel: 'Apt 101 - Rua das Flores, 123',
      valor: 2500,
      status: 'pendente',
      dataVencimento: '2024-01-25'
    },
    {
      id: 2,
      inquilino: 'Maria Santos',
      imovel: 'Casa - Rua Central, 456',
      valor: 3200,
      status: 'ativa',
      dataVencimento: '2024-03-15'
    },
    {
      id: 3,
      inquilino: 'Pedro Costa',
      imovel: 'Apt 205 - Av. Principal, 789',
      valor: 1800,
      status: 'analise',
      dataVencimento: '2024-02-10'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field === 'whatsapp') {
      setFormData(prev => ({
        ...prev,
        [field]: formatPhone(value)
      }));
    } else if (field === 'cpf') {
      // Formatar CPF (simplificado)
      const numbers = value.replace(/\D/g, '');
      let formatted = numbers;
      if (numbers.length > 3) formatted = numbers.slice(0, 3) + '.' + numbers.slice(3);
      if (numbers.length > 6) formatted = numbers.slice(0, 3) + '.' + numbers.slice(3, 6) + '.' + numbers.slice(6);
      if (numbers.length > 9) formatted = numbers.slice(0, 3) + '.' + numbers.slice(3, 6) + '.' + numbers.slice(6, 9) + '-' + numbers.slice(9, 11);
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
    // Aqui será implementada a lógica para enviar a fiança
    console.log('Dados da fiança:', formData);
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
      imovelPais: 'Brasil'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pendente': 'bg-yellow-500',
      'ativa': 'bg-green-500',
      'analise': 'bg-blue-500',
      'vencida': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pendente': 'Pendente',
      'ativa': 'Ativa',
      'analise': 'Em Análise',
      'vencida': 'Vencida'
    };
    return labels[status] || status;
  };

  const filteredFiancas = fiancasMock.filter(fianca => {
    const matchesSearch = fianca.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fianca.imovel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || fianca.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Fianças">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-6 text-[#0C1C2E]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Gestão de Fianças</h1>
              <p className="opacity-90">Gerencie e acompanhe todas as suas fianças</p>
            </div>
            <FileText className="h-12 w-12 opacity-50" />
          </div>
        </div>

        {/* Filtros de Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Filtros por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fianças</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{dashboardData.totalFiancas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fianças Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{dashboardData.fiancasPendentes}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fianças Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{dashboardData.fiancasAtivas}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fianças Vencidas</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{dashboardData.fiancasVencidas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ações e Lista de Fianças */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Fianças</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Gerar Fiança
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                          <Label htmlFor="nomeCompleto">Nome Completo</Label>
                          <Input
                            id="nomeCompleto"
                            value={formData.nomeCompleto}
                            onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                            placeholder="Nome completo do inquilino"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            value={formData.cpf}
                            onChange={(e) => handleInputChange('cpf', e.target.value)}
                            placeholder="000.000.000-00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">WhatsApp</Label>
                          <Input
                            id="whatsapp"
                            value={formData.whatsapp}
                            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                            placeholder="+55 (11) 9 9999-9999"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rendaMensal">Renda Mensal</Label>
                          <Input
                            id="rendaMensal"
                            value={formData.rendaMensal}
                            onChange={(e) => handleInputChange('rendaMensal', e.target.value)}
                            placeholder="R$ 5.000,00"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Endereço do Inquilino</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="inquilinoEndereco">Endereço</Label>
                            <Input
                              id="inquilinoEndereco"
                              value={formData.inquilinoEndereco}
                              onChange={(e) => handleInputChange('inquilinoEndereco', e.target.value)}
                              placeholder="Rua, Avenida, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor="inquilinoNumero">Número</Label>
                            <Input
                              id="inquilinoNumero"
                              value={formData.inquilinoNumero}
                              onChange={(e) => handleInputChange('inquilinoNumero', e.target.value)}
                              placeholder="123"
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
                            <Label htmlFor="inquilinoBairro">Bairro</Label>
                            <Input
                              id="inquilinoBairro"
                              value={formData.inquilinoBairro}
                              onChange={(e) => handleInputChange('inquilinoBairro', e.target.value)}
                              placeholder="Centro"
                            />
                          </div>
                          <div>
                            <Label htmlFor="inquilinoCidade">Cidade</Label>
                            <Input
                              id="inquilinoCidade"
                              value={formData.inquilinoCidade}
                              onChange={(e) => handleInputChange('inquilinoCidade', e.target.value)}
                              placeholder="São Paulo"
                            />
                          </div>
                          <div>
                            <Label htmlFor="inquilinoEstado">Estado</Label>
                            <Input
                              id="inquilinoEstado"
                              value={formData.inquilinoEstado}
                              onChange={(e) => handleInputChange('inquilinoEstado', e.target.value)}
                              placeholder="SP"
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
                          <Label htmlFor="tipoImovel">Tipo de Imóvel</Label>
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
                          <Label htmlFor="tipoLocacao">Tipo de Locação</Label>
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
                          <Label htmlFor="valorAluguel">Valor do Aluguel Mensal</Label>
                          <Input
                            id="valorAluguel"
                            value={formData.valorAluguel}
                            onChange={(e) => handleInputChange('valorAluguel', e.target.value)}
                            placeholder="R$ 2.500,00"
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
                          <Label htmlFor="tempoLocacao">Tempo de Locação (anos)</Label>
                          <Input
                            id="tempoLocacao"
                            value={formData.tempoLocacao}
                            onChange={(e) => handleInputChange('tempoLocacao', e.target.value)}
                            placeholder="3"
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
                            <Label htmlFor="imovelEndereco">Endereço</Label>
                            <Input
                              id="imovelEndereco"
                              value={formData.imovelEndereco}
                              onChange={(e) => handleInputChange('imovelEndereco', e.target.value)}
                              placeholder="Rua, Avenida, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor="imovelNumero">Número</Label>
                            <Input
                              id="imovelNumero"
                              value={formData.imovelNumero}
                              onChange={(e) => handleInputChange('imovelNumero', e.target.value)}
                              placeholder="123"
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
                            <Label htmlFor="imovelBairro">Bairro</Label>
                            <Input
                              id="imovelBairro"
                              value={formData.imovelBairro}
                              onChange={(e) => handleInputChange('imovelBairro', e.target.value)}
                              placeholder="Centro"
                            />
                          </div>
                          <div>
                            <Label htmlFor="imovelCidade">Cidade</Label>
                            <Input
                              id="imovelCidade"
                              value={formData.imovelCidade}
                              onChange={(e) => handleInputChange('imovelCidade', e.target.value)}
                              placeholder="São Paulo"
                            />
                          </div>
                          <div>
                            <Label htmlFor="imovelEstado">Estado</Label>
                            <Input
                              id="imovelEstado"
                              value={formData.imovelEstado}
                              onChange={(e) => handleInputChange('imovelEstado', e.target.value)}
                              placeholder="SP"
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
                    <Button onClick={handleSubmitFianca} className="bg-primary hover:bg-primary/90">
                      Gerar Fiança
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
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
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="ativa">Ativas</SelectItem>
                  <SelectItem value="analise">Em Análise</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiancas.map((fianca) => (
                  <TableRow key={fianca.id}>
                    <TableCell className="font-medium">{fianca.inquilino}</TableCell>
                    <TableCell>{fianca.imovel}</TableCell>
                    <TableCell>R$ {fianca.valor.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(fianca.status)} text-white`}>
                        {getStatusLabel(fianca.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(fianca.dataVencimento).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;

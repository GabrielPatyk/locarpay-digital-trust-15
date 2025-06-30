
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Phone, 
  Mail, 
  TrendingUp, 
  Calendar,
  Plus,
  Eye,
  UserPlus,
  Filter,
  Search,
  ArrowRight,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  origem: string;
  status: 'novo' | 'contato' | 'qualificado' | 'convertido' | 'perdido';
  dataRecebimento: string;
  observacoes?: string;
  executivoId?: string;
  valor?: number;
}

const CRM = () => {
  const { toast } = useToast();
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [origemFilter, setOrigemFilter] = useState('todas');
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    origem: '',
    observacoes: '',
    valor: ''
  });

  // Mock data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      nome: 'Roberto Silva',
      email: 'roberto@imobiliaria.com',
      telefone: '(11) 99999-9999',
      empresa: 'Imobiliária Sucesso',
      origem: 'Website',
      status: 'novo',
      dataRecebimento: '2024-01-15',
      valor: 25000
    },
    {
      id: '2',
      nome: 'Sandra Costa',
      email: 'sandra@prediosprimos.com',
      telefone: '(11) 88888-8888',
      empresa: 'Prédios Primos',
      origem: 'Indicação',
      status: 'contato',
      dataRecebimento: '2024-01-14',
      valor: 18000
    },
    {
      id: '3',
      nome: 'Marcus Oliveira',
      email: 'marcus@topimob.com',
      telefone: '(11) 77777-7777',
      empresa: 'Top Imobiliária',
      origem: 'LinkedIn',
      status: 'qualificado',
      dataRecebimento: '2024-01-13',
      executivoId: '1',
      valor: 32000
    },
    {
      id: '4',
      nome: 'Ana Santos',
      email: 'ana@casaverde.com',
      telefone: '(11) 66666-6666',
      empresa: 'Casa Verde Imóveis',
      origem: 'Google Ads',
      status: 'convertido',
      dataRecebimento: '2024-01-10',
      valor: 45000
    },
    {
      id: '5',
      nome: 'Carlos Mendes',
      email: 'carlos@espacoimob.com',
      telefone: '(11) 55555-5555',
      empresa: 'Espaço Imobiliário',
      origem: 'Website',
      status: 'perdido',
      dataRecebimento: '2024-01-09',
      valor: 15000
    }
  ]);

  const executivos = [
    { id: '1', nome: 'Ana Costa' },
    { id: '2', nome: 'Carlos Mendes' },
    { id: '3', nome: 'Patricia Lima' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoLead: Lead = {
      id: Date.now().toString(),
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      empresa: formData.empresa,
      origem: formData.origem,
      status: 'novo',
      dataRecebimento: new Date().toISOString().split('T')[0],
      observacoes: formData.observacoes,
      valor: formData.valor ? parseFloat(formData.valor) : undefined
    };

    setLeads(prev => [novoLead, ...prev]);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      origem: '',
      observacoes: '',
      valor: ''
    });
    setShowNewLeadForm(false);

    toast({
      title: "Lead adicionado com sucesso!",
      description: "O novo lead foi registrado no CRM.",
    });
  };

  const atualizarStatusLead = (leadId: string, novoStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: novoStatus } : lead
    ));
    
    toast({
      title: "Status atualizado!",
      description: `Status do lead alterado para: ${getStatusText(novoStatus)}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500';
      case 'contato': return 'bg-warning';
      case 'qualificado': return 'bg-purple-500';
      case 'convertido': return 'bg-success';
      case 'perdido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato': return 'Contato';
      case 'qualificado': return 'Qualificado';
      case 'convertido': return 'Convertido';
      case 'perdido': return 'Perdido';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'novo': return <AlertCircle className="h-4 w-4" />;
      case 'contato': return <Phone className="h-4 w-4" />;
      case 'qualificado': return <Target className="h-4 w-4" />;
      case 'convertido': return <CheckCircle className="h-4 w-4" />;
      case 'perdido': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    const matchesOrigem = origemFilter === 'todas' || lead.origem === origemFilter;
    
    return matchesSearch && matchesStatus && matchesOrigem;
  });

  const statusCounts = {
    novo: leads.filter(l => l.status === 'novo').length,
    contato: leads.filter(l => l.status === 'contato').length,
    qualificado: leads.filter(l => l.status === 'qualificado').length,
    convertido: leads.filter(l => l.status === 'convertido').length,
    perdido: leads.filter(l => l.status === 'perdido').length,
  };

  const valorTotal = leads.reduce((acc, lead) => acc + (lead.valor || 0), 0);
  const valorConvertido = leads.filter(l => l.status === 'convertido').reduce((acc, lead) => acc + (lead.valor || 0), 0);
  const taxaConversao = leads.length > 0 ? (statusCounts.convertido / leads.length) * 100 : 0;

  const origens = [...new Set(leads.map(lead => lead.origem))];

  return (
    <Layout title="CRM - Gestão de Leads">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-4 sm:p-6 text-[#0C1C2E] relative overflow-hidden">
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-20">
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">CRM Inteligente</h1>
          <p className="opacity-90 mb-4 text-sm sm:text-base">
            Gerencie seu pipeline de vendas de forma eficiente e aumente suas conversões.
          </p>
        </div>

        {/* Tabs para organizar o CRM */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="funil" className="text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Funil</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-lg sm:text-2xl font-bold text-primary">{leads.length}</p>
                    </div>
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Convertidos</p>
                      <p className="text-lg sm:text-2xl font-bold text-success">{statusCounts.convertido}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Taxa Conversão</p>
                      <p className="text-lg sm:text-2xl font-bold text-purple-500">{taxaConversao.toFixed(1)}%</p>
                    </div>
                    <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Pipeline</p>
                      <p className="text-lg sm:text-2xl font-bold text-warning">R$ {valorTotal.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo por Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Resumo por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="text-center p-3 rounded-lg border">
                      <div className="flex justify-center mb-2">
                        {getStatusIcon(status)}
                      </div>
                      <p className="text-lg sm:text-2xl font-bold">{count}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{getStatusText(status)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funil Tab */}
          <TabsContent value="funil" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Funil de Vendas</CardTitle>
                <CardDescription>Visualize o progresso dos leads no pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'novo', label: 'Novos Leads', count: statusCounts.novo, color: 'bg-blue-500' },
                    { status: 'contato', label: 'Em Contato', count: statusCounts.contato, color: 'bg-warning' },
                    { status: 'qualificado', label: 'Qualificados', count: statusCounts.qualificado, color: 'bg-purple-500' },
                    { status: 'convertido', label: 'Convertidos', count: statusCounts.convertido, color: 'bg-success' },
                  ].map((stage, index) => (
                    <div key={stage.status} className="relative">
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${stage.color}`} />
                          <span className="font-medium text-sm sm:text-base">{stage.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg sm:text-xl font-bold">{stage.count}</span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            ({leads.length > 0 ? ((stage.count / leads.length) * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </div>
                      {index < 3 && (
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 my-1 sm:my-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4 sm:space-y-6">
            {/* Header com busca e filtros */}
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-primary">Gestão de Leads</h2>
                <Button onClick={() => setShowNewLeadForm(true)} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Lead
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos Status</SelectItem>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="contato">Contato</SelectItem>
                      <SelectItem value="qualificado">Qualificado</SelectItem>
                      <SelectItem value="convertido">Convertido</SelectItem>
                      <SelectItem value="perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={origemFilter} onValueChange={setOrigemFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas Origens</SelectItem>
                      {origens.map(origem => (
                        <SelectItem key={origem} value={origem}>{origem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {showNewLeadForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Adicionar Novo Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa">Empresa *</Label>
                        <Input
                          id="empresa"
                          value={formData.empresa}
                          onChange={(e) => handleInputChange('empresa', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="origem">Origem *</Label>
                        <Input
                          id="origem"
                          value={formData.origem}
                          onChange={(e) => handleInputChange('origem', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="valor">Valor Estimado</Label>
                        <Input
                          id="valor"
                          type="number"
                          value={formData.valor}
                          onChange={(e) => handleInputChange('valor', e.target.value)}
                          placeholder="Ex: 25000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={formData.observacoes}
                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Adicionar Lead
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewLeadForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Lista de Leads */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Leads ({filteredLeads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop/Tablet View */}
                <div className="hidden sm:block space-y-4">
                  {filteredLeads.map((lead) => (
                    <div key={lead.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{lead.nome}</h4>
                          <p className="text-sm text-gray-600 truncate">{lead.empresa}</p>
                          <p className="text-sm text-gray-500 truncate">{lead.email} | {lead.telefone}</p>
                        </div>
                        <Badge className={`${getStatusColor(lead.status)} text-white`}>
                          {getStatusText(lead.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Origem</p>
                          <p className="font-medium">{lead.origem}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Data</p>
                          <p className="font-medium">{new Date(lead.dataRecebimento).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Valor</p>
                          <p className="font-medium">{lead.valor ? `R$ ${lead.valor.toLocaleString()}` : 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        
                        {lead.status === 'novo' && (
                          <Button size="sm" onClick={() => atualizarStatusLead(lead.id, 'contato')} className="bg-warning hover:bg-warning/90 text-primary">
                            <Phone className="mr-2 h-4 w-4" />
                            Fazer Contato
                          </Button>
                        )}
                        
                        {lead.status === 'contato' && (
                          <Button size="sm" onClick={() => atualizarStatusLead(lead.id, 'qualificado')} className="bg-purple-500 hover:bg-purple-600">
                            <Target className="mr-2 h-4 w-4" />
                            Qualificar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile View */}
                <div className="sm:hidden space-y-3">
                  {filteredLeads.map((lead) => (
                    <div key={lead.id} className="p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{lead.nome}</h4>
                          <p className="text-xs text-gray-600 truncate">{lead.empresa}</p>
                        </div>
                        <Badge className={`${getStatusColor(lead.status)} text-white text-xs`}>
                          {getStatusText(lead.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs mb-3">
                        <p className="text-gray-500">{lead.email}</p>
                        <p className="text-gray-500">{lead.telefone}</p>
                        <p className="text-gray-500">{lead.origem} • {new Date(lead.dataRecebimento).toLocaleDateString()}</p>
                        {lead.valor && <p className="font-medium text-primary">R$ {lead.valor.toLocaleString()}</p>}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)} className="flex-1 text-xs">
                          <Eye className="mr-1 h-3 w-3" />
                          Ver
                        </Button>
                        
                        {lead.status === 'novo' && (
                          <Button size="sm" onClick={() => atualizarStatusLead(lead.id, 'contato')} className="flex-1 bg-warning hover:bg-warning/90 text-primary text-xs">
                            <Phone className="mr-1 h-3 w-3" />
                            Contato
                          </Button>
                        )}
                        
                        {lead.status === 'contato' && (
                          <Button size="sm" onClick={() => atualizarStatusLead(lead.id, 'qualificado')} className="flex-1 bg-purple-500 hover:bg-purple-600 text-xs">
                            <Target className="mr-1 h-3 w-3" />
                            Qualificar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredLeads.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum lead encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros de busca.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Detalhes do Lead</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedLead(null)}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <p className="font-medium">{selectedLead.nome}</p>
                    </div>
                    <div>
                      <Label>Empresa</Label>
                      <p className="font-medium">{selectedLead.empresa}</p>
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <p className="font-medium">{selectedLead.email}</p>
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <p className="font-medium">{selectedLead.telefone}</p>
                    </div>
                    <div>
                      <Label>Origem</Label>
                      <p className="font-medium">{selectedLead.origem}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={`${getStatusColor(selectedLead.status)} text-white`}>
                        {getStatusText(selectedLead.status)}
                      </Badge>
                    </div>
                    {selectedLead.valor && (
                      <div>
                        <Label>Valor Estimado</Label>
                        <p className="font-medium">R$ {selectedLead.valor.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  {selectedLead.observacoes && (
                    <div>
                      <Label>Observações</Label>
                      <p className="font-medium">{selectedLead.observacoes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CRM;

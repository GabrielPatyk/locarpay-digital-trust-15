
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Building,
  MapPin,
  Clock,
  Star,
  Edit,
  Trash2,
  Eye,
  PhoneCall,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cargo?: string;
  origem: 'Site' | 'Indicação' | 'Redes Sociais' | 'Evento' | 'Cold Call' | 'Email Marketing';
  status: 'novo' | 'contato_inicial' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  temperatura: 'frio' | 'morno' | 'quente';
  valor_estimado?: number;
  data_criacao: string;
  ultima_interacao?: string;
  proximo_followup?: string;
  observacoes?: string;
  tags: string[];
  historico_interacoes: {
    id: string;
    tipo: 'chamada' | 'email' | 'reuniao' | 'whatsapp' | 'nota';
    data: string;
    descricao: string;
    usuario: string;
  }[];
}

const mockLeads: Lead[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@imobiliaria.com.br',
    telefone: '+55 (11) 9 9999-9999',
    empresa: 'Silva Imóveis',
    cargo: 'Diretor',
    origem: 'Site',
    status: 'qualificado',
    temperatura: 'quente',
    valor_estimado: 50000,
    data_criacao: '2024-01-15',
    ultima_interacao: '2024-01-20',
    proximo_followup: '2024-01-25',
    observacoes: 'Interessado em implementar sistema de fianças para 200 imóveis',
    tags: ['Premium', 'Grande Volume'],
    historico_interacoes: [
      { id: '1', tipo: 'chamada', data: '2024-01-20', descricao: 'Primeira conversa - muito interessado', usuario: 'Carlos Santos' },
      { id: '2', tipo: 'email', data: '2024-01-18', descricao: 'Enviado material comercial', usuario: 'Carlos Santos' }
    ]
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@corretorasp.com',
    telefone: '+55 (11) 9 8888-8888',
    empresa: 'Corretora SP',
    cargo: 'Gerente',
    origem: 'Indicação',
    status: 'proposta',
    temperatura: 'morno',
    valor_estimado: 25000,
    data_criacao: '2024-01-10',
    ultima_interacao: '2024-01-22',
    proximo_followup: '2024-01-26',
    observacoes: 'Precisa de aprovação da diretoria',
    tags: ['Médio Porte'],
    historico_interacoes: [
      { id: '3', tipo: 'reuniao', data: '2024-01-22', descricao: 'Apresentação da proposta', usuario: 'Ana Costa' }
    ]
  },
  {
    id: '3',
    nome: 'Pedro Lima',
    email: 'pedro@limaimo.com',
    telefone: '+55 (11) 9 7777-7777',
    empresa: 'Lima Imobiliária',
    cargo: 'Proprietário',
    origem: 'Redes Sociais',
    status: 'novo',
    temperatura: 'frio',
    data_criacao: '2024-01-23',
    observacoes: 'Contato inicial pelo Instagram',
    tags: ['Pequeno Porte'],
    historico_interacoes: []
  }
];

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('todas');
  const [filtroTemperatura, setFiltroTemperatura] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'kanban'>('card');

  const [newLead, setNewLead] = useState<Partial<Lead>>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    cargo: '',
    origem: 'Site',
    status: 'novo',
    temperatura: 'frio',
    valor_estimado: 0,
    observacoes: '',
    tags: []
  });

  const statusOptions = [
    { value: 'novo', label: 'Novo', color: 'bg-blue-500' },
    { value: 'contato_inicial', label: 'Contato Inicial', color: 'bg-indigo-500' },
    { value: 'qualificado', label: 'Qualificado', color: 'bg-purple-500' },
    { value: 'proposta', label: 'Proposta', color: 'bg-orange-500' },
    { value: 'negociacao', label: 'Negociação', color: 'bg-yellow-500' },
    { value: 'fechado', label: 'Fechado', color: 'bg-green-500' },
    { value: 'perdido', label: 'Perdido', color: 'bg-red-500' }
  ];

  const temperaturaColors = {
    'frio': 'bg-blue-100 text-blue-800',
    'morno': 'bg-yellow-100 text-yellow-800',
    'quente': 'bg-red-100 text-red-800'
  };

  const origemOptions = ['Site', 'Indicação', 'Redes Sociais', 'Evento', 'Cold Call', 'Email Marketing'];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
    const matchesOrigem = filtroOrigem === 'todas' || lead.origem === filtroOrigem;
    const matchesTemperatura = filtroTemperatura === 'todas' || lead.temperatura === filtroTemperatura;
    
    return matchesSearch && matchesStatus && matchesOrigem && matchesTemperatura;
  });

  const getStatusBadge = (status: string) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    return statusInfo ? { label: statusInfo.label, color: statusInfo.color } : { label: status, color: 'bg-gray-500' };
  };

  const handleCreateLead = () => {
    const lead: Lead = {
      id: Date.now().toString(),
      nome: newLead.nome || '',
      email: newLead.email || '',
      telefone: newLead.telefone || '',
      empresa: newLead.empresa,
      cargo: newLead.cargo,
      origem: newLead.origem as any || 'Site',
      status: 'novo',
      temperatura: newLead.temperatura as any || 'frio',
      valor_estimado: newLead.valor_estimado,
      data_criacao: new Date().toISOString().split('T')[0],
      observacoes: newLead.observacoes,
      tags: newLead.tags || [],
      historico_interacoes: []
    };

    setLeads([...leads, lead]);
    setNewLead({
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      cargo: '',
      origem: 'Site',
      status: 'novo',
      temperatura: 'frio',
      valor_estimado: 0,
      observacoes: '',
      tags: []
    });
    setShowNewLeadModal(false);
  };

  const handleAddInteraction = (leadId: string, interaction: any) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            historico_interacoes: [...lead.historico_interacoes, { 
              ...interaction, 
              id: Date.now().toString(),
              data: new Date().toISOString().split('T')[0],
              usuario: 'Usuário Atual'
            }],
            ultima_interacao: new Date().toISOString().split('T')[0]
          }
        : lead
    ));
  };

  const updateLeadStatus = (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus as any } : lead
    ));
  };

  // Estatísticas do Pipeline
  const totalLeads = leads.length;
  const leadsQuentes = leads.filter(l => l.temperatura === 'quente').length;
  const valorPipelineTotal = leads.reduce((acc, lead) => acc + (lead.valor_estimado || 0), 0);
  const taxaConversao = leads.length > 0 ? (leads.filter(l => l.status === 'fechado').length / leads.length * 100) : 0;

  return (
    <Layout title="CRM - Gestão de Leads">
      <div className="space-y-6 animate-fade-in">
        {/* Header com Estatísticas */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">CRM - Gestão de Leads</h1>
          <p className="text-gray-600 mb-6">Gerencie seus leads e oportunidades de negócio</p>
          
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Leads</p>
                    <p className="text-2xl font-bold text-primary">{totalLeads}</p>
                  </div>
                  <User className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Leads Quentes</p>
                    <p className="text-2xl font-bold text-red-600">{leadsQuentes}</p>
                  </div>
                  <Star className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pipeline Total</p>
                    <p className="text-2xl font-bold text-green-600">R$ {valorPipelineTotal.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa Conversão</p>
                    <p className="text-2xl font-bold text-blue-600">{taxaConversao.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filtros e Ações */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Busca */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Filtros */}
                <div className="flex gap-2">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filtroOrigem} onValueChange={setFiltroOrigem}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as Origens</SelectItem>
                      {origemOptions.map(origem => (
                        <SelectItem key={origem} value={origem}>
                          {origem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filtroTemperatura} onValueChange={setFiltroTemperatura}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Temperatura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="frio">Frio</SelectItem>
                      <SelectItem value="morno">Morno</SelectItem>
                      <SelectItem value="quente">Quente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Ações */}
              <div className="flex gap-2">
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                  >
                    Kanban
                  </Button>
                </div>
                
                <Dialog open={showNewLeadModal} onOpenChange={setShowNewLeadModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Lead</DialogTitle>
                      <DialogDescription>
                        Adicione um novo lead ao seu pipeline de vendas
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                          id="nome"
                          value={newLead.nome}
                          onChange={(e) => setNewLead({...newLead, nome: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newLead.email}
                          onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={newLead.telefone}
                          onChange={(e) => setNewLead({...newLead, telefone: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="empresa">Empresa</Label>
                        <Input
                          id="empresa"
                          value={newLead.empresa}
                          onChange={(e) => setNewLead({...newLead, empresa: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                          id="cargo"
                          value={newLead.cargo}
                          onChange={(e) => setNewLead({...newLead, cargo: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="origem">Origem</Label>
                        <Select 
                          value={newLead.origem} 
                          onValueChange={(value) => setNewLead({...newLead, origem: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {origemOptions.map(origem => (
                              <SelectItem key={origem} value={origem}>
                                {origem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="temperatura">Temperatura</Label>
                        <Select 
                          value={newLead.temperatura} 
                          onValueChange={(value) => setNewLead({...newLead, temperatura: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="frio">Frio</SelectItem>
                            <SelectItem value="morno">Morno</SelectItem>
                            <SelectItem value="quente">Quente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="valor_estimado">Valor Estimado (R$)</Label>
                        <Input
                          id="valor_estimado"
                          type="number"
                          value={newLead.valor_estimado}
                          onChange={(e) => setNewLead({...newLead, valor_estimado: parseFloat(e.target.value)})}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={newLead.observacoes}
                          onChange={(e) => setNewLead({...newLead, observacoes: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setShowNewLeadModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateLead}>
                        Criar Lead
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualização dos Leads */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => {
              const statusInfo = getStatusBadge(lead.status);
              return (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{lead.nome}</h3>
                        <p className="text-sm text-gray-600">{lead.empresa} - {lead.cargo}</p>
                      </div>
                      <Badge className={`${statusInfo.color} text-white`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {lead.telefone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {lead.origem}
                      </div>
                      {lead.valor_estimado && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          R$ {lead.valor_estimado.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={temperaturaColors[lead.temperatura]}>
                        {lead.temperatura.charAt(0).toUpperCase() + lead.temperatura.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(lead.data_criacao).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-1" />
                        E-mail
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowLeadDetails(lead)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {statusOptions.map((status) => {
              const statusLeads = filteredLeads.filter(lead => lead.status === status.value);
              return (
                <Card key={status.value} className="min-h-[500px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{status.label}</span>
                      <Badge variant="secondary">{statusLeads.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statusLeads.map((lead) => (
                      <Card key={lead.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{lead.nome}</h4>
                          <p className="text-xs text-gray-600">{lead.empresa}</p>
                          {lead.valor_estimado && (
                            <p className="text-xs text-green-600 font-medium">
                              R$ {lead.valor_estimado.toLocaleString()}
                            </p>
                          )}
                          <Badge className={`${temperaturaColors[lead.temperatura]} text-xs`}>
                            {lead.temperatura}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de Detalhes do Lead */}
        {showLeadDetails && (
          <Dialog open={!!showLeadDetails} onOpenChange={() => setShowLeadDetails(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detalhes do Lead - {showLeadDetails.nome}</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="interactions">Interações</TabsTrigger>
                  <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Informações Básicas</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nome:</span> {showLeadDetails.nome}</p>
                        <p><span className="font-medium">E-mail:</span> {showLeadDetails.email}</p>
                        <p><span className="font-medium">Telefone:</span> {showLeadDetails.telefone}</p>
                        <p><span className="font-medium">Empresa:</span> {showLeadDetails.empresa}</p>
                        <p><span className="font-medium">Cargo:</span> {showLeadDetails.cargo}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Status & Qualificação</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Status:</span>
                          <Badge className={`${getStatusBadge(showLeadDetails.status).color} text-white`}>
                            {getStatusBadge(showLeadDetails.status).label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Temperatura:</span>
                          <Badge className={temperaturaColors[showLeadDetails.temperatura]}>
                            {showLeadDetails.temperatura}
                          </Badge>
                        </div>
                        <p className="text-sm"><span className="font-medium">Origem:</span> {showLeadDetails.origem}</p>
                        {showLeadDetails.valor_estimado && (
                          <p className="text-sm"><span className="font-medium">Valor Estimado:</span> R$ {showLeadDetails.valor_estimado.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {showLeadDetails.observacoes && (
                    <div>
                      <h3 className="font-semibold mb-2">Observações</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {showLeadDetails.observacoes}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="interactions" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Histórico de Interações</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Interação
                    </Button>
                  </div>
                  
                  {showLeadDetails.historico_interacoes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma interação registrada</p>
                  ) : (
                    <div className="space-y-3">
                      {showLeadDetails.historico_interacoes.map((interacao) => (
                        <Card key={interacao.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-blue-100">
                              {interacao.tipo === 'chamada' && <Phone className="h-4 w-4 text-blue-600" />}
                              {interacao.tipo === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                              {interacao.tipo === 'reuniao' && <Calendar className="h-4 w-4 text-blue-600" />}
                              {interacao.tipo === 'whatsapp' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                              {interacao.tipo === 'nota' && <Edit className="h-4 w-4 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium capitalize">{interacao.tipo}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(interacao.data).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{interacao.descricao}</p>
                              <p className="text-xs text-gray-500 mt-1">Por: {interacao.usuario}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tasks" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Tarefas & Follow-ups</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Tarefa
                    </Button>
                  </div>
                  
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma tarefa agendada</p>
                    <p className="text-sm">Adicione lembretes e follow-ups para este lead</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Lead
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar E-mail
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default Leads;

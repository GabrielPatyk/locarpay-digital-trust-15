
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight
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
}

const SDR = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    observacoes: ''
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
      dataRecebimento: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Sandra Costa',
      email: 'sandra@prediosprimos.com',
      telefone: '(11) 88888-8888',
      empresa: 'Prédios Primos',
      origem: 'Indicação',
      status: 'contato',
      dataRecebimento: '2024-01-14'
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
      executivoId: '1'
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
      observacoes: formData.observacoes
    };

    setLeads(prev => [novoLead, ...prev]);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      origem: '',
      observacoes: ''
    });
    setShowNewLeadForm(false);

    toast({
      title: "Lead adicionado com sucesso!",
      description: "O novo lead foi registrado e está disponível para contato.",
    });
  };

  const atualizarStatusLead = (leadId: string, novoStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: novoStatus } : lead
    );
    setLeads(updatedLeads);
    
    toast({
      title: "Status atualizado!",
      description: `Status do lead alterado para: ${getStatusText(novoStatus)}`,
    });
  };

  const atribuirExecutivo = (leadId: string, executivoId: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, executivoId, status: 'qualificado' as const } : lead
    );
    setLeads(updatedLeads);
    
    const executivo = executivos.find(e => e.id === executivoId);
    toast({
      title: "Lead atribuído!",
      description: `Lead atribuído para ${executivo?.nome}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500';
      case 'contato': return 'bg-warning';
      case 'qualificado': return 'bg-success';
      case 'convertido': return 'bg-primary';
      case 'perdido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato': return 'Contato Realizado';
      case 'qualificado': return 'Qualificado';
      case 'convertido': return 'Convertido';
      case 'perdido': return 'Perdido';
      default: return status;
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
  };

  const origens = [...new Set(leads.map(lead => lead.origem))];

  return (
    <Layout title="SDR - Comercial">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section with LocarPay branding */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-6 text-[#0C1C2E] relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">Bem-vindo, Maria Santos!</h1>
          <p className="opacity-90 mb-4">
            Gerencie seus leads de forma eficiente com nosso CRM integrado. Acompanhe o pipeline comercial e converta mais oportunidades.
          </p>
          <Button 
            onClick={() => navigate('/leads')}
            className="bg-white text-[#0C1C2E] hover:bg-gray-100 font-semibold shadow-md"
          >
            Ir para CRM de Leads
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Novos Leads</p>
                  <p className="text-2xl font-bold text-blue-500">{statusCounts.novo}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Contato</p>
                  <p className="text-2xl font-bold text-warning">{statusCounts.contato}</p>
                </div>
                <Phone className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualificados</p>
                  <p className="text-2xl font-bold text-success">{statusCounts.qualificado}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Convertidos</p>
                  <p className="text-2xl font-bold text-primary">{statusCounts.convertido}</p>
                </div>
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CRM Header with search and filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-primary">CRM - Gestão de Leads</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
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
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Origens</SelectItem>
                  {origens.map(origem => (
                    <SelectItem key={origem} value={origem}>{origem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowNewLeadForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Novo Lead</span>
              </Button>
            </div>
          </div>
        </div>

        {showNewLeadForm && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Lead</CardTitle>
              <CardDescription>
                Registre um novo lead para acompanhamento comercial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Nome do contato"
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
                      placeholder="email@empresa.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="empresa">Empresa *</Label>
                    <Input
                      id="empresa"
                      value={formData.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="origem">Origem do Lead *</Label>
                    <Input
                      id="origem"
                      value={formData.origem}
                      onChange={(e) => handleInputChange('origem', e.target.value)}
                      placeholder="Website, LinkedIn, Indicação..."
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre o lead"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
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

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Leads ({filteredLeads.length})</CardTitle>
            <CardDescription>
              Acompanhe o progresso de todos os seus leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{lead.nome}</h4>
                      <p className="text-sm text-gray-600 truncate">{lead.empresa}</p>
                      <p className="text-sm text-gray-500 truncate">{lead.email} | {lead.telefone}</p>
                    </div>
                    <Badge className={`${getStatusColor(lead.status)} text-white shrink-0`}>
                      {getStatusText(lead.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-500">Origem</p>
                      <p className="font-medium">{lead.origem}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Data de Recebimento</p>
                      <p className="font-medium">
                        {new Date(lead.dataRecebimento).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Executivo</p>
                      <p className="font-medium">
                        {lead.executivoId 
                          ? executivos.find(e => e.id === lead.executivoId)?.nome 
                          : 'Não atribuído'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    
                    {lead.status === 'novo' && (
                      <Button
                        size="sm"
                        onClick={() => atualizarStatusLead(lead.id, 'contato')}
                        className="bg-warning hover:bg-warning/90 text-primary"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Fazer Contato
                      </Button>
                    )}
                    
                    {lead.status === 'contato' && (
                      <Button
                        size="sm"
                        onClick={() => atualizarStatusLead(lead.id, 'qualificado')}
                        className="bg-success hover:bg-success/90"
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Qualificar
                      </Button>
                    )}
                    
                    {lead.status === 'qualificado' && !lead.executivoId && (
                      <Select onValueChange={(value) => atribuirExecutivo(lead.id, value)}>
                        <SelectTrigger className="w-fit">
                          <SelectValue placeholder="Atribuir Executivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {executivos.map(exec => (
                            <SelectItem key={exec.id} value={exec.id}>{exec.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredLeads.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum lead encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros de busca.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader>
                <CardTitle>Detalhes do Lead</CardTitle>
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

export default SDR;

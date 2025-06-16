
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Phone, 
  Mail, 
  TrendingUp, 
  Calendar,
  Plus,
  Eye,
  UserPlus
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
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
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

  const statusCounts = {
    novo: leads.filter(l => l.status === 'novo').length,
    contato: leads.filter(l => l.status === 'contato').length,
    qualificado: leads.filter(l => l.status === 'qualificado').length,
    convertido: leads.filter(l => l.status === 'convertido').length,
  };

  return (
    <Layout title="SDR - Comercial">
      <div className="space-y-6 animate-fade-in">
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

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Gestão de Leads</h2>
          <Button onClick={() => setShowNewLeadForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
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
            <CardTitle>Pipeline de Leads</CardTitle>
            <CardDescription>
              Acompanhe o progresso de todos os seus leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{lead.nome}</h4>
                      <p className="text-sm text-gray-600">{lead.empresa}</p>
                      <p className="text-sm text-gray-500">{lead.email} | {lead.telefone}</p>
                    </div>
                    <Badge className={`${getStatusColor(lead.status)} text-white`}>
                      {getStatusText(lead.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Origem</p>
                      <p className="text-sm font-medium">{lead.origem}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data de Recebimento</p>
                      <p className="text-sm font-medium">
                        {new Date(lead.dataRecebimento).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Executivo</p>
                      <p className="text-sm font-medium">
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
                      <select
                        className="px-3 py-1 text-sm border rounded"
                        onChange={(e) => atribuirExecutivo(lead.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Atribuir Executivo</option>
                        {executivos.map(exec => (
                          <option key={exec.id} value={exec.id}>{exec.nome}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Details Modal */}
        {selectedLead && (
          <Card className="fixed inset-0 z-50 m-4 max-w-2xl mx-auto mt-20 max-h-fit bg-white">
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
                <div className="grid grid-cols-2 gap-4">
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
        )}
      </div>
    </Layout>
  );
};

export default SDR;

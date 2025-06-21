
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
import { 
  Megaphone, 
  TrendingUp, 
  Eye,
  Plus,
  Calendar,
  Users,
  Mail,
  Phone,
  Target
} from 'lucide-react';

interface Campanha {
  id: string;
  nome: string;
  tipo: 'email' | 'telefone' | 'linkedin' | 'whatsapp';
  status: 'ativa' | 'pausada' | 'finalizada' | 'rascunho';
  dataInicio: string;
  dataFim?: string;
  leads: number;
  conversoes: number;
  taxaConversao: number;
  descricao: string;
}

const Campanhas = () => {
  const { toast } = useToast();
  const [showNewCampanhaForm, setShowNewCampanhaForm] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    dataInicio: '',
    dataFim: '',
    descricao: ''
  });

  // Mock data
  const [campanhas, setCampanhas] = useState<Campanha[]>([
    {
      id: '1',
      nome: 'Campanha LinkedIn Q1',
      tipo: 'linkedin',
      status: 'ativa',
      dataInicio: '2024-01-01',
      leads: 45,
      conversoes: 12,
      taxaConversao: 26.7,
      descricao: 'Campanha focada em imobiliárias de médio porte no LinkedIn'
    },
    {
      id: '2',
      nome: 'E-mail Marketing Fevereiro',
      tipo: 'email',
      status: 'finalizada',
      dataInicio: '2024-02-01',
      dataFim: '2024-02-28',
      leads: 128,
      conversoes: 34,
      taxaConversao: 26.6,
      descricao: 'Newsletter mensal com cases de sucesso'
    },
    {
      id: '3',
      nome: 'Outbound Telefônico',
      tipo: 'telefone',
      status: 'pausada',
      dataInicio: '2024-01-15',
      leads: 23,
      conversoes: 5,
      taxaConversao: 21.7,
      descricao: 'Prospecção ativa via telefone para grandes imobiliárias'
    },
    {
      id: '4',
      nome: 'WhatsApp Business',
      tipo: 'whatsapp',
      status: 'rascunho',
      dataInicio: '2024-03-01',
      leads: 0,
      conversoes: 0,
      taxaConversao: 0,
      descricao: 'Nova campanha via WhatsApp Business'
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaCampanha: Campanha = {
      id: Date.now().toString(),
      nome: formData.nome,
      tipo: formData.tipo as Campanha['tipo'],
      status: 'rascunho',
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim || undefined,
      leads: 0,
      conversoes: 0,
      taxaConversao: 0,
      descricao: formData.descricao
    };

    setCampanhas(prev => [novaCampanha, ...prev]);
    setFormData({
      nome: '',
      tipo: '',
      dataInicio: '',
      dataFim: '',
      descricao: ''
    });
    setShowNewCampanhaForm(false);

    toast({
      title: "Campanha criada com sucesso!",
      description: "A nova campanha foi salva como rascunho.",
    });
  };

  const alterarStatusCampanha = (campanhaId: string, novoStatus: Campanha['status']) => {
    const updatedCampanhas = campanhas.map(campanha => 
      campanha.id === campanhaId ? { ...campanha, status: novoStatus } : campanha
    );
    setCampanhas(updatedCampanhas);
    
    toast({
      title: "Status alterado!",
      description: `Campanha ${getStatusText(novoStatus).toLowerCase()}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'pausada': return 'bg-warning';
      case 'finalizada': return 'bg-gray-500';
      case 'rascunho': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pausada': return 'Pausada';
      case 'finalizada': return 'Finalizada';
      case 'rascunho': return 'Rascunho';
      default: return status;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'telefone': return <Phone className="h-4 w-4" />;
      case 'linkedin': return <Users className="h-4 w-4" />;
      case 'whatsapp': return <Phone className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'email': return 'E-mail';
      case 'telefone': return 'Telefone';
      case 'linkedin': return 'LinkedIn';
      case 'whatsapp': return 'WhatsApp';
      default: return tipo;
    }
  };

  const totalLeads = campanhas.reduce((acc, campanha) => acc + campanha.leads, 0);
  const totalConversoes = campanhas.reduce((acc, campanha) => acc + campanha.conversoes, 0);
  const taxaConversaoGeral = totalLeads > 0 ? (totalConversoes / totalLeads) * 100 : 0;

  return (
    <Layout title="Campanhas">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Campanhas</p>
                  <p className="text-2xl font-bold text-primary">{campanhas.length}</p>
                </div>
                <Megaphone className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
                  <p className="text-2xl font-bold text-success">
                    {campanhas.filter(c => c.status === 'ativa').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-blue-500">{totalLeads}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-warning">{taxaConversaoGeral.toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-primary">Gestão de Campanhas</h2>
          <Button onClick={() => setShowNewCampanhaForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {showNewCampanhaForm && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Campanha</CardTitle>
              <CardDescription>
                Configure uma nova campanha de prospecção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Campanha *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Nome da campanha"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Campanha *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">E-mail Marketing</SelectItem>
                        <SelectItem value="telefone">Outbound Telefônico</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataInicio">Data de Início *</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data de Fim</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => handleInputChange('dataFim', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descreva os objetivos e estratégia da campanha"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Criar Campanha
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewCampanhaForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Campanhas List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campanhas.map((campanha) => (
            <Card key={campanha.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{campanha.nome}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getTipoIcon(campanha.tipo)}
                      <span className="text-sm text-gray-600">{getTipoText(campanha.tipo)}</span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(campanha.status)} text-white shrink-0`}>
                    {getStatusText(campanha.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{campanha.descricao}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-500">{campanha.leads}</p>
                      <p className="text-xs text-gray-500">Leads</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{campanha.conversoes}</p>
                      <p className="text-xs text-gray-500">Conversões</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">{campanha.taxaConversao.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Taxa</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(campanha.dataInicio).toLocaleDateString()}
                      {campanha.dataFim && ` - ${new Date(campanha.dataFim).toLocaleDateString()}`}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCampanha(campanha)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    
                    {campanha.status === 'rascunho' && (
                      <Button
                        size="sm"
                        onClick={() => alterarStatusCampanha(campanha.id, 'ativa')}
                        className="bg-success hover:bg-success/90"
                      >
                        Ativar
                      </Button>
                    )}
                    
                    {campanha.status === 'ativa' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alterarStatusCampanha(campanha.id, 'pausada')}
                      >
                        Pausar
                      </Button>
                    )}
                    
                    {campanha.status === 'pausada' && (
                      <Button
                        size="sm"
                        onClick={() => alterarStatusCampanha(campanha.id, 'ativa')}
                        className="bg-success hover:bg-success/90"
                      >
                        Retomar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campanha Details Modal */}
        {selectedCampanha && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader>
                <CardTitle>Detalhes da Campanha</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedCampanha(null)}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <p className="font-medium">{selectedCampanha.nome}</p>
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(selectedCampanha.tipo)}
                        <span className="font-medium">{getTipoText(selectedCampanha.tipo)}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={`${getStatusColor(selectedCampanha.status)} text-white`}>
                        {getStatusText(selectedCampanha.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label>Período</Label>
                      <p className="font-medium">
                        {new Date(selectedCampanha.dataInicio).toLocaleDateString()}
                        {selectedCampanha.dataFim && ` - ${new Date(selectedCampanha.dataFim).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Descrição</Label>
                    <p className="font-medium">{selectedCampanha.descricao}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{selectedCampanha.leads}</p>
                      <p className="text-sm text-gray-600">Leads Gerados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">{selectedCampanha.conversoes}</p>
                      <p className="text-sm text-gray-600">Conversões</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">{selectedCampanha.taxaConversao.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campanhas;

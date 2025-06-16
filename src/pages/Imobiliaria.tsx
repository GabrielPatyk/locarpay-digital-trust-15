
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
  Plus, 
  User, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  PenTool,
  Eye
} from 'lucide-react';

interface Proposta {
  id: string;
  inquilinoNome: string;
  inquilinoCpf: string;
  inquilinoEmail: string;
  renda: number;
  profissao: string;
  imovel: string;
  valor: number;
  status: 'enviado' | 'analise' | 'aprovado' | 'reprovado' | 'assinado';
  dataEnvio: string;
  observacoes?: string;
}

const Imobiliaria = () => {
  const { toast } = useToast();
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    inquilinoNome: '',
    inquilinoCpf: '',
    inquilinoEmail: '',
    renda: '',
    profissao: '',
    imovel: '',
    valor: '',
    observacoes: ''
  });

  // Mock data
  const [propostas, setPropostas] = useState<Proposta[]>([
    {
      id: '1',
      inquilinoNome: 'Ana Silva',
      inquilinoCpf: '123.456.789-00',
      inquilinoEmail: 'ana@email.com',
      renda: 7000,
      profissao: 'Engenheira',
      imovel: 'Apartamento 2 quartos - Centro',
      valor: 3500,
      status: 'aprovado',
      dataEnvio: '2024-01-10'
    },
    {
      id: '2',
      inquilinoNome: 'Pedro Santos',
      inquilinoCpf: '987.654.321-00',
      inquilinoEmail: 'pedro@email.com',
      renda: 5500,
      profissao: 'Designer',
      imovel: 'Casa 3 quartos - Jardim América',
      valor: 2800,
      status: 'analise',
      dataEnvio: '2024-01-12'
    },
    {
      id: '3',
      inquilinoNome: 'Carla Oliveira',
      inquilinoCpf: '456.789.123-00',
      inquilinoEmail: 'carla@email.com',
      renda: 4000,
      profissao: 'Professora',
      imovel: 'Apartamento 1 quarto - Vila Nova',
      valor: 2200,
      status: 'reprovado',
      dataEnvio: '2024-01-08'
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
    
    const novaProposta: Proposta = {
      id: Date.now().toString(),
      inquilinoNome: formData.inquilinoNome,
      inquilinoCpf: formData.inquilinoCpf,
      inquilinoEmail: formData.inquilinoEmail,
      renda: Number(formData.renda),
      profissao: formData.profissao,
      imovel: formData.imovel,
      valor: Number(formData.valor),
      status: 'enviado',
      dataEnvio: new Date().toISOString().split('T')[0],
      observacoes: formData.observacoes
    };

    setPropostas(prev => [novaProposta, ...prev]);
    setFormData({
      inquilinoNome: '',
      inquilinoCpf: '',
      inquilinoEmail: '',
      renda: '',
      profissao: '',
      imovel: '',
      valor: '',
      observacoes: ''
    });
    setShowNewForm(false);

    toast({
      title: "Proposta enviada com sucesso!",
      description: "A proposta foi enviada para análise e você receberá uma resposta em breve.",
    });
  };

  const assinarContrato = (proposta: Proposta) => {
    const updatedPropostas = propostas.map(p => 
      p.id === proposta.id ? { ...p, status: 'assinado' as const } : p
    );
    setPropostas(updatedPropostas);
    
    toast({
      title: "Contrato assinado digitalmente!",
      description: "O inquilino receberá uma cópia por e-mail.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-success';
      case 'reprovado': return 'bg-red-500';
      case 'assinado': return 'bg-primary';
      case 'analise': return 'bg-warning';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enviado': return 'Enviado';
      case 'analise': return 'Em Análise';
      case 'aprovado': return 'Aprovado';
      case 'reprovado': return 'Reprovado';
      case 'assinado': return 'Assinado';
      default: return status;
    }
  };

  const statusCounts = {
    enviado: propostas.filter(p => p.status === 'enviado').length,
    analise: propostas.filter(p => p.status === 'analise').length,
    aprovado: propostas.filter(p => p.status === 'aprovado').length,
    assinado: propostas.filter(p => p.status === 'assinado').length,
  };

  return (
    <Layout title="Imobiliária">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enviadas</p>
                  <p className="text-2xl font-bold text-gray-800">{statusCounts.enviado}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Análise</p>
                  <p className="text-2xl font-bold text-warning">{statusCounts.analise}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-success">{statusCounts.aprovado}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assinadas</p>
                  <p className="text-2xl font-bold text-primary">{statusCounts.assinado}</p>
                </div>
                <PenTool className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Minhas Propostas</h2>
          <Button onClick={() => setShowNewForm(true)} className="bg-success hover:bg-success/90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Proposta
          </Button>
        </div>

        {showNewForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Proposta de Fiança</CardTitle>
              <CardDescription>
                Preencha os dados do locatário para enviar uma nova proposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inquilinoNome">Nome Completo *</Label>
                    <Input
                      id="inquilinoNome"
                      value={formData.inquilinoNome}
                      onChange={(e) => handleInputChange('inquilinoNome', e.target.value)}
                      placeholder="Nome completo do inquilino"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoCpf">CPF *</Label>
                    <Input
                      id="inquilinoCpf"
                      value={formData.inquilinoCpf}
                      onChange={(e) => handleInputChange('inquilinoCpf', e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquilinoEmail">E-mail *</Label>
                    <Input
                      id="inquilinoEmail"
                      type="email"
                      value={formData.inquilinoEmail}
                      onChange={(e) => handleInputChange('inquilinoEmail', e.target.value)}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="profissao">Profissão *</Label>
                    <Input
                      id="profissao"
                      value={formData.profissao}
                      onChange={(e) => handleInputChange('profissao', e.target.value)}
                      placeholder="Profissão do inquilino"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="renda">Renda Mensal (R$) *</Label>
                    <Input
                      id="renda"
                      type="number"
                      value={formData.renda}
                      onChange={(e) => handleInputChange('renda', e.target.value)}
                      placeholder="5000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor do Aluguel (R$) *</Label>
                    <Input
                      id="valor"
                      type="number"
                      value={formData.valor}
                      onChange={(e) => handleInputChange('valor', e.target.value)}
                      placeholder="2500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="imovel">Descrição do Imóvel *</Label>
                  <Input
                    id="imovel"
                    value={formData.imovel}
                    onChange={(e) => handleInputChange('imovel', e.target.value)}
                    placeholder="Ex: Apartamento 2 quartos - Bairro"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre o inquilino ou imóvel"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-success hover:bg-success/90">
                    Enviar Proposta
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Proposals List */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Propostas</CardTitle>
            <CardDescription>
              Acompanhe o status de todas as suas propostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propostas.map((proposta) => (
                <div
                  key={proposta.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{proposta.inquilinoNome}</h4>
                      <p className="text-sm text-gray-600">CPF: {proposta.inquilinoCpf}</p>
                    </div>
                    <Badge className={`${getStatusColor(proposta.status)} text-white`}>
                      {getStatusText(proposta.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Imóvel</p>
                      <p className="text-sm font-medium">{proposta.imovel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="text-sm font-medium">R$ {proposta.valor.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data de Envio</p>
                      <p className="text-sm font-medium">
                        {new Date(proposta.dataEnvio).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProposta(proposta)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    
                    {proposta.status === 'aprovado' && (
                      <Button
                        size="sm"
                        onClick={() => assinarContrato(proposta)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Assinar Contrato
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposal Details Modal */}
        {selectedProposta && (
          <Card className="fixed inset-0 z-50 m-4 max-w-2xl mx-auto mt-20 max-h-fit bg-white">
            <CardHeader>
              <CardTitle>Detalhes da Proposta</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedProposta(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <p className="font-medium">{selectedProposta.inquilinoNome}</p>
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <p className="font-medium">{selectedProposta.inquilinoCpf}</p>
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <p className="font-medium">{selectedProposta.inquilinoEmail}</p>
                  </div>
                  <div>
                    <Label>Profissão</Label>
                    <p className="font-medium">{selectedProposta.profissao}</p>
                  </div>
                  <div>
                    <Label>Renda</Label>
                    <p className="font-medium">R$ {selectedProposta.renda.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Valor do Aluguel</Label>
                    <p className="font-medium">R$ {selectedProposta.valor.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <Label>Imóvel</Label>
                  <p className="font-medium">{selectedProposta.imovel}</p>
                </div>
                {selectedProposta.observacoes && (
                  <div>
                    <Label>Observações</Label>
                    <p className="font-medium">{selectedProposta.observacoes}</p>
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

export default Imobiliaria;

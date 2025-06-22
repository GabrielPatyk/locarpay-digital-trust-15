
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  FileText, 
  User, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp
} from 'lucide-react';

interface Proposal {
  id: string;
  inquilinoNome: string;
  inquilinoCpf: string;
  renda: number;
  imovel: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'reprovado';
  score?: number;
  taxa?: number;
  dataSubmissao: string;
  imobiliaria: string;
}

const Analista = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isConsultingScore, setIsConsultingScore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      inquilinoNome: 'João Silva Santos',
      inquilinoCpf: '123.456.789-00',
      renda: 5000,
      imovel: 'Apartamento 2 quartos - Jardins',
      valor: 2500,
      status: 'pendente',
      dataSubmissao: '2024-01-15',
      imobiliaria: 'Imobiliária Prime'
    },
    {
      id: '2',
      inquilinoNome: 'Maria Oliveira',
      inquilinoCpf: '987.654.321-00',
      renda: 8000,
      imovel: 'Casa 3 quartos - Vila Madalena',
      valor: 4000,
      status: 'pendente',
      dataSubmissao: '2024-01-14',
      imobiliaria: 'Imobiliária Central'
    },
    {
      id: '3',
      inquilinoNome: 'Carlos Ferreira',
      inquilinoCpf: '456.789.123-00',
      renda: 6500,
      imovel: 'Apartamento 1 quarto - Pinheiros',
      valor: 3200,
      status: 'aprovado',
      score: 720,
      taxa: 10,
      dataSubmissao: '2024-01-13',
      imobiliaria: 'Imobiliária Top'
    }
  ]);

  const consultarScore = async (proposal: Proposal) => {
    setIsConsultingScore(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock score generation (300-900)
    const score = Math.floor(Math.random() * (900 - 300) + 300);
    
    // Calculate rate based on score
    let taxa = 15; // Default highest rate
    if (score >= 800) taxa = 8;
    else if (score >= 700) taxa = 10;
    else if (score >= 600) taxa = 12;
    else if (score >= 500) taxa = 15;
    
    const updatedProposal = {
      ...proposal,
      score,
      taxa
    };
    
    setSelectedProposal(updatedProposal);
    setIsConsultingScore(false);
    
    toast({
      title: "Score consultado com sucesso!",
      description: `Score: ${score} | Taxa aplicada: ${taxa}%`,
    });
  };

  const aprovarProposta = (proposal: Proposal) => {
    const updatedProposals = proposals.map(p => 
      p.id === proposal.id 
        ? { ...p, status: 'aprovado' as const, score: proposal.score, taxa: proposal.taxa }
        : p
    );
    setProposals(updatedProposals);
    setSelectedProposal(null);
    
    toast({
      title: "Proposta aprovada!",
      description: "Contrato será gerado e enviado para assinatura.",
    });
  };

  const reprovarProposta = (proposal: Proposal, motivo: string) => {
    const updatedProposals = proposals.map(p => 
      p.id === proposal.id 
        ? { ...p, status: 'reprovado' as const }
        : p
    );
    setProposals(updatedProposals);
    setSelectedProposal(null);
    
    toast({
      title: "Proposta reprovada",
      description: `Motivo: ${motivo}`,
      variant: "destructive"
    });
  };

  const filteredProposals = proposals.filter(p => 
    p.inquilinoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.inquilinoCpf.includes(searchTerm) ||
    p.imobiliaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = proposals.filter(p => p.status === 'pendente').length;
  const approvedCount = proposals.filter(p => p.status === 'aprovado').length;
  const rejectedCount = proposals.filter(p => p.status === 'reprovado').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <Layout title="Dashboard - Analista">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Container */}
        <div className="relative overflow-hidden rounded-xl p-6" style={{
          background: 'linear-gradient(135deg, #F4D573, #BC942C)',
        }}>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-[#0C1C2E] mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-[#0C1C2E]/80">
              Bem-vindo ao seu painel de análise de crédito. Você tem {pendingCount} {pendingCount === 1 ? 'proposta pendente' : 'propostas pendentes'} para análise.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovados</p>
                  <p className="text-2xl font-bold text-success">{approvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reprovados</p>
                  <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Média</p>
                  <p className="text-2xl font-bold text-primary">11.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proposals List */}
          <Card>
            <CardHeader>
              <CardTitle>Propostas para Análise</CardTitle>
              <CardDescription>
                Clique em uma proposta para analisar
              </CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, CPF ou imobiliária..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedProposal?.id === proposal.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{proposal.inquilinoNome}</h4>
                      <Badge variant={
                        proposal.status === 'aprovado' ? 'default' :
                        proposal.status === 'reprovado' ? 'destructive' :
                        'secondary'
                      }>
                        {proposal.status === 'aprovado' ? 'Aprovado' :
                         proposal.status === 'reprovado' ? 'Reprovado' :
                         'Pendente'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">CPF: {proposal.inquilinoCpf}</p>
                    <p className="text-sm text-gray-600 mb-1">Renda: R$ {proposal.renda.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mb-1">Valor: R$ {proposal.valor.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{proposal.imobiliaria}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Proposta</CardTitle>
              <CardDescription>
                {selectedProposal ? 'Dados detalhados da proposta selecionada' : 'Selecione uma proposta para analisar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProposal ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nome Completo</Label>
                      <p className="text-sm text-gray-900">{selectedProposal.inquilinoNome}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CPF</Label>
                      <p className="text-sm text-gray-900">{selectedProposal.inquilinoCpf}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Renda Mensal</Label>
                      <p className="text-sm text-gray-900">R$ {selectedProposal.renda.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valor do Aluguel</Label>
                      <p className="text-sm text-gray-900">R$ {selectedProposal.valor.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Imóvel</Label>
                    <p className="text-sm text-gray-900">{selectedProposal.imovel}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Imobiliária</Label>
                    <p className="text-sm text-gray-900">{selectedProposal.imobiliaria}</p>
                  </div>

                  {selectedProposal.score && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Score de Crédito:</strong> {selectedProposal.score} pontos<br />
                        <strong>Taxa Aplicada:</strong> {selectedProposal.taxa}%
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedProposal.status === 'pendente' && (
                    <div className="space-y-3">
                      {!selectedProposal.score && (
                        <Button
                          onClick={() => consultarScore(selectedProposal)}
                          disabled={isConsultingScore}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          {isConsultingScore ? 'Consultando Score...' : 'Consultar Score de Crédito'}
                        </Button>
                      )}

                      {selectedProposal.score && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => aprovarProposta(selectedProposal)}
                            className="flex-1 bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprovar
                          </Button>
                          <Button
                            onClick={() => reprovarProposta(selectedProposal, 'Score insuficiente')}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reprovar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="mx-auto h-12 w-12 mb-4" />
                  <p>Selecione uma proposta na lista ao lado para começar a análise</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analista;

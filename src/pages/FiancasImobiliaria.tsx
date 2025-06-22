import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFiancas } from '@/hooks/useFiancas';
import { useAuth } from '@/contexts/AuthContext';
import CriarFiancaModal from '@/components/CriarFiancaModal';
import AdicionarLinkPagamentoModal from '@/components/AdicionarLinkPagamentoModal';
import { 
  Search, 
  Eye, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Users,
  Building,
  AlertCircle
} from 'lucide-react';

interface Fianca {
  id: string;
  inquilino_nome_completo: string;
  inquilino_email: string;
  imovel_endereco: string;
  imovel_valor_aluguel: number;
  status_fianca: 
    'em_analise' | 
    'aprovada' | 
    'rejeitada' | 
    'ativa' | 
    'vencida' | 
    'cancelada' | 
    'enviada_ao_financeiro' | 
    'aguardando_geracao_pagamento' |
    'pagamento_disponivel' |
    'comprovante_enviado';
  data_criacao: string;
  taxa_aplicada: number;
  link_pagamento: string | null;
}

const FiancasImobiliaria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedFiancaId, setSelectedFiancaId] = useState<string>('');

  const { 
    fiancas, 
    isLoading, 
    error, 
    refetch 
  } = useFiancas(user?.id || '', search);

  const handleAguardandoPagamento = (fiancaId: string) => {
    setSelectedFiancaId(fiancaId);
    setShowLinkModal(true);
  };

  const handleLinkModalClose = () => {
    setShowLinkModal(false);
    setSelectedFiancaId('');
    refetch(); // Refresh data after adding link
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_analise': return 'bg-gray-400';
      case 'aprovada': return 'bg-green-500';
      case 'rejeitada': return 'bg-red-500';
      case 'ativa': return 'bg-blue-500';
      case 'vencida': return 'bg-orange-500';
      case 'cancelada': return 'bg-red-700';
      case 'enviada_ao_financeiro': return 'bg-purple-500';
      case 'aguardando_geracao_pagamento': return 'bg-yellow-500 text-gray-800';
      case 'pagamento_disponivel': return 'bg-lime-500 text-gray-800';
      case 'comprovante_enviado': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_analise': return 'Em Análise';
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      case 'ativa': return 'Ativa';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      case 'enviada_ao_financeiro': return 'Enviada ao Financeiro';
      case 'aguardando_geracao_pagamento': return 'Aguardando Link';
      case 'pagamento_disponivel': return 'Pagamento Disponível';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Layout title="Gestão de Fianças">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Gestão de Fianças">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500">Erro ao carregar as fianças.</p>
            <Button onClick={refetch} variant="outline">Tentar Novamente</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Fianças">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold">
            Suas Fianças <Badge className="ml-2">{fiancas?.length || 0}</Badge>
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-x-2 sm:space-y-0">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar..."
                className="pr-10"
                value={search}
                onChange={handleSearch}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <Button onClick={() => setShowModal(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Criar Nova Fiança
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>
              Estatísticas sobre suas fianças locatícias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center p-4 rounded-md bg-card text-card-foreground shadow-sm">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Fianças Ativas</div>
                  <div className="text-2xl font-bold">{fiancas?.filter(f => f.status_fianca === 'ativa').length || 0}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-md bg-card text-card-foreground shadow-sm">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Em Análise</div>
                  <div className="text-2xl font-bold">{fiancas?.filter(f => f.status_fianca === 'em_analise').length || 0}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-md bg-card text-card-foreground shadow-sm">
                <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Aguardando Pagamento</div>
                  <div className="text-2xl font-bold">{fiancas?.filter(f => f.status_fianca === 'aguardando_geracao_pagamento').length || 0}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-md bg-card text-card-foreground shadow-sm">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Total de Inquilinos</div>
                  <div className="text-2xl font-bold">{fiancas?.length || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fiança List */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {fiancas?.map((fianca) => (
            <Card key={fianca.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  {fianca.inquilino_nome_completo}
                </CardTitle>
                <CardDescription>
                  {fianca.imovel_endereco}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Aluguel</div>
                  <div className="text-sm">R$ {fianca.imovel_valor_aluguel}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Status</div>
                  <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                    {getStatusText(fianca.status_fianca)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Criada em</div>
                  <div className="text-sm">{new Date(fianca.data_criacao).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Taxa Aplicada</div>
                  <div className="text-sm">{fianca.taxa_aplicada}%</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Detalhes
                  </Button>
                  {fianca.status_fianca === 'aguardando_geracao_pagamento' && (
                    <Button
                      size="sm"
                      onClick={() => handleAguardandoPagamento(fianca.id)}
                      className="bg-warning hover:bg-warning/90 text-primary"
                    >
                      Adicionar Link
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {fiancas?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
              <AlertCircle className="h-10 w-10 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-700">Nenhuma Fiança Encontrada</h2>
              <p className="text-gray-500">
                Parece que não há nenhuma fiança cadastrada para sua imobiliária.
              </p>
              <Button onClick={() => setShowModal(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Criar Nova Fiança
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CriarFiancaModal isOpen={showModal} onClose={() => setShowModal(false)} refetch={refetch} />
      
      <AdicionarLinkPagamentoModal
        isOpen={showLinkModal}
        onClose={handleLinkModalClose}
        fiancaId={selectedFiancaId}
        onSuccess={handleLinkModalClose}
      />
    </Layout>
  );
};

export default FiancasImobiliaria;

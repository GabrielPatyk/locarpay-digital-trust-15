
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CriarFiancaModal from '@/components/CriarFiancaModal';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Search,
  Plus,
  Eye,
  Calendar,
  MapPin,
  User,
  DollarSign
} from 'lucide-react';

const FiancasImobiliaria = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: fiancas = [], isLoading, refetch } = useQuery({
    queryKey: ['fiancas-imobiliaria', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const filteredFiancas = fiancas.filter(fianca =>
    fianca.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.inquilino_cpf.includes(searchTerm) ||
    fianca.imovel_endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas
  const totalFiancas = fiancas.length;
  const fiancasEmAnalise = fiancas.filter(f => f.status_fianca === 'em_analise').length;
  const fiancasAprovadas = fiancas.filter(f => f.status_fianca === 'aprovada' || f.status_fianca === 'ativa').length;
  const receitaTotal = fiancas
    .filter(f => f.valor_fianca)
    .reduce((total, f) => total + (f.valor_fianca || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'aprovada': return 'bg-blue-100 text-blue-800';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800';
      case 'enviada_ao_financeiro': return 'bg-purple-100 text-purple-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'vencida': return 'bg-gray-100 text-gray-800';
      case 'cancelada': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'aprovada': return 'Aprovada';
      case 'em_analise': return 'Em Análise';
      case 'enviada_ao_financeiro': return 'Enviada ao Financeiro';
      case 'rejeitada': return 'Rejeitada';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <Layout title="Fianças">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-6 text-[#0C1C2E]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Gestão de Fianças</h1>
              <p className="opacity-90">Gerencie e acompanhe todas as suas fianças locatícias</p>
            </div>
            <FileText className="h-12 w-12 opacity-50" />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fianças</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalFiancas}</div>
              <p className="text-xs text-muted-foreground">
                Fianças cadastradas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{fiancasEmAnalise}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando análise
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{fiancasAprovadas}</div>
              <p className="text-xs text-muted-foreground">
                Fianças aprovadas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">R$ {receitaTotal.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground">
                Valor total arrecadado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Busca e Nova Fiança */}
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar fianças por inquilino, CPF ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="ml-4">
            <Plus className="mr-2 h-4 w-4" />
            Nova Fiança
          </Button>
        </div>

        {/* Lista de Fianças */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFiancas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhuma fiança encontrada' : 'Nenhuma fiança cadastrada'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Tente ajustar sua busca.'
                    : 'Comece criando sua primeira fiança.'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Fiança
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredFiancas.map((fianca) => (
              <Card key={fianca.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Fiança #{fianca.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(fianca.status_fianca)}>
                          {getStatusLabel(fianca.status_fianca)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Valor do Aluguel</p>
                      <p className="text-xl font-bold text-primary">
                        R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
                      </p>
                      {fianca.valor_fianca && (
                        <p className="text-sm text-purple-600 font-medium">
                          Fiança: R$ {fianca.valor_fianca.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Inquilino</p>
                        <p className="font-medium">{fianca.inquilino_nome_completo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Imóvel</p>
                        <p className="font-medium">{fianca.imovel_endereco}, {fianca.imovel_cidade}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Criada em {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Seção de Ajuda */}
        <Card>
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Documentação</h3>
                <p className="text-sm text-gray-600">
                  Consulte nossa documentação completa sobre o processo de fianças
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-green-100 p-3 rounded-full inline-block mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Suporte Técnico</h3>
                <p className="text-sm text-gray-600">
                  Entre em contato conosco para esclarecimentos técnicos
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-purple-100 p-3 rounded-full inline-block mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Relatórios</h3>
                <p className="text-sm text-gray-600">
                  Acesse relatórios detalhados sobre suas fianças
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CriarFiancaModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </Layout>
  );
};

export default FiancasImobiliaria;

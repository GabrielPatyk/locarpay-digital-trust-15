
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CriarFiancaModal from '@/components/CriarFiancaModal';
import FiancaStatusTooltip from '@/components/FiancaStatusTooltip';
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
  DollarSign,
  Filter
} from 'lucide-react';

const FiancasImobiliaria = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
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

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = fianca.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fianca.inquilino_cpf.includes(searchTerm) ||
      fianca.imovel_endereco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || fianca.status_fianca === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handleViewFianca = (fiancaId: string) => {
    // Implementar navegação para detalhes da fiança
    console.log('Ver fiança:', fiancaId);
  };

  const handleAcceptFianca = (fiancaId: string) => {
    // Implementar aceitação da fiança
    console.log('Aceitar fiança:', fiancaId);
  };

  return (
    <Layout title="Fianças">
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-4 lg:p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-4 sm:p-6 text-[#0C1C2E]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Gestão de Fianças</h1>
              <p className="opacity-90 text-sm sm:text-base">Gerencie e acompanhe todas as suas fianças locatícias</p>
            </div>
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 opacity-50" />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fianças</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-primary">{totalFiancas}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-warning">{fiancasEmAnalise}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-success">{fiancasAprovadas}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-info">R$ {receitaTotal.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground">
                Valor total arrecadado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fianças */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Lista de Fianças</CardTitle>
              {/* Filtros e botão Nova Fiança */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="aprovada">Aprovadas</SelectItem>
                    <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                    <SelectItem value="ativa">Ativas</SelectItem>
                    <SelectItem value="vencida">Vencidas</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="sm:inline">Nova Fiança</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-2 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Tabela responsiva com scroll horizontal em mobile */}
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <Table className="min-w-[600px] lg:min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px] sm:w-[150px]">Inquilino</TableHead>
                        <TableHead className="w-[200px] lg:w-[250px]">Imóvel</TableHead>
                        <TableHead className="w-[100px]">Valor</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="hidden sm:table-cell w-[100px]">Data</TableHead>
                        <TableHead className="w-[80px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiancas.map((fianca) => (
                        <TableRow key={fianca.id}>
                          {/* Celulas com ajustes para mobile */}
                          <TableCell className="font-medium py-2 px-2">
                            <div className="line-clamp-2 text-xs sm:text-sm">
                              {fianca.inquilino_nome_completo}
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-2 px-2">
                            <div className="line-clamp-1 text-xs sm:text-sm">
                              {`${fianca.imovel_endereco}, ${fianca.imovel_numero}`}
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {fianca.imovel_bairro}
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-2 px-2 text-xs sm:text-sm">
                            {formatCurrency(fianca.imovel_valor_aluguel)}
                          </TableCell>
                          
                          <TableCell className="py-2 px-2">
                            <FiancaStatusTooltip
                              status={fianca.status_fianca}
                              motivo_reprovacao={fianca.motivo_reprovacao}
                              data_atualizacao={fianca.data_atualizacao}
                              analista="Sistema"
                            >
                              <Badge className={`${getStatusColor(fianca.status_fianca)} text-xs cursor-pointer hover:opacity-80`}>
                                {getStatusLabel(fianca.status_fianca)}
                              </Badge>
                            </FiancaStatusTooltip>
                          </TableCell>
                          
                          <TableCell className="hidden sm:table-cell py-2 px-2 text-xs">
                            {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                          </TableCell>
                          
                          <TableCell className="py-2 px-1">
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 sm:h-8 sm:w-8"
                                onClick={() => handleViewFianca(fianca.id)}
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              {fianca.status_fianca === 'aprovada' && (
                                <Button 
                                  size="icon"
                                  className="h-7 w-7 sm:h-8 sm:w-8 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleAcceptFianca(fianca.id)}
                                >
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mensagem quando não há resultados */}
                {filteredFiancas.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium">Nenhuma fiança encontrada</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchTerm ? "Tente ajustar sua busca" : "Adicione uma nova fiança"}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Seção de Ajuda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Precisa de Ajuda?</CardTitle>
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

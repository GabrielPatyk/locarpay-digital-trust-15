
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CriarFiancaModal from '@/components/CriarFiancaModal';
import AguardandoPagamentoTooltip from '@/components/AguardandoPagamentoTooltip';
import { useFiancas } from '@/hooks/useFiancas';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Eye
} from 'lucide-react';

const formatImovelTipo = (tipo: string) => {
  if (!tipo) return '';
  return tipo
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const FiancasImobiliaria = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fiancas, isLoading, stats } = useFiancas();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'aprovada': return 'bg-green-500';
      case 'em_analise': return 'bg-blue-500';
      case 'rejeitada': return 'bg-red-500';
      case 'enviada_ao_financeiro': return 'bg-purple-500';
      case 'pagamento_disponivel': return 'bg-orange-500';
      case 'comprovante_enviado': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'aprovada': return 'Aprovada';
      case 'em_analise': return 'Em Análise';
      case 'rejeitada': return 'Rejeitada';
      case 'enviada_ao_financeiro': return 'Enviada ao Financeiro';
      case 'pagamento_disponivel': return 'Pagamento Disponível';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      default: return status;
    }
  };

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = 
      fianca.inquilino_nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fianca.inquilino_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatImovelTipo(fianca.imovel_tipo)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fianca.status_fianca === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Layout title="Gestão de Fianças">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Carregando fianças...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Fianças">
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary to-success text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Gestão de Fianças Locatícias</h2>
                <p className="opacity-90 text-sm sm:text-base">
                  Crie e acompanhe todas as solicitações de fianças da sua imobiliária.
                </p>
              </div>
              <Building className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Análise</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-500">{stats.emAnalise}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Aprovadas</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{stats.aprovadas}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Rejeitadas</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-500">{stats.rejeitadas}</p>
                </div>
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Ativas</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{stats.ativas}</p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Valor Total</p>
                  <p className="text-sm sm:text-lg font-bold">R$ {stats.valorTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-success hover:bg-success/90 w-full sm:w-auto"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Nova Fiança
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full sm:w-auto">
            <div className="flex items-center space-x-2 flex-1 w-full">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por inquilino, e-mail ou imóvel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="enviada_ao_financeiro">Enviada ao Financeiro</SelectItem>
                  <SelectItem value="pagamento_disponivel">Pagamento Disponível</SelectItem>
                  <SelectItem value="comprovante_enviado">Comprovante Enviado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Fianças List */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Suas Fianças Locatícias</CardTitle>
            <CardDescription className="text-sm">
              Acompanhe o status e gerencie todas as suas solicitações de fiança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFiancas.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {fiancas.length === 0 
                      ? "Ainda não há fianças criadas. Clique em 'Nova Fiança' para começar."
                      : "Nenhuma fiança encontrada com os filtros aplicados."
                    }
                  </p>
                </div>
              ) : (
                filteredFiancas.map((fianca) => (
                  <Card key={fianca.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {/* Informações do Inquilino */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{fianca.inquilino_nome_completo}</h4>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <p><strong>E-mail:</strong> {fianca.inquilino_email}</p>
                            <p><strong>CPF:</strong> {fianca.inquilino_cpf}</p>
                            <p><strong>WhatsApp:</strong> {fianca.inquilino_whatsapp}</p>
                            <p><strong>Renda:</strong> R$ {Number(fianca.inquilino_renda_mensal).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {/* Informações do Imóvel */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">{formatImovelTipo(fianca.imovel_tipo)}</h5>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {fianca.imovel_endereco}, {fianca.imovel_numero} - {fianca.imovel_bairro}, {fianca.imovel_cidade}/{fianca.imovel_estado}
                          </p>
                          <p className="text-sm font-semibold text-success">
                            R$ {Number(fianca.imovel_valor_aluguel).toLocaleString()}/mês
                          </p>
                        </div>
                        
                        {/* Status e Ações */}
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            {fianca.status_fianca === 'pagamento_disponivel' ? (
                              <AguardandoPagamentoTooltip
                                valorFianca={Number(fianca.imovel_valor_aluguel)}
                                nomeInquilino={fianca.inquilino_nome_completo}
                                dataEnvio={fianca.data_envio_link}
                              >
                                <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-pointer hover:opacity-80`}>
                                  {getStatusText(fianca.status_fianca)}
                                </Badge>
                              </AguardandoPagamentoTooltip>
                            ) : (
                              <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                                {getStatusText(fianca.status_fianca)}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-500">
                            <p><strong>Criado:</strong> {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</p>
                            {fianca.data_analise && (
                              <p><strong>Analisado:</strong> {new Date(fianca.data_analise).toLocaleDateString('pt-BR')}</p>
                            )}
                            {fianca.score_credito && (
                              <p><strong>Score:</strong> {fianca.score_credito}</p>
                            )}
                            {fianca.taxa_aplicada && (
                              <p><strong>Taxa:</strong> {fianca.taxa_aplicada}%</p>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/detalhe-fianca/${fianca.id}`)}
                            className="w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>

                      {/* Motivo de Rejeição */}
                      {fianca.status_fianca === 'rejeitada' && fianca.motivo_reprovacao && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Motivo da rejeição:</strong> {fianca.motivo_reprovacao}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Criação */}
        <CriarFiancaModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;

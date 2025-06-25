
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import { 
  DollarSign, 
  CreditCard, 
  Send, 
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Users,
  Link as LinkIcon,
  Eye,
  Search,
  Filter,
  Receipt
} from 'lucide-react';
import AdicionarLinkPagamentoModal from '@/components/AdicionarLinkPagamentoModal';
import AguardandoPagamentoTooltip from '@/components/AguardandoPagamentoTooltip';

const Financeiro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fiancas, isLoading, atualizarStatusFianca, isUpdating, getStats, error } = useFinanceiro();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFianca, setSelectedFianca] = useState<any>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  console.log('Dados do financeiro:', { fiancas, isLoading, error });

  const stats = getStats();

  const confirmarPagamento = async (id: string) => {
    try {
      await atualizarStatusFianca.mutateAsync({
        fiancaId: id,
        novoStatus: 'assinatura_imobiliaria'
      });

      toast({
        title: "Pagamento confirmado!",
        description: "Fiança enviada para assinatura da imobiliária.",
      });
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao confirmar pagamento.",
        variant: "destructive"
      });
    }
  };

  const verComprovante = (comprovante: string) => {
    if (comprovante) {
      window.open(comprovante, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'comprovante_enviado': return 'bg-green-600';
      case 'pagamento_disponivel': return 'bg-blue-500';
      case 'enviada_ao_financeiro': return 'bg-warning';
      case 'aprovada': return 'bg-orange-500';
      case 'assinatura_imobiliaria': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      case 'pagamento_disponivel': return 'Link Disponível';
      case 'enviada_ao_financeiro': return 'Aguardando Link';
      case 'aprovada': return 'Aprovada';
      case 'assinatura_imobiliaria': return 'Aguardando Assinatura';
      default: return status;
    }
  };

  const formatImovelTipo = (tipo: string) => {
    if (!tipo) return '';
    return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
  };

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = 
      fianca.inquilino_nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fianca.inquilino_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fianca.imovel_tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fianca.status_fianca === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular estatísticas com valores de fiança
  const calcularStats = () => {
    const totalFiancas = fiancas.length;
    const aguardandoLink = fiancas.filter(f => f.status_fianca === 'enviada_ao_financeiro').length;
    const linkEnviado = fiancas.filter(f => f.status_fianca === 'pagamento_disponivel').length;
    const pagos = fiancas.filter(f => f.status_fianca === 'comprovante_enviado').length;
    
    const valorTotal = fiancas.reduce((acc, f) => acc + (f.valor_fianca || 0), 0);
    const valorPago = fiancas
      .filter(f => ['comprovante_enviado', 'ativa'].includes(f.status_fianca))
      .reduce((acc, f) => acc + (f.valor_fianca || 0), 0);

    return {
      totalFiancas,
      aguardandoLink,
      linkEnviado,
      pagos,
      valorTotal,
      valorPago
    };
  };

  const statsComValorFianca = calcularStats();

  if (isLoading) {
    return (
      <Layout title="Departamento Financeiro">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados financeiros...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Departamento Financeiro">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Departamento Financeiro">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Departamento Financeiro</h2>
                <p className="opacity-90 text-sm sm:text-base">
                  Gerencie pagamentos de fianças, anexe links de pagamento e confirme transações.
                </p>
              </div>
              <DollarSign className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Fianças</p>
                  <p className="text-lg sm:text-2xl font-bold">{statsComValorFianca.totalFiancas}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Aguardando</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{statsComValorFianca.aguardandoLink}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Enviados</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-500">{statsComValorFianca.linkEnviado}</p>
                </div>
                <Send className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Pagos</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{statsComValorFianca.pagos}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#BC942C]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Valor Total</p>
                  <p className="text-lg sm:text-2xl font-bold">R$ {statsComValorFianca.valorTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-[#BC942C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Recebido</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">R$ {statsComValorFianca.valorPago.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por inquilino, e-mail ou imóvel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="enviada_ao_financeiro">Aguardando Link</SelectItem>
                <SelectItem value="pagamento_disponivel">Link Disponível</SelectItem>
                <SelectItem value="comprovante_enviado">Comprovante Enviado</SelectItem>
                <SelectItem value="assinatura_imobiliaria">Aguardando Assinatura</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gestão de Fianças */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Gestão de Fianças Locatícias</CardTitle>
            <CardDescription className="text-sm">
              Gerencie links de pagamento e confirme recebimentos das fianças aprovadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFiancas.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {fiancas.length === 0 
                      ? "Nenhuma fiança encontrada para o departamento financeiro."
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
                          <h4 className="font-semibold text-gray-900 text-lg">{fianca.inquilino_nome_completo}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>E-mail:</strong> {fianca.inquilino_email}</p>
                            <p><strong>CPF:</strong> {fianca.inquilino_cpf}</p>
                          </div>
                        </div>
                        
                        {/* Informações do Imóvel */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">{formatImovelTipo(fianca.imovel_tipo)}</h5>
                          <p className="text-sm text-gray-600">
                            {fianca.imovel_endereco}, {fianca.imovel_numero} - {fianca.imovel_bairro}, {fianca.imovel_cidade}/{fianca.imovel_estado}
                          </p>
                        </div>
                        
                        {/* Informações Financeiras */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">
                              R$ {Number(fianca.valor_fianca || 0).toLocaleString()}
                            </span>
                            {fianca.status_fianca === 'pagamento_disponivel' ? (
                              <AguardandoPagamentoTooltip
                                valorFianca={Number(fianca.valor_fianca || 0)}
                                nomeInquilino={fianca.inquilino_nome_completo}
                                dataEnvio={fianca.data_envio_link}
                              >
                                <Badge className={`${getStatusColor(fianca.status_fianca)} text-white cursor-pointer`}>
                                  {getStatusText(fianca.status_fianca)}
                                </Badge>
                              </AguardandoPagamentoTooltip>
                            ) : (
                              <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                                {getStatusText(fianca.status_fianca)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Criado em:</strong> {new Date(fianca.data_criacao).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/detalhe-fianca/${fianca.id}`)}
                          className="flex items-center"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver Detalhes
                        </Button>

                        {fianca.status_fianca === 'enviada_ao_financeiro' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedFianca(fianca);
                              setShowLinkModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 flex items-center"
                            disabled={isUpdating}
                          >
                            <LinkIcon className="mr-1 h-4 w-4" />
                            Anexar Link
                          </Button>
                        )}

                        {fianca.status_fianca === 'pagamento_disponivel' && (
                          <Button
                            size="sm"
                            onClick={() => confirmarPagamento(fianca.id)}
                            className="bg-success hover:bg-success/90 flex items-center"
                            disabled={isUpdating}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Confirmar Pagamento
                          </Button>
                        )}

                        {fianca.status_fianca === 'comprovante_enviado' && (
                          <>
                            {fianca.comprovante_pagamento && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => verComprovante(fianca.comprovante_pagamento)}
                                className="flex items-center"
                              >
                                <Receipt className="mr-1 h-4 w-4" />
                                Ver Comprovante
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => confirmarPagamento(fianca.id)}
                              className="bg-success hover:bg-success/90 flex items-center"
                              disabled={isUpdating}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Confirmar Pagamento
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal para anexar link */}
        <AdicionarLinkPagamentoModal
          isOpen={showLinkModal}
          onClose={() => {
            setShowLinkModal(false);
            setSelectedFianca(null);
          }}
          fiancaId={selectedFianca?.id || ''}
          onSuccess={() => {
            // Refresh da lista será feito automaticamente pelo React Query
          }}
        />
      </div>
    </Layout>
  );
};

export default Financeiro;

import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInquilinoData } from '@/hooks/useInquilinoData';
import { useAuth } from '@/contexts/AuthContext';
import ComprovanteUpload from '@/components/ComprovanteUpload';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

const Inquilino = () => {
  const { user } = useAuth();
  const { fiancaAtiva, fiancaPagamento, emailVerificado, isLoading, enviarComprovante } = useInquilinoData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'pagamento_disponivel': return 'bg-blue-500';
      case 'comprovante_enviado': return 'bg-green-600';
      case 'aprovada': return 'bg-orange-500';
      case 'em_analise': return 'bg-warning';
      case 'rejeitada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pagamento_disponivel': return 'Pagamento Disponível';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      case 'aprovada': return 'Aprovada';
      case 'em_analise': return 'Em Análise';
      case 'rejeitada': return 'Rejeitada';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  const handlePagarFianca = () => {
    const fiancaParaExibir = fiancaAtiva || fiancaPagamento;
    if (fiancaParaExibir?.link_pagamento) {
      window.open(fiancaParaExibir.link_pagamento, '_blank');
    }
  };

  const handleComprovanteUpload = (filePath: string) => {
    const fiancaParaExibir = fiancaAtiva || fiancaPagamento;
    if (fiancaParaExibir) {
      enviarComprovante.mutate({
        fiancaId: fiancaParaExibir.id,
        comprovantePath: filePath
      });
    }
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard - Inquilino">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const fiancaParaExibir = fiancaAtiva || fiancaPagamento;

  return (
    <Layout title="Dashboard - Inquilino">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Container */}
        <div className="relative overflow-hidden rounded-xl p-6" style={{
          background: 'linear-gradient(135deg, #F4D573, #BC942C)',
        }}>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-[#0C1C2E] mb-2">
              Olá, {user?.name}! 👋
            </h1>
            <p className="text-[#0C1C2E]/80">
              Bem-vindo ao seu painel do inquilino. Aqui você pode acompanhar o status da sua fiança locatícia.
            </p>
            {fiancaParaExibir?.perfil_imobiliaria?.[0]?.nome_empresa && (
              <p className="text-[#0C1C2E]/70 text-sm mt-1">
                Imobiliária: {fiancaParaExibir.perfil_imobiliaria[0].nome_empresa}
              </p>
            )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Email Verification Alert */}
        {!emailVerificado && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">E-mail não verificado</p>
                  <p className="text-sm text-orange-700">
                    Verifique seu e-mail para ter acesso completo às funcionalidades.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status da Fiança</p>
                  {fiancaParaExibir ? (
                    <Badge className={`${getStatusColor(fiancaParaExibir.status_fianca)} text-white mt-1`}>
                      {getStatusText(fiancaParaExibir.status_fianca)}
                    </Badge>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhuma fiança ativa</p>
                  )}
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor da Fiança</p>
                  <p className="text-2xl font-bold text-primary">
                    {fiancaParaExibir ? formatCurrency(Number(fiancaParaExibir.valor_fianca || 0)) : 'R$ 0,00'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">E-mail</p>
                  <div className="flex items-center space-x-2">
                    {emailVerificado ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                    <span className="text-sm">
                      {emailVerificado ? 'Verificado' : 'Não verificado'}
                    </span>
                  </div>
                </div>
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Meus Dados
              </CardTitle>
              <CardDescription>
                Informações da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome</p>
                    <p className="text-base">{user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">E-mail</p>
                    <p className="text-base">{user?.email}</p>
                  </div>
                </div>
                
                {user?.telefone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p className="text-base">{user.telefone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status da Fiança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Status da Fiança
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso da sua solicitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fiancaParaExibir ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status Atual:</span>
                    <Badge className={`${getStatusColor(fiancaParaExibir.status_fianca)} text-white`}>
                      {getStatusText(fiancaParaExibir.status_fianca)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {fiancaParaExibir.perfil_imobiliaria?.[0]?.nome_empresa && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Imobiliária</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {fiancaParaExibir.perfil_imobiliaria[0].nome_empresa}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-500">Valor do Aluguel</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(Number(fiancaParaExibir.imovel_valor_aluguel || 0))}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Valor da Fiança</p>
                      <p className="text-lg font-semibold text-primary">
                        {formatCurrency(Number(fiancaParaExibir.valor_fianca || 0))}
                      </p>
                      {fiancaParaExibir.score_credito && fiancaParaExibir.taxa_aplicada && (
                        <div className="text-xs text-gray-500 mt-1">
                          <p>Score: {fiancaParaExibir.score_credito}</p>
                          <p>Taxa: {fiancaParaExibir.taxa_aplicada ? formatPercent(Number(fiancaParaExibir.taxa_aplicada)) : 'N/A'}</p>
                          <p>Valor Total: {formatCurrency(Number(fiancaParaExibir.valor_total_locacao || fiancaParaExibir.imovel_valor_aluguel || 0))} ({fiancaParaExibir.imovel_tempo_locacao || 0} Meses)</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Tempo de Locação</p>
                      <p className="text-base">{fiancaParaExibir.imovel_tempo_locacao} meses</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Endereço do Imóvel</p>
                      <p className="text-sm text-gray-700">
                        {fiancaParaExibir.imovel_endereco}, {fiancaParaExibir.imovel_numero} - {fiancaParaExibir.imovel_bairro}, {fiancaParaExibir.imovel_cidade}/{fiancaParaExibir.imovel_estado}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                      <p className="text-base">
                        {new Date(fiancaParaExibir.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Ação para pagamento disponível */}
                  {fiancaParaExibir.status_fianca === 'pagamento_disponivel' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-3">
                      <div>
                        <p className="font-medium text-blue-900">Pagamento Disponível</p>
                        <p className="text-sm text-blue-700">
                          Realize o pagamento e envie o comprovante
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {fiancaParaExibir.link_pagamento && (
                          <Button
                            onClick={handlePagarFianca}
                            className="bg-blue-600 hover:bg-blue-700 w-full"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Pagar Fiança
                          </Button>
                        )}
                        <ComprovanteUpload
                          onUploadSuccess={handleComprovanteUpload}
                          disabled={enviarComprovante.isPending}
                        />
                      </div>
                    </div>
                  )}

                  {fiancaParaExibir.status_fianca === 'comprovante_enviado' && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🔎</div>
                        <div>
                          <p className="font-medium text-orange-900 mb-2">Comprovante recebido!</p>
                          <div className="text-sm text-orange-800 space-y-1">
                            <p>Agradecemos por enviar o comprovante de pagamento.</p>
                            <p>Nosso time financeiro está analisando as informações e essa verificação pode levar alguns minutos.</p>
                            <p>Por favor, aguarde os próximos passos para a assinatura da fiança.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {fiancaParaExibir.status_fianca === 'ativa' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Fiança Ativa</p>
                          <p className="text-sm text-green-700">
                            Sua fiança está ativa e válida
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Você não possui nenhuma fiança ativa no momento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Inquilino;

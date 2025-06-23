
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  CheckCircle, 
  ExternalLink,
  Mail,
  Download,
  CreditCard,
  Shield,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useInquilinoData } from '@/hooks/useInquilinoData';
import ComprovanteUpload from '@/components/ComprovanteUpload';

const Inquilino = () => {
  const { toast } = useToast();
  const { 
    fiancaAtiva, 
    fiancaPagamento, 
    emailVerificado, 
    isLoading, 
    enviarComprovante,
    errors
  } = useInquilinoData();

  console.log('Dados do hook:', {
    fiancaAtiva,
    fiancaPagamento,
    emailVerificado,
    isLoading,
    errors
  });

  const baixarContrato = () => {
    toast({
      title: "Download iniciado",
      description: "O contrato está sendo baixado em formato PDF.",
    });
  };

  const acessarLinkPagamento = () => {
    if (fiancaPagamento?.link_pagamento) {
      window.open(fiancaPagamento.link_pagamento, '_blank');
    } else {
      toast({
        title: "Link indisponível",
        description: "O link de pagamento ainda não está disponível.",
        variant: "destructive"
      });
    }
  };

  const handleComprovanteUpload = async (filePath: string) => {
    if (fiancaPagamento?.id) {
      try {
        await enviarComprovante.mutateAsync({
          fiancaId: fiancaPagamento.id,
          comprovantePath: filePath
        });
      } catch (error) {
        console.error('Erro ao enviar comprovante:', error);
      }
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível identificar a fiança para envio do comprovante.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-500';
      case 'pagamento_disponivel': return 'bg-yellow-500';
      case 'comprovante_enviado': return 'bg-blue-500';
      case 'pendente': return 'bg-yellow-500';
      case 'vencido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativo';
      case 'pagamento_disponivel': return 'Pagamento Disponível';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      case 'pendente': return 'Pendente';
      case 'vencido': return 'Vencido';
      default: return status;
    }
  };

  // Mostrar erro se houver problemas nas queries
  if (errors.fiancaError || errors.pagamentoError || errors.emailError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-700">Erro ao carregar dados</h3>
                <p className="text-red-600 text-sm mt-1">
                  Ocorreu um erro ao carregar seus dados. Tente recarregar a página.
                </p>
                {errors.fiancaError && (
                  <p className="text-xs text-red-500 mt-1">
                    Erro fiança: {errors.fiancaError.message}
                  </p>
                )}
                {errors.pagamentoError && (
                  <p className="text-xs text-red-500 mt-1">
                    Erro pagamento: {errors.pagamentoError.message}
                  </p>
                )}
                {errors.emailError && (
                  <p className="text-xs text-red-500 mt-1">
                    Erro email: {errors.emailError.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary to-green-500 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Bem-vindo à sua área!</h2>
                <p className="opacity-90 text-sm sm:text-base">
                  Aqui você pode acompanhar seu contrato, validar sua conta e realizar pagamentos.
                </p>
              </div>
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Contract Information */}
          <Card className="order-1">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Meu Contrato
              </CardTitle>
              <CardDescription className="text-sm">
                Informações do seu contrato de fiança locatícia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {fiancaAtiva ? (
                <>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Imóvel</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {fiancaAtiva.imovel_tipo} - {fiancaAtiva.imovel_endereco}, {fiancaAtiva.imovel_numero}, {fiancaAtiva.imovel_bairro}, {fiancaAtiva.imovel_cidade} - {fiancaAtiva.imovel_estado}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm">Valor do Aluguel</h4>
                      <p className="text-lg sm:text-xl font-bold text-primary">
                        R$ {fiancaAtiva.imovel_valor_aluguel?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm">Taxa da Fiança</h4>
                      <p className="text-lg sm:text-xl font-bold text-green-600">
                        {fiancaAtiva.taxa_aplicada || 10}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Data de Criação</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(fiancaAtiva.data_criacao).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Status</h4>
                      <Badge className={`${getStatusColor(fiancaAtiva.status_fianca)} text-white mt-1`}>
                        {getStatusText(fiancaAtiva.status_fianca)}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={baixarContrato}
                    variant="outline" 
                    className="w-full mt-4"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Contrato PDF
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Ainda não existem contratos ativos.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Quando sua fiança for aprovada, as informações aparecerão aqui.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Validation & Payment */}
          <Card className="order-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Pagamento da Fiança
              </CardTitle>
              <CardDescription className="text-sm">
                Validação da conta e pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Email Validation */}
              <div className="p-3 sm:p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Validação de E-mail</h4>
                  {emailVerificado ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  {emailVerificado 
                    ? 'Sua conta foi validada com sucesso!' 
                    : 'Aguardando validação do e-mail'
                  }
                </p>
              </div>

              {/* Payment Information */}
              {emailVerificado && fiancaPagamento ? (
                <div className="p-3 sm:p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-green-500/5">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Fiança Disponível para Pagamento</h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                      R$ {((fiancaPagamento.imovel_valor_aluguel || 0) * (fiancaPagamento.taxa_aplicada || 10) / 100).toLocaleString()}
                    </span>
                    <Badge className={`${getStatusColor(fiancaPagamento.status_fianca)} text-white text-xs sm:text-sm`}>
                      {getStatusText(fiancaPagamento.status_fianca)}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    Taxa de {fiancaPagamento.taxa_aplicada || 10}% sobre o valor do aluguel
                  </p>
                  {fiancaPagamento.data_envio_link && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Link disponível desde: {new Date(fiancaPagamento.data_envio_link).toLocaleDateString()}
                    </div>
                  )}

                  <div className="space-y-2">
                    {fiancaPagamento.link_pagamento && fiancaPagamento.status_fianca === 'pagamento_disponivel' && (
                      <Button 
                        onClick={acessarLinkPagamento}
                        className="w-full bg-green-500 hover:bg-green-600"
                        size="lg"
                        disabled={!fiancaPagamento.link_pagamento}
                      >
                        <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Acessar Link de Pagamento
                      </Button>
                    )}

                    {fiancaPagamento.link_pagamento && (
                      <ComprovanteUpload 
                        onUploadSuccess={handleComprovanteUpload}
                        disabled={fiancaPagamento.status_fianca === 'comprovante_enviado' || enviarComprovante.isPending}
                      />
                    )}

                    {fiancaPagamento.status_fianca === 'comprovante_enviado' && (
                      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <CheckCircle className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-2" />
                        <p className="font-medium text-blue-700 text-sm sm:text-base">Comprovante Enviado!</p>
                        <p className="text-xs sm:text-sm text-blue-600">
                          Aguardando verificação do pagamento.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : emailVerificado && !fiancaPagamento ? (
                <div className="p-3 sm:p-4 border rounded-lg text-center">
                  <AlertCircle className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm sm:text-base">Nenhuma fiança disponível para pagamento</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Aguarde a liberação do pagamento pelo financeiro.
                  </p>
                </div>
              ) : (
                <div className="p-3 sm:p-4 border rounded-lg text-center">
                  <Mail className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mb-2" />
                  <p className="text-gray-600 text-sm sm:text-base">Aguardando verificação do e-mail</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Verifique sua caixa de entrada para validar seu e-mail.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="order-3">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Histórico de Pagamentos</CardTitle>
            <CardDescription className="text-sm">
              Acompanhe todos os seus pagamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fiancaPagamento ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-gray-50 space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">Fiança Locatícia</p>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {fiancaPagamento.data_envio_link ? new Date(fiancaPagamento.data_envio_link).toLocaleDateString() : 'Data não disponível'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-sm sm:text-base">
                      R$ {((fiancaPagamento.imovel_valor_aluguel || 0) * (fiancaPagamento.taxa_aplicada || 10) / 100).toLocaleString()}
                    </p>
                    <Badge className={`${getStatusColor(fiancaPagamento.status_fianca)} text-white text-xs mt-1`}>
                      {getStatusText(fiancaPagamento.status_fianca)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhum histórico de pagamento disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inquilino;

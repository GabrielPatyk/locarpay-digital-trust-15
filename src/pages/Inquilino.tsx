
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInquilinoData } from '@/hooks/useInquilinoData';
import { useToast } from '@/hooks/use-toast';
import ComprovanteUpload from '@/components/ComprovanteUpload';
import EmailVerificationModal from '@/components/EmailVerificationModal';
import { 
  Home, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText,
  ExternalLink,
  Upload,
  AlertCircle
} from 'lucide-react';

const Inquilino = () => {
  const { toast } = useToast();
  const { fiancaAtiva, fiancaPagamento, emailVerificado, isLoading, enviarComprovante } = useInquilinoData();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [uploadingComprovante, setUploadingComprovante] = useState(false);

  const handleFileSelected = async (url: string) => {
    if (!fiancaPagamento) return;
    
    setUploadingComprovante(true);
    try {
      await enviarComprovante.mutateAsync({
        fiancaId: fiancaPagamento.id,
        comprovantePath: url
      });
    } finally {
      setUploadingComprovante(false);
    }
  };

  const abrirLinkPagamento = () => {
    if (fiancaPagamento?.link_pagamento) {
      window.open(fiancaPagamento.link_pagamento, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard do Inquilino">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard do Inquilino">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Bem-vindo, Inquilino!</h2>
                <p className="opacity-90 text-sm sm:text-base">
                  Acompanhe o status da sua fiança locatícia e gerencie seus documentos.
                </p>
              </div>
              <Home className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {!emailVerificado && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-orange-800 font-medium">E-mail não verificado</p>
                  <p className="text-orange-700 text-sm">
                    Verifique seu e-mail para ter acesso completo às funcionalidades.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  variant="outline" 
                  size="sm"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Verificar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fiança Ativa */}
        {fiancaAtiva && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-success" />
                Fiança Ativa
              </CardTitle>
              <CardDescription className="text-sm">
                Sua fiança locatícia está ativa e em vigor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Dados do Imóvel</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Tipo:</strong> {fiancaAtiva.imovel_tipo}</p>
                    <p><strong>Endereço:</strong> {fiancaAtiva.imovel_endereco}, {fiancaAtiva.imovel_numero}</p>
                    <p><strong>Bairro:</strong> {fiancaAtiva.imovel_bairro}</p>
                    <p><strong>Cidade:</strong> {fiancaAtiva.imovel_cidade}/{fiancaAtiva.imovel_estado}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Informações Financeiras</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Valor do Aluguel:</strong> R$ {Number(fiancaAtiva.imovel_valor_aluguel).toLocaleString('pt-BR')}</p>
                    <p><strong>Data de Ativação:</strong> {new Date(fiancaAtiva.data_criacao).toLocaleDateString('pt-BR')}</p>
                    {fiancaAtiva.data_vencimento && (
                      <p><strong>Vencimento:</strong> {new Date(fiancaAtiva.data_vencimento).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                </div>
              </div>

              <Badge className="bg-success text-white">
                <CheckCircle className="mr-1 h-3 w-3" />
                Fiança Ativa
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Pagamento da Fiança */}
        {fiancaPagamento && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                Pagamento da Fiança
              </CardTitle>
              <CardDescription className="text-sm">
                Complete o pagamento da sua fiança locatícia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Dados do Imóvel</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Tipo:</strong> {fiancaPagamento.imovel_tipo}</p>
                    <p><strong>Endereço:</strong> {fiancaPagamento.imovel_endereco}, {fiancaPagamento.imovel_numero}</p>
                    <p><strong>Bairro:</strong> {fiancaPagamento.imovel_bairro}</p>
                    <p><strong>Cidade:</strong> {fiancaPagamento.imovel_cidade}/{fiancaPagamento.imovel_estado}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Informações do Pagamento</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Valor:</strong> R$ {Number(fiancaPagamento.imovel_valor_aluguel).toLocaleString('pt-BR')}</p>
                    {fiancaPagamento.metodo_pagamento && (
                      <p><strong>Método:</strong> {fiancaPagamento.metodo_pagamento.replace('_', ' ')}</p>
                    )}
                    {fiancaPagamento.prazo_pagamento && (
                      <p><strong>Prazo:</strong> {fiancaPagamento.prazo_pagamento.replace('_', ' ')}</p>
                    )}
                    <p><strong>Status:</strong> Pagamento Disponível</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {fiancaPagamento.link_pagamento && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={abrirLinkPagamento}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Pagar Fiança
                    </Button>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Anexar Comprovante de Pagamento
                  </h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Após realizar o pagamento, anexe o comprovante para que possamos validar e ativar sua fiança.
                  </p>
                  <ComprovanteUpload 
                    onFileSelected={handleFileSelected}
                    isLoading={uploadingComprovante}
                  />
                </div>
              </div>

              <Badge className="bg-blue-500 text-white mt-4">
                <Clock className="mr-1 h-3 w-3" />
                Aguardando Pagamento
              </Badge>
            </CardContent>
          </Card>
        )}

        {!fiancaAtiva && !fiancaPagamento && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma fiança encontrada
              </h3>
              <p className="text-gray-600">
                Você ainda não possui uma fiança locatícia ativa ou pendente.
              </p>
            </CardContent>
          </Card>
        )}

        <EmailVerificationModal 
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
        />
      </div>
    </Layout>
  );
};

export default Inquilino;

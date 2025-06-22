import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, Mail, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { useInquilinoData } from '@/hooks/useInquilinoData';
import ComprovanteUpload from '@/components/ComprovanteUpload';

const Inquilino = () => {
  const { fiancaAtiva, fiancaPagamento, emailVerificado, isLoading, enviarComprovante } = useInquilinoData();
  const [showComprovanteUpload, setShowComprovanteUpload] = useState(false);

  if (isLoading) {
    return (
      <Layout title="Dashboard do Inquilino">
        <div className="flex items-center justify-center min-h-[400px]">
          Carregando informações...
        </div>
      </Layout>
    );
  }

  const handlePagarFianca = () => {
    if (fiancaPagamento?.link_pagamento) {
      window.open(fiancaPagamento.link_pagamento, '_blank');
    }
  };

  const handleComprovanteUploaded = (url: string) => {
    if (fiancaPagamento?.id) {
      enviarComprovante.mutate({ 
        fiancaId: fiancaPagamento.id, 
        comprovantePath: url 
      });
      setShowComprovanteUpload(false);
    }
  };

  return (
    <Layout title="Dashboard do Inquilino">
      {!emailVerificado && (
        <div className="fixed inset-0 bg-black opacity-50 z-50 flex items-center justify-center">
          <Alert className="max-w-md bg-white rounded-lg shadow-xl p-6 z-50">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Verificação de E-mail Necessária</AlertTitle>
            <AlertDescription>
              Para continuar, por favor, verifique seu e-mail. <br />
              <Link to="/reenviar-email" className="text-blue-500 hover:underline">
                Reenviar e-mail de verificação
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, seja bem-vindo(a)!
            </h1>
            <p className="text-sm text-gray-500">
              Acompanhe as informações da sua fiança de forma rápida e fácil.
            </p>
          </div>
        </div>

        {fiancaAtiva && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                Fiança Ativa
              </CardTitle>
              <CardDescription>
                Sua fiança está ativa e protegendo seu contrato de aluguel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">
                <strong>Imóvel:</strong> {fiancaAtiva.imovel_endereco}, {fiancaAtiva.imovel_numero} - {fiancaAtiva.imovel_cidade}, {fiancaAtiva.imovel_estado}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Valor do Aluguel:</strong> R$ {fiancaAtiva.imovel_valor_aluguel}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> Ativa
              </p>
            </CardContent>
          </Card>
        )}

        {/* Seção de Pagamento da Fiança */}
        {fiancaPagamento && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Pagamento da Fiança
              </CardTitle>
              <CardDescription>
                Sua fiança foi aprovada e está disponível para pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                <strong>Valor da Fiança:</strong> R$ {fiancaPagamento.imovel_valor_aluguel}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Método de Pagamento:</strong> {fiancaPagamento.metodo_pagamento}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Prazo para Pagamento:</strong> {fiancaPagamento.prazo_pagamento}
              </p>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                {fiancaPagamento.link_pagamento && (
                  <Button 
                    onClick={handlePagarFianca}
                    className="flex-1"
                  >
                    Pagar Fiança
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setShowComprovanteUpload(true)}
                  className="flex-1"
                >
                  Anexar Comprovante
                </Button>
              </div>

              {/* Upload de comprovante */}
              {showComprovanteUpload && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-2">Enviar Comprovante de Pagamento</h4>
                  <ComprovanteUpload 
                    onUpload={handleComprovanteUploaded}
                    isLoading={enviarComprovante.isPending}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!fiancaAtiva && !fiancaPagamento && (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma Fiança Encontrada</CardTitle>
              <CardDescription>
                Você ainda não possui uma fiança ativa ou aguardando pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Para iniciar o processo de locação com a nossa garantia, entre em
                contato com a imobiliária.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Inquilino;

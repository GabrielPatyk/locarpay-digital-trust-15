
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInquilinoData } from '@/hooks/useInquilinoData';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  FileText, 
  Home,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  Upload,
  ExternalLink,
  Loader2,
  CreditCard,
  Building
} from 'lucide-react';

const Inquilino = () => {
  const { fiancas, isLoading, enviarComprovante, isEnviandoComprovante } = useInquilinoData();
  const { toast } = useToast();
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_analise': return 'bg-blue-500';
      case 'aprovada': return 'bg-green-500';
      case 'rejeitada': return 'bg-red-500';
      case 'ativa': return 'bg-success';
      case 'pagamento_disponivel': return 'bg-orange-500';
      case 'comprovante_enviado': return 'bg-blue-600';
      case 'enviada_ao_financeiro': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_analise': return 'Em Análise';
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      case 'ativa': return 'Ativa';
      case 'pagamento_disponivel': return 'Pagamento Disponível';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      case 'enviada_ao_financeiro': return 'Processando';
      default: return status;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setComprovanteFile(file);
    }
  };

  const handleEnviarComprovante = (fiancaId: string) => {
    if (!comprovanteFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de comprovante.",
        variant: "destructive"
      });
      return;
    }

    enviarComprovante.mutate({ fiancaId, arquivo: comprovanteFile }, {
      onSuccess: () => {
        toast({
          title: "Comprovante enviado!",
          description: "Seu comprovante foi enviado com sucesso para análise.",
        });
        setComprovanteFile(null);
        // Reset file input
        const fileInput = document.getElementById('comprovante-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      onError: (error) => {
        toast({
          title: "Erro ao enviar comprovante",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <Layout title="Painel do Inquilino">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const fiancaAtiva = fiancas.find(f => ['pagamento_disponivel', 'comprovante_enviado', 'ativa'].includes(f.status_fianca));

  return (
    <Layout title="Painel do Inquilino">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Painel do Inquilino</h1>
              <p className="opacity-90">Acompanhe suas fianças e pagamentos</p>
            </div>
            <User className="h-12 w-12 opacity-50" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Fianças</p>
                  <p className="text-2xl font-bold text-primary">{fiancas.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fianças Ativas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fiancas.filter(f => f.status_fianca === 'ativa').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Análise</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fiancas.filter(f => f.status_fianca === 'em_analise').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagamento da Fiança */}
        {fiancaAtiva && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Pagamento da Fiança
              </CardTitle>
              <CardDescription>
                Realize o pagamento da sua fiança aprovada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações da Fiança */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Detalhes da Fiança
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Imóvel:</span>
                        <span className="font-medium">{fiancaAtiva.imovel_endereco}, {fiancaAtiva.imovel_numero}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-bold text-green-600">
                          R$ {fiancaAtiva.imovel_valor_aluguel.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={`${getStatusColor(fiancaAtiva.status_fianca)} text-white`}>
                          {getStatusLabel(fiancaAtiva.status_fianca)}
                        </Badge>
                      </div>
                      {fiancaAtiva.metodo_pagamento && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Método:</span>
                          <span className="font-medium">{fiancaAtiva.metodo_pagamento}</span>
                        </div>
                      )}
                      {fiancaAtiva.prazo_pagamento && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prazo:</span>
                          <span className="font-medium">{fiancaAtiva.prazo_pagamento}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botão de Pagamento */}
                  {fiancaAtiva.status_fianca === 'pagamento_disponivel' && fiancaAtiva.link_pagamento && (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.open(fiancaAtiva.link_pagamento, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Pagar Fiança
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        Você será redirecionado para o site do banco para realizar o pagamento
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload de Comprovante */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Comprovante
                    </h4>
                    
                    {fiancaAtiva.status_fianca === 'pagamento_disponivel' && (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="comprovante-file">Selecionar Comprovante</Label>
                          <Input
                            id="comprovante-file"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Aceitos: PDF, JPG, PNG (máximo 3MB)
                          </p>
                        </div>
                        
                        <Button
                          onClick={() => handleEnviarComprovante(fiancaAtiva.id)}
                          disabled={!comprovanteFile || isEnviandoComprovante}
                          className="w-full"
                        >
                          {isEnviandoComprovante ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Enviar Comprovante
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {fiancaAtiva.status_fianca === 'comprovante_enviado' && (
                      <div className="text-center py-4">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                        <p className="text-green-600 font-medium">Comprovante enviado!</p>
                        <p className="text-sm text-gray-600">Aguardando confirmação do pagamento</p>
                      </div>
                    )}

                    {fiancaAtiva.status_fianca === 'ativa' && (
                      <div className="text-center py-4">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                        <p className="text-green-600 font-medium">Fiança Ativa!</p>
                        <p className="text-sm text-gray-600">Pagamento confirmado com sucesso</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Fianças */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Fianças</CardTitle>
            <CardDescription>
              Histórico completo de suas solicitações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fiancas.map((fianca) => (
                <div key={fianca.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Home className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{fianca.imovel_endereco}, {fianca.imovel_numero}</h4>
                        <p className="text-sm text-gray-600">{fianca.imovel_bairro} - {fianca.imovel_cidade}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                      {getStatusLabel(fianca.status_fianca)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Criada em {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {fianca.data_analise && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Analisada em {new Date(fianca.data_analise).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>

                  {fianca.motivo_reprovacao && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-800 text-sm">
                        <strong>Motivo da rejeição:</strong> {fianca.motivo_reprovacao}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {fiancas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma fiança encontrada
                </h3>
                <p className="text-gray-600">
                  Você ainda não possui fianças em nosso sistema.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inquilino;

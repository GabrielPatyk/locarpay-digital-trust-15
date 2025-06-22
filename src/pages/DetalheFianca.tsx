
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFiancaDetails } from '@/hooks/useFiancaDetails';
import { 
  ArrowLeft, 
  User, 
  Building, 
  FileText, 
  Calendar,
  Star,
  DollarSign,
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';

const DetalheFianca = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fianca, historico, isLoading } = useFiancaDetails(id || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rejeitada':
        return 'bg-red-500';
      case 'aprovada':
        return 'bg-green-500';
      case 'em_analise':
        return 'bg-blue-500';
      case 'ativa':
        return 'bg-green-500';
      case 'vencida':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'rejeitada':
        return 'Rejeitada';
      case 'aprovada':
        return 'Aprovada';
      case 'em_analise':
        return 'Em Análise';
      case 'ativa':
        return 'Ativa';
      case 'vencida':
        return 'Vencida';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Layout title="Detalhes da Fiança">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!fianca) {
    return (
      <Layout title="Detalhes da Fiança">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Fiança não encontrada
          </h3>
          <Button variant="outline" onClick={() => navigate('/fiancas-imobiliaria')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes da Fiança">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/fiancas-imobiliaria')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fiança {fianca.id}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                  {getStatusLabel(fianca.status_fianca)}
                </Badge>
                {fianca.data_analise && (
                  <span className="text-sm text-gray-500">
                    Analisada em {new Date(fianca.data_analise).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados do Inquilino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Dados do Inquilino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                <p className="text-base">{fianca.inquilino_nome_completo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p className="text-base">{fianca.inquilino_cpf}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-base">{fianca.inquilino_email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                <p className="text-base">{fianca.inquilino_whatsapp}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Renda Mensal</p>
                <p className="text-base font-semibold text-green-600">
                  R$ {fianca.inquilino_renda_mensal.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-base">
                  {fianca.inquilino_endereco}, {fianca.inquilino_numero}
                  {fianca.inquilino_complemento && `, ${fianca.inquilino_complemento}`}<br />
                  {fianca.inquilino_bairro}, {fianca.inquilino_cidade} - {fianca.inquilino_estado}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Imóvel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-orange-600" />
                Dados do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="text-base">{fianca.imovel_tipo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-base">
                  {fianca.imovel_endereco}, {fianca.imovel_numero}
                  {fianca.imovel_complemento && `, ${fianca.imovel_complemento}`}<br />
                  {fianca.imovel_bairro}, {fianca.imovel_cidade} - {fianca.imovel_estado}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Valor do Aluguel</p>
                <p className="text-base font-semibold text-blue-600">
                  R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
                </p>
              </div>
              {fianca.imovel_area_metros && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Área</p>
                  <p className="text-base">{fianca.imovel_area_metros} m²</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Tempo de Locação</p>
                <p className="text-base">{fianca.imovel_tempo_locacao} meses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados da Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-600" />
              Dados da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fianca.score_credito && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm font-medium text-gray-500">Score de Crédito</p>
                  <p className="text-2xl font-bold text-yellow-600">{fianca.score_credito}</p>
                </div>
              )}
              {fianca.taxa_aplicada && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium text-gray-500">Taxa da Fiança</p>
                  <p className="text-2xl font-bold text-green-600">{fianca.taxa_aplicada}%</p>
                </div>
              )}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className={`${getStatusColor(fianca.status_fianca)} text-white mt-1`}>
                  {getStatusLabel(fianca.status_fianca)}
                </Badge>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-500">Analista</p>
                <p className="text-sm font-medium text-blue-600">Analista Responsável</p>
              </div>
            </div>

            {fianca.status_fianca === 'rejeitada' && fianca.motivo_reprovacao && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Motivo da Rejeição</h4>
                <p className="text-red-700">{fianca.motivo_reprovacao}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Histórico de Atividades
            </CardTitle>
            <CardDescription>
              Acompanhe todas as alterações realizadas nesta fiança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historico.length > 0 ? (
                historico.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.acao}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(item.data_criacao).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Por: {item.usuario_nome}</p>
                      {item.detalhes && (
                        <p className="text-sm text-gray-500 mt-1">{item.detalhes}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum histórico disponível</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalheFianca;

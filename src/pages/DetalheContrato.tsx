import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, PenTool, MapPin, Building, User, DollarSign } from 'lucide-react';

interface ContratoDetalhado {
  id: string;
  fianca_id: string;
  status_contrato: string;
  inquilino_nome: string;
  inquilino_email: string;
  inquilino_cpf: string;
  valor_fianca: number;
  valor_aluguel: number;
  url_assinatura_inquilino: string | null;
  created_at: string;
  updated_at: string;
  fianca: {
    id: string;
    imovel_endereco: string;
    imovel_numero: string;
    imovel_complemento: string | null;
    imovel_bairro: string;
    imovel_cidade: string;
    imovel_estado: string;
    imovel_tipo: string;
    imovel_descricao: string | null;
    imovel_valor_aluguel: number;
    valor_fianca: number;
    status_fianca: string;
    usuarios: {
      nome: string;
      email: string;
      telefone: string;
    } | null;
  } | null;
}

const DetalheContrato = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: contrato, isLoading, error } = useQuery({
    queryKey: ['contrato-detalhe', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do contrato não fornecido');

      const { data, error } = await supabase
        .from('contratos_fianca')
        .select(`
          *,
          fianca:fiancas_locaticias(
            id,
            imovel_endereco,
            imovel_numero,
            imovel_complemento,
            imovel_bairro,
            imovel_cidade,
            imovel_estado,
            imovel_tipo,
            imovel_descricao,
            imovel_valor_aluguel,
            valor_fianca,
            status_fianca,
            usuarios:usuarios!fiancas_locaticias_id_imobiliaria_fkey(
              nome,
              email,
              telefone
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar contrato:', error);
        throw error;
      }

      return data as ContratoDetalhado;
    },
    enabled: !!id
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gerando_link': return 'bg-yellow-500';
      case 'aguardando_assinatura': return 'bg-blue-500';
      case 'assinado': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'gerando_link': return 'Gerando Link';
      case 'aguardando_assinatura': return 'Aguardando Assinatura';
      case 'assinado': return 'Assinado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatAddress = (fianca: any) => {
    if (!fianca) return '';
    const { imovel_endereco, imovel_numero, imovel_complemento, imovel_bairro, imovel_cidade, imovel_estado } = fianca;
    return `${imovel_endereco}, ${imovel_numero}${imovel_complemento ? ` - ${imovel_complemento}` : ''} - ${imovel_bairro}, ${imovel_cidade}/${imovel_estado}`;
  };

  if (isLoading) {
    return (
      <Layout title="Detalhes do Contrato">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Detalhes do Contrato">
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar contrato: {error.message}</p>
          <Button onClick={() => navigate('/contratos')} className="mt-4">
            Voltar para Contratos
          </Button>
        </div>
      </Layout>
    );
  }

  if (!contrato) {
    return (
      <Layout title="Detalhes do Contrato">
        <div className="text-center py-8">
          <p className="text-gray-500">Contrato não encontrado</p>
          <Button onClick={() => navigate('/contratos')} className="mt-4">
            Voltar para Contratos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes do Contrato">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/contratos')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Contrato #{contrato.id.slice(0, 8)}</h1>
              <p className="text-gray-500">Detalhes completos do contrato</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(contrato.status_contrato)} text-white`}>
            {getStatusText(contrato.status_contrato)}
          </Badge>
        </div>

        {/* Ações */}
        {contrato.url_assinatura_inquilino && contrato.status_contrato === 'aguardando_assinatura' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Assinatura Pendente</h3>
                  <p className="text-gray-600">Clique no botão abaixo para assinar o contrato</p>
                </div>
                <Button onClick={() => window.open(contrato.url_assinatura_inquilino!, '_blank')}>
                  <PenTool className="mr-2 h-4 w-4" />
                  Assinar Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Informações do Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID do Contrato</p>
                  <p className="font-medium">{contrato.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={`${getStatusColor(contrato.status_contrato)} text-white`}>
                    {getStatusText(contrato.status_contrato)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor da Fiança</p>
                  <p className="font-medium">R$ {contrato.valor_fianca?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor do Aluguel</p>
                  <p className="font-medium">R$ {contrato.valor_aluguel?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Criação</p>
                  <p className="font-medium">{new Date(contrato.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última Atualização</p>
                  <p className="font-medium">{new Date(contrato.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Inquilino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Dados do Inquilino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <p className="font-medium">{contrato.inquilino_nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium">{contrato.inquilino_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{contrato.inquilino_cpf}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Imóvel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Dados do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium">{contrato.fianca?.imovel_tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Endereço</p>
                <p className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {formatAddress(contrato.fianca)}
                </p>
              </div>
              {contrato.fianca?.imovel_descricao && (
                <div>
                  <p className="text-sm text-gray-500">Descrição</p>
                  <p className="font-medium">{contrato.fianca.imovel_descricao}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações da Imobiliária */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Imobiliária Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{contrato.fianca?.usuarios?.nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium">{contrato.fianca?.usuarios?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{contrato.fianca?.usuarios?.telefone || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações da Fiança Relacionada */}
        {contrato.fianca && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Fiança Relacionada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID da Fiança</p>
                  <p className="font-medium">{contrato.fianca.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status da Fiança</p>
                  <p className="font-medium">{contrato.fianca.status_fianca}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Original</p>
                  <p className="font-medium">R$ {contrato.fianca.valor_fianca?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DetalheContrato;
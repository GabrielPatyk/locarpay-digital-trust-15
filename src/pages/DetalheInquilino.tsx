
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  DollarSign,
  Calendar,
  ArrowLeft,
  CreditCard,
  Building,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface InquilinoDetalhes {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  renda: number;
  dataCadastro: string;
  totalFiancas: number;
  fiancasAprovadas: number;
  valorTotalAluguel: number;
  ultimaFianca?: string;
  fiancas: any[];
  contratos: any[];
}

const DetalheInquilino = () => {
  const { cpf } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inquilino, setInquilino] = useState<InquilinoDetalhes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.type === 'analista' && cpf) {
      fetchInquilinoDetalhes();
    }
  }, [user, cpf]);

  const fetchInquilinoDetalhes = async () => {
    try {
      setIsLoading(true);
      
      // Buscar fianças aprovadas pelo analista logado para este inquilino
      const { data: fiancasData, error: fiancasError } = await supabase
        .from('historico_fiancas')
        .select(`
          fianca_id,
          fiancas_locaticias!inner(
            id,
            inquilino_nome_completo,
            inquilino_cpf,
            inquilino_email,
            inquilino_whatsapp,
            inquilino_endereco,
            inquilino_numero,
            inquilino_complemento,
            inquilino_bairro,
            inquilino_cidade,
            inquilino_estado,
            inquilino_renda_mensal,
            imovel_valor_aluguel,
            imovel_endereco,
            imovel_numero,
            imovel_bairro,
            imovel_cidade,
            imovel_estado,
            imovel_tempo_locacao,
            data_criacao,
            status_fianca,
            valor_fianca,
            data_aprovacao
          )
        `)
        .eq('analisado_por', user.id)
        .eq('acao', 'Fiança aprovada')
        .eq('fiancas_locaticias.inquilino_cpf', cpf);

      if (fiancasError) {
        throw fiancasError;
      }

      if (!fiancasData || fiancasData.length === 0) {
        setError('Inquilino não encontrado ou não possui fianças aprovadas por você.');
        return;
      }

      // Buscar contratos relacionados às fianças
      const fiancaIds = fiancasData.map(item => item.fianca_id);
      const { data: contratosData } = await supabase
        .from('contratos_fianca')
        .select('*')
        .in('fianca_id', fiancaIds);

      // Processar dados do inquilino
      const primeiraFianca = fiancasData[0].fiancas_locaticias;
      const todasFiancas = fiancasData.map(item => item.fiancas_locaticias);

      const inquilinoDetalhes: InquilinoDetalhes = {
        id: primeiraFianca.inquilino_cpf,
        nome: primeiraFianca.inquilino_nome_completo,
        cpf: primeiraFianca.inquilino_cpf,
        email: primeiraFianca.inquilino_email,
        telefone: primeiraFianca.inquilino_whatsapp,
        endereco: `${primeiraFianca.inquilino_endereco}, ${primeiraFianca.inquilino_numero}${primeiraFianca.inquilino_complemento ? `, ${primeiraFianca.inquilino_complemento}` : ''}, ${primeiraFianca.inquilino_bairro}, ${primeiraFianca.inquilino_cidade} - ${primeiraFianca.inquilino_estado}`,
        renda: primeiraFianca.inquilino_renda_mensal,
        dataCadastro: primeiraFianca.data_criacao,
        totalFiancas: todasFiancas.length,
        fiancasAprovadas: todasFiancas.filter(f => f.status_fianca === 'aprovada' || f.status_fianca === 'ativa').length,
        valorTotalAluguel: todasFiancas.reduce((sum, f) => sum + f.imovel_valor_aluguel, 0),
        ultimaFianca: todasFiancas.sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())[0]?.data_criacao,
        fiancas: todasFiancas,
        contratos: contratosData || []
      };

      setInquilino(inquilinoDetalhes);
    } catch (error) {
      console.error('Erro ao carregar detalhes do inquilino:', error);
      setError('Erro ao carregar os dados do inquilino.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-500';
      case 'aprovada': return 'bg-blue-500';
      case 'em_analise': return 'bg-yellow-500';
      case 'rejeitada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'aprovada': return 'Aprovada';
      case 'em_analise': return 'Em Análise';
      case 'rejeitada': return 'Rejeitada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa': return <CheckCircle2 className="h-4 w-4" />;
      case 'aprovada': return <CheckCircle2 className="h-4 w-4" />;
      case 'em_analise': return <Clock className="h-4 w-4" />;
      case 'rejeitada': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (user?.type !== 'analista') {
    return (
      <Layout title="Acesso Negado">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acesso restrito apenas para Analistas
          </h3>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout title="Carregando...">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !inquilino) {
    return (
      <Layout title="Erro">
        <div className="text-center py-8">
          <p className="text-red-600">{error || 'Inquilino não encontrado'}</p>
          <Button onClick={() => navigate('/clientes')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Clientes
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Detalhes - ${inquilino.nome}`}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/clientes')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{inquilino.nome}</h1>
              <p className="text-gray-600">CPF: {inquilino.cpf}</p>
            </div>
          </div>
        </div>

        {/* Resumo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Fianças</p>
                  <p className="text-2xl font-bold text-blue-600">{inquilino.totalFiancas}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">{inquilino.fiancasAprovadas}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Renda Mensal</p>
                  <p className="text-2xl font-bold text-primary">R$ {inquilino.renda.toLocaleString('pt-BR')}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Aluguéis</p>
                  <p className="text-2xl font-bold text-orange-600">R$ {inquilino.valorTotalAluguel.toLocaleString('pt-BR')}</p>
                </div>
                <Building className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com Detalhes */}
        <Tabs defaultValue="dados" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="fiancas">Fianças ({inquilino.fiancas.length})</TabsTrigger>
            <TabsTrigger value="contratos">Contratos ({inquilino.contratos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                        <p className="text-base">{inquilino.nome}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">CPF</p>
                        <p className="text-base">{inquilino.cpf}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">E-mail</p>
                        <p className="text-base">{inquilino.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p className="text-base">{inquilino.telefone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Endereço</p>
                        <p className="text-base">{inquilino.endereco}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Renda Mensal</p>
                        <p className="text-base">R$ {inquilino.renda.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cliente desde</p>
                        <p className="text-base">{new Date(inquilino.dataCadastro).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiancas">
            <div className="space-y-4">
              {inquilino.fiancas.map((fianca, index) => (
                <Card key={fianca.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Fiança #{index + 1}</h3>
                          <p className="text-sm text-gray-600">
                            Criada em {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(fianca.status_fianca)}
                          <span>{getStatusText(fianca.status_fianca)}</span>
                        </div>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Valor do Aluguel</p>
                        <p className="text-lg font-semibold">R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Valor da Fiança</p>
                        <p className="text-lg font-semibold text-primary">
                          R$ {(fianca.valor_fianca || 0).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tempo de Locação</p>
                        <p className="text-base">{fianca.imovel_tempo_locacao} meses</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Endereço do Imóvel</p>
                        <p className="text-base">
                          {fianca.imovel_endereco}, {fianca.imovel_numero} - {fianca.imovel_bairro}, {fianca.imovel_cidade}/{fianca.imovel_estado}
                        </p>
                      </div>
                    </div>

                    {fianca.data_aprovacao && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Aprovada em {new Date(fianca.data_aprovacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contratos">
            <div className="space-y-4">
              {inquilino.contratos.length > 0 ? (
                inquilino.contratos.map((contrato) => (
                  <Card key={contrato.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Contrato de Fiança</h3>
                            <p className="text-sm text-gray-600">
                              Criado em {new Date(contrato.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {contrato.status_contrato}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <p className="text-base">{contrato.status_contrato}</p>
                        </div>
                        {contrato.data_assinatura && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Data de Assinatura</p>
                            <p className="text-base">{new Date(contrato.data_assinatura).toLocaleDateString('pt-BR')}</p>
                          </div>
                        )}
                      </div>

                      {contrato.url_contrato && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => window.open(contrato.url_contrato, '_blank')}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Contrato
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum contrato encontrado
                    </h3>
                    <p className="text-gray-600">
                      Este inquilino ainda não possui contratos gerados.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DetalheInquilino;

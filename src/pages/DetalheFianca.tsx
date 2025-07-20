
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFiancaDetails } from '@/hooks/useFiancaDetails';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';
import { useAuth } from '@/contexts/AuthContext';
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
  Loader2,
  CreditCard,
  CheckCircle,
  LinkIcon
} from 'lucide-react';

const DetalheFianca = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fianca, historico, isLoading } = useFiancaDetails(id || '');
  const { getCargoHomePage } = useCargoRedirect();

  // Verificar se o usuário tem permissão (admin, analista, imobiliária dona da fiança ou inquilino da fiança)
  React.useEffect(() => {
    if (user && fianca) {
      const hasPermission = user.type === 'admin' || 
                           user.type === 'analista' ||
                           (user.type === 'imobiliaria' && fianca.id_imobiliaria === user.id) ||
                           (user.type === 'inquilino' && fianca.inquilino_usuario_id === user.id);
      
      if (!hasPermission) {
        navigate('/unauthorized');
      }
    }
  }, [user, fianca, navigate]);

  const handleVoltar = () => {
    const homePage = getCargoHomePage();
    navigate(homePage);
  };

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
      case 'enviada_ao_financeiro':
        return 'bg-purple-500';
      case 'aguardando_geracao_pagamento':
        return 'bg-yellow-500';
      case 'pagamento_disponivel':
        return 'bg-orange-500';
      case 'comprovante_enviado':
        return 'bg-blue-500';
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
      case 'enviada_ao_financeiro':
        return 'Enviada ao Financeiro';
      case 'aguardando_geracao_pagamento':
        return 'Aguardando Geração de Pagamento';
      case 'pagamento_disponivel':
        return 'Pagamento Disponível';
      case 'comprovante_enviado':
        return 'Comprovante Enviado';
      default:
        return status;
    }
  };

  // Buscar o nome do analista correto do histórico
  const getAnalistaNome = () => {
    const analistaAction = historico.find(item => 
      item.acao.includes('Score e taxa atualizados') || 
      item.acao.includes('aprovada') || 
      item.acao.includes('rejeitada')
    );
    
    return analistaAction?.analisado_por_usuario?.nome || 
           analistaAction?.usuario_nome || 
           'Não atribuído';
  };

  // Função para buscar o nome do executivo responsável - simplificada
  const getExecutivoNome = () => {
    return 'Não atribuído';
  };

  // Função para formatar método de pagamento
  const getMetodoPagamentoTexto = (metodo: string) => {
    switch (metodo) {
      case 'transferencia_bancaria':
        return 'Transferência Bancária';
      case 'pix':
        return 'PIX';
      case 'cartao_credito':
        return 'Cartão de Crédito';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return metodo;
    }
  };

  // Função para formatar prazo de pagamento
  const getPrazoPagamentoTexto = (prazo: string) => {
    switch (prazo) {
      case '1_dia':
        return 'Até 1 dia útil';
      case '2_dias':
        return 'Até 2 dias úteis';
      case '3_dias':
        return 'Até 3 dias úteis';
      case '5_dias':
        return 'Até 5 dias úteis';
      case '7_dias':
        return 'Até 7 dias úteis';
      default:
        return prazo;
    }
  };

  // Função para formatar telefone
  const formatPhone = (phone: string) => {
    if (!phone) return 'Não informado';
    
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Se tem 11 dígitos (com DDD), formata como +55 (XX) 9 XXXX-XXXX
    if (numbers.length === 11) {
      return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    
    // Se tem 10 dígitos (com DDD), formata como +55 (XX) XXXX-XXXX
    if (numbers.length === 10) {
      return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    // Retorna o número original se não conseguir formatar
    return phone;
  };

  // Função para formatar tipo de imóvel
  const getTipoImovelTexto = (tipo: string) => {
    switch (tipo) {
      case 'casa':
        return 'Casa';
      case 'apartamento':
        return 'Apartamento';
      case 'comercial':
        return 'Comercial';
      case 'terreno':
        return 'Terreno';
      case 'sala':
        return 'Sala';
      case 'loja':
        return 'Loja';
      case 'galpao':
        return 'Galpão';
      default:
        return tipo;
    }
  };

  // Função para formatar tipo de locação
  const getTipoLocacaoTexto = (tipo: string) => {
    switch (tipo) {
      case 'residencial':
        return 'Residencial';
      case 'comercial':
        return 'Comercial';
      case 'misto':
        return 'Misto';
      default:
        return tipo;
    }
  };

  // Função para calcular valores da fiança
  const calcularValoresFianca = () => {
    if (!fianca) return null;

    const valorAluguel = fianca.imovel_valor_aluguel || 0;
    const tempoLocacao = fianca.imovel_tempo_locacao || 0;
    const valorTotalLocacao = valorAluguel * tempoLocacao;
    const taxaFianca = fianca.taxa_aplicada || 0;
    const valorFianca = (valorTotalLocacao * taxaFianca) / 100;

    return {
      valorAluguel,
      tempoLocacao,
      valorTotalLocacao,
      taxaFianca,
      valorFianca
    };
  };

  // Filtrar histórico para evitar duplicatas
  const historicoFiltrado = React.useMemo(() => {
    if (!historico || historico.length === 0) return [];
    
    // Remover duplicatas baseado em ação e data (mesmo minuto)
    const uniqueHistorico = historico.filter((item, index, arr) => {
      const sameActions = arr.filter(h => 
        h.acao === item.acao && 
        new Date(h.data_criacao).getTime() === new Date(item.data_criacao).getTime()
      );
      
      // Manter apenas o primeiro de cada grupo de duplicatas
      return sameActions.indexOf(item) === 0;
    });

    return uniqueHistorico.sort((a, b) => 
      new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
    );
  }, [historico]);

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
          <Button variant="outline" onClick={handleVoltar}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </Layout>
    );
  }

  // Verificar permissão após carregar os dados
  const hasPermission = user?.type === 'admin' || 
                       user?.type === 'analista' ||
                       (user?.type === 'imobiliaria' && fianca.id_imobiliaria === user.id) ||
                       (user?.type === 'inquilino' && fianca.inquilino_usuario_id === user.id);

  if (!hasPermission) {
    return (
      <Layout title="Acesso Negado">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Você não tem permissão para ver esta fiança
          </h3>
          <Button variant="outline" onClick={handleVoltar}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </Layout>
    );
  }

  const valoresFianca = calcularValoresFianca();

  return (
    <Layout title="Detalhes da Fiança">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleVoltar}>
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
                <p className="text-base">{formatPhone(fianca.inquilino_whatsapp)}</p>
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

          {/* Dados da Imobiliária e Executivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-orange-600" />
                Dados da Imobiliária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome da Imobiliária</p>
                <p className="text-base font-semibold">{fianca.usuarios?.nome || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Executivo Responsável</p>
                <p className="text-base text-blue-600">
                  {getExecutivoNome()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-base">{fianca.usuarios?.email || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-base">{formatPhone(fianca.usuarios?.telefone || '')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados do Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-orange-600" />
              Dados do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo do Imóvel</p>
                <p className="text-base">{getTipoImovelTexto(fianca.imovel_tipo)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo de Locação</p>
                <p className="text-base">{getTipoLocacaoTexto(fianca.imovel_tipo_locacao)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Valor do Aluguel Mensal</p>
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
            </div>
            
            {fianca.imovel_descricao && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição do Imóvel</p>
                <p className="text-base">{fianca.imovel_descricao}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-500">Endereço Completo do Imóvel</p>
              <p className="text-base">
                {fianca.imovel_endereco}, {fianca.imovel_numero}
                {fianca.imovel_complemento && `, ${fianca.imovel_complemento}`}<br />
                {fianca.imovel_bairro}, {fianca.imovel_cidade} - {fianca.imovel_estado}
              </p>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-sm font-medium text-blue-600">
                  {getAnalistaNome()}
                </p>
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

        {/* Informações de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-green-600" />
              Informações de Pagamento
            </CardTitle>
            <CardDescription>
              Status e detalhes do processo de pagamento da fiança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {['pagamento_disponivel', 'comprovante_enviado', 'ativa'].includes(fianca.status_fianca) ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Clock className="h-8 w-8 text-yellow-600" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-500">Status do Pagamento</p>
                <Badge className={`${getStatusColor(fianca.status_fianca)} text-white mt-1`}>
                  {getStatusLabel(fianca.status_fianca)}
                </Badge>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-gray-500">Valor da Fiança</p>
                <p className="text-xl font-bold text-green-600">
                  R$ {valoresFianca ? valoresFianca.valorFianca.toLocaleString('pt-BR') : '0'}
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium text-gray-500">Link de Pagamento</p>
                <p className="text-sm font-medium text-purple-600">
                  {fianca.status_fianca === 'pagamento_disponivel' ? 'Disponível' : 
                   ['comprovante_enviado', 'ativa'].includes(fianca.status_fianca) ? 'Pago' : 'Pendente'}
                </p>
              </div>
            </div>

            {/* Descrição detalhada dos valores */}
            {valoresFianca && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Detalhamento dos Valores</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Valor do Aluguel Mensal:</strong> R$ {valoresFianca.valorAluguel.toLocaleString('pt-BR')}</p>
                  <p><strong>Valor Total Aluguel:</strong> R$ {valoresFianca.valorTotalLocacao.toLocaleString('pt-BR')} (Período de: {valoresFianca.tempoLocacao} meses)</p>
                  <p><strong>Taxa Fiança:</strong> {valoresFianca.taxaFianca}%</p>
                  <p><strong>Valor da Fiança:</strong> R$ {valoresFianca.valorFianca.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            )}

            {['pagamento_disponivel', 'comprovante_enviado', 'ativa'].includes(fianca.status_fianca) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Detalhes do Pagamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <strong>Método:</strong> {fianca.metodo_pagamento ? getMetodoPagamentoTexto(fianca.metodo_pagamento) : 'Não informado'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Prazo:</strong> {fianca.prazo_pagamento ? getPrazoPagamentoTexto(fianca.prazo_pagamento) : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Situação:</strong> 
                      {fianca.status_fianca === 'pagamento_disponivel' && ' Aguardando Pagamento'}
                      {fianca.status_fianca === 'comprovante_enviado' && ' Comprovante Enviado'}
                      {fianca.status_fianca === 'ativa' && ' Pagamento Confirmado'}
                    </p>
                    <p className="text-gray-600"><strong>Atualizado em:</strong> {new Date(fianca.data_atualizacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                {fianca.link_pagamento && (
                  <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      <strong>Link:</strong> <a href={fianca.link_pagamento} target="_blank" rel="noopener noreferrer" className="underline">{fianca.link_pagamento}</a>
                    </p>
                  </div>
                )}
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
              {historicoFiltrado.length > 0 ? (
                historicoFiltrado.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-start space-x-3">
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
                      <p className="text-sm text-gray-600">
                        Por: {item.analisado_por_usuario?.nome || item.usuario_nome}
                      </p>
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


import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Eye, 
  Download,
  Calendar,
  TrendingUp,
  User,
  DollarSign,
  Loader2
} from 'lucide-react';

interface Analise {
  id: string;
  inquilino_nome_completo: string;
  inquilino_cpf: string;
  score_credito: number;
  taxa_aplicada: number;
  status_fianca: string;
  data_analise: string;
  imovel_valor_aluguel: number;
  valor_fianca: number;
  usuarios?: {
    nome: string;
  };
}

const Analises = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [analises, setAnalises] = useState<Analise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se é analista
  useEffect(() => {
    if (user && user.type !== 'analista') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  // Carregar análises do banco de dados
  useEffect(() => {
    if (user?.type === 'analista') {
      fetchAnalises();
    }
  }, [user]);

  const fetchAnalises = async () => {
    try {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          inquilino_cpf,
          score_credito,
          taxa_aplicada,
          status_fianca,
          data_analise,
          imovel_valor_aluguel,
          valor_fianca,
          usuarios!fiancas_locaticias_id_imobiliaria_fkey (
            nome
          )
        `)
        .not('data_analise', 'is', null)
        .order('data_analise', { ascending: false });

      if (error) {
        console.error('Erro ao buscar análises:', error);
        return;
      }

      setAnalises(data || []);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAnalises = analises.filter(analise =>
    analise.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analise.inquilino_cpf.includes(searchTerm) ||
    analise.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada':
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'em_analise':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      case 'enviada_ao_financeiro':
      case 'aguardando_geracao_pagamento':
      case 'pagamento_disponivel':
      case 'comprovante_enviado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'Aprovada';
      case 'ativa':
        return 'Ativa';
      case 'em_analise':
        return 'Em Análise';
      case 'rejeitada':
        return 'Rejeitada';
      case 'enviada_ao_financeiro':
        return 'Enviada ao Financeiro';
      case 'aguardando_geracao_pagamento':
        return 'Aguardando Pagamento';
      case 'pagamento_disponivel':
        return 'Pagamento Disponível';
      case 'comprovante_enviado':
        return 'Comprovante Enviado';
      default:
        return status;
    }
  };

  const handleVisualizar = (id: string) => {
    navigate(`/detalhe-fianca/${id}`);
  };

  const handleRelatorio = (analise: Analise) => {
    // Gerar relatório da análise
    const relatorioData = {
      id: analise.id,
      cliente: analise.inquilino_nome_completo,
      cpf: analise.inquilino_cpf,
      score: analise.score_credito,
      taxa: analise.taxa_aplicada,
      status: analise.status_fianca,
      dataAnalise: analise.data_analise,
      valorAluguel: analise.imovel_valor_aluguel,
      valorFianca: analise.valor_fianca,
      imobiliaria: analise.usuarios?.nome
    };

    // Simular download do relatório (aqui você implementaria a geração real do PDF)
    console.log('Gerando relatório para:', relatorioData);
    
    // Criar um blob com os dados da análise (exemplo simples)
    const relatorioTexto = `
RELATÓRIO DE ANÁLISE DE FIANÇA
=============================

ID da Análise: ${relatorioData.id}
Cliente: ${relatorioData.cliente}
CPF: ${relatorioData.cpf}
Score de Crédito: ${relatorioData.score}
Taxa Aplicada: ${relatorioData.taxa}%
Status: ${getStatusLabel(relatorioData.status)}
Data da Análise: ${new Date(relatorioData.dataAnalise).toLocaleDateString('pt-BR')}
Valor do Aluguel: R$ ${relatorioData.valorAluguel.toLocaleString('pt-BR')}
Valor da Fiança: R$ ${relatorioData.valorFianca?.toLocaleString('pt-BR') || 'N/A'}
Imobiliária: ${relatorioData.imobiliaria}

Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
    `;

    const blob = new Blob([relatorioTexto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-analise-${relatorioData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  return (
    <Layout title="Análises de Crédito">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análises de Crédito</h1>
            <p className="text-gray-600">Histórico de todas as análises realizadas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar análises por cliente, CPF ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Carregando análises...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAnalises.map((analise) => (
              <Card key={analise.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{analise.id}</h3>
                        <Badge className={getStatusColor(analise.status_fianca)}>
                          {getStatusLabel(analise.status_fianca)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Valor do Aluguel</p>
                      <p className="text-xl font-bold text-primary">
                        R$ {analise.imovel_valor_aluguel.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Cliente</p>
                        <p className="font-medium">{analise.inquilino_nome_completo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">CPF</p>
                        <p className="font-medium">{analise.inquilino_cpf}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="font-medium">
                          {analise.score_credito ? `${analise.score_credito} pontos` : 'Pendente'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Taxa</p>
                        <p className="font-medium">
                          {analise.taxa_aplicada ? `${analise.taxa_aplicada}%` : 'Pendente'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Análise realizada em {new Date(analise.data_analise).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVisualizar(analise.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRelatorio(analise)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Relatório
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredAnalises.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma análise encontrada
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca.'
                  : 'As análises realizadas aparecerão aqui.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Analises;

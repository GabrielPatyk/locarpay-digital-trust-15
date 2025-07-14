
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign
} from 'lucide-react';

const RelatoriosAnalista = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');

  const estatisticas = {
    totalAnalises: 156,
    aprovacoes: 98,
    reprovacoes: 35,
    pendentes: 23,
    taxaAprovacao: 72.8,
    scoreMedia: 642,
    valorMedio: 3250
  };

  const relatoriosDisponiveis = [
    {
      id: 1,
      titulo: 'Relatório Mensal de Análises',
      descricao: 'Resumo completo das análises realizadas no mês',
      periodo: 'Janeiro 2024',
      tipo: 'PDF',
      tamanho: '2.3 MB',
      dataGeracao: '2024-02-01'
    },
    {
      id: 2,
      titulo: 'Relatório de Performance',
      descricao: 'Indicadores de performance e produtividade',
      periodo: 'Janeiro 2024',
      tipo: 'Excel',
      tamanho: '1.8 MB',
      dataGeracao: '2024-02-01'
    },
    {
      id: 3,
      titulo: 'Análise de Scores',
      descricao: 'Distribuição e análise dos scores de crédito',
      periodo: 'Janeiro 2024',
      tipo: 'PDF',
      tamanho: '3.1 MB',
      dataGeracao: '2024-02-01'
    }
  ];

  return (
    <Layout title="Relatórios">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Acompanhe métricas e gere relatórios detalhados</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Gerar Novo Relatório
          </Button>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Análises</p>
                  <p className="text-2xl font-bold text-primary">{estatisticas.totalAnalises}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                  <p className="text-2xl font-bold text-success">{estatisticas.taxaAprovacao}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Médio</p>
                  <p className="text-2xl font-bold text-warning">{estatisticas.scoreMedia}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                  <p className="text-2xl font-bold" style={{ color: '#BC942C' }}>R$ {estatisticas.valorMedio.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8" style={{ color: '#BC942C' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento das Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-success">Aprovações</h3>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{estatisticas.aprovacoes}</p>
              <p className="text-sm text-gray-600">análises aprovadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-600">Reprovações</h3>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{estatisticas.reprovacoes}</p>
              <p className="text-sm text-gray-600">análises reprovadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-warning">Pendentes</h3>
                <Users className="h-5 w-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{estatisticas.pendentes}</p>
              <p className="text-sm text-gray-600">aguardando análise</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Faça download dos relatórios gerados anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosDisponiveis.map((relatorio) => (
                <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{relatorio.titulo}</h4>
                      <p className="text-sm text-gray-600">{relatorio.descricao}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">Período: {relatorio.periodo}</span>
                        <Badge variant="outline">{relatorio.tipo}</Badge>
                        <span className="text-xs text-gray-500">{relatorio.tamanho}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Gerado em</p>
                      <p className="text-sm font-medium">
                        {new Date(relatorio.dataGeracao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosAnalista;

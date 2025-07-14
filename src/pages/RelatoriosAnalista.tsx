
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Filter
} from 'lucide-react';
import { useRelatoriosAnalista } from '@/hooks/useRelatoriosAnalista';

const RelatoriosAnalista = () => {
  const {
    fiancas,
    relatoriosDisponiveis,
    loading,
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    buscarAnalises,
    gerarRelatorioXML,
    downloadRelatorio
  } = useRelatoriosAnalista();

  // Calcular estatísticas com base nos dados filtrados
  const estatisticas = {
    totalAnalises: fiancas.length,
    aprovacoes: fiancas.filter(f => f.status_fianca === 'aprovada').length,
    reprovacoes: fiancas.filter(f => f.status_fianca === 'rejeitada').length,
    pendentes: fiancas.filter(f => f.status_fianca === 'em_analise').length,
    taxaAprovacao: fiancas.length > 0 ? ((fiancas.filter(f => f.status_fianca === 'aprovada').length / fiancas.length) * 100).toFixed(1) : '0',
    scoreMedia: fiancas.length > 0 ? Math.round(fiancas.reduce((acc, f) => acc + (f.score_credito || 0), 0) / fiancas.length) : 0,
    valorMedio: fiancas.length > 0 ? Math.round(fiancas.reduce((acc, f) => acc + f.imovel_valor_aluguel, 0) / fiancas.length) : 0
  };

  const handleFiltrar = () => {
    buscarAnalises();
  };

  return (
    <Layout title="Relatórios">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Acompanhe suas métricas e gere relatórios detalhados</p>
          </div>
        </div>

        {/* Filtros de Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio.toISOString().split('T')[0]}
                  onChange={(e) => setDataInicio(new Date(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim.toISOString().split('T')[0]}
                  onChange={(e) => setDataFim(new Date(e.target.value))}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFiltrar} disabled={loading}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Filtrar Análises
                </Button>
                <Button onClick={gerarRelatorioXML} disabled={loading || fiancas.length === 0} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório XML
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Lista de Relatórios Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Seus relatórios gerados anteriormente estão disponíveis para download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosDisponiveis.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum relatório disponível</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use os filtros acima para gerar seus primeiros relatórios.
                  </p>
                </div>
              ) : (
                relatoriosDisponiveis.map((relatorio) => (
                  <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{relatorio.nome_arquivo}</h4>
                        <p className="text-sm text-gray-600">Relatório de análises do período selecionado</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="outline">XML</Badge>
                          {relatorio.periodo_inicio && relatorio.periodo_fim && (
                            <span className="text-xs text-gray-500">
                              Período: {relatorio.periodo_inicio} a {relatorio.periodo_fim}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-600">Gerado em</p>
                        <p className="text-sm font-medium">
                          {relatorio.data_geracao ? new Date(relatorio.data_geracao).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadRelatorio(relatorio.nome_arquivo)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosAnalista;

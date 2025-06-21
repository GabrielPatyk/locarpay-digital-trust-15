
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, TrendingDown, Users, Building, FileText, DollarSign, Download } from 'lucide-react';

const RelatoriosAdmin = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const metricas = {
    totalUsuarios: 2847,
    crescimentoUsuarios: 12.3,
    totalFiancas: 1523,
    valorTotalFiancas: 15234567.89,
    taxaAprovacao: 78.5,
    inadimplencia: 2.3
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const gerarRelatorio = (tipo: string) => {
    console.log(`Gerando relatório: ${tipo}`);
    // Aqui implementaria a lógica de geração do relatório
  };

  return (
    <Layout title="Relatórios">
      <div className="space-y-6">
        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-2xl font-bold">{metricas.totalUsuarios.toLocaleString()}</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{metricas.crescimentoUsuarios}% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Fianças</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold">{metricas.totalFiancas.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <span className="text-2xl font-bold">{formatCurrency(metricas.valorTotalFiancas)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Taxa de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold">{metricas.taxaAprovacao}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inadimplência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-2xl font-bold">{metricas.inadimplencia}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Imobiliárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold">247</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios por Categoria */}
        <Tabs defaultValue="operacional" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="operacional">Operacional</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="comercial">Comercial</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="juridico">Jurídico</TabsTrigger>
          </TabsList>

          <TabsContent value="operacional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fianças Ativas</CardTitle>
                  <CardDescription>Relatório de todas as fianças em vigência</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('fiancas-ativas')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contratos por Status</CardTitle>
                  <CardDescription>Análise dos contratos por situação</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('contratos-status')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance por Região</CardTitle>
                  <CardDescription>Métricas operacionais por localização</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('performance-regiao')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receita Mensal</CardTitle>
                  <CardDescription>Análise de receitas por período</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('receita-mensal')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inadimplência</CardTitle>
                  <CardDescription>Relatório detalhado de inadimplências</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('inadimplencia')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comissões</CardTitle>
                  <CardDescription>Relatório de comissões por executivo</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('comissoes')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comercial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leads por Fonte</CardTitle>
                  <CardDescription>Análise de origem dos leads</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('leads-fonte')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversão de Vendas</CardTitle>
                  <CardDescription>Taxa de conversão por período</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('conversao-vendas')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance SDR</CardTitle>
                  <CardDescription>Métricas de performance dos SDRs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('performance-sdr')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Crescimento de Usuários</CardTitle>
                  <CardDescription>Análise de crescimento da base</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('crescimento-usuarios')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Segmentação por Tipo</CardTitle>
                  <CardDescription>Usuários por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('segmentacao-usuarios')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atividade dos Usuários</CardTitle>
                  <CardDescription>Métricas de engajamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('atividade-usuarios')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="juridico" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processos em Andamento</CardTitle>
                  <CardDescription>Status dos processos jurídicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('processos-andamento')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sinistros por Tipo</CardTitle>
                  <CardDescription>Classificação dos sinistros</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('sinistros-tipo')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tempo de Resolução</CardTitle>
                  <CardDescription>Métricas de eficiência jurídica</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => gerarRelatorio('tempo-resolucao')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RelatoriosAdmin;

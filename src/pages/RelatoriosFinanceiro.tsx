
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRelatoriosFinanceiro, gerarRelatorioExcel } from '@/hooks/useRelatoriosFinanceiro';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, subMonths } from 'date-fns';

const RelatoriosFinanceiro = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { toast } = useToast();

  // Calcular período baseado na seleção
  const getPeriodo = () => {
    const hoje = new Date();
    switch (periodoSelecionado) {
      case 'semana':
        return { inicio: startOfWeek(hoje), fim: endOfWeek(hoje) };
      case 'mes':
        return { inicio: startOfMonth(hoje), fim: endOfMonth(hoje) };
      case 'trimestre':
        return { inicio: startOfMonth(subMonths(hoje, 2)), fim: endOfMonth(hoje) };
      case 'ano':
        return { inicio: startOfYear(hoje), fim: endOfYear(hoje) };
      case 'personalizado':
        return { 
          inicio: dataInicio ? new Date(dataInicio) : startOfMonth(hoje), 
          fim: dataFim ? new Date(dataFim) : endOfMonth(hoje) 
        };
      default:
        return { inicio: startOfMonth(hoje), fim: endOfMonth(hoje) };
    }
  };

  const { inicio, fim } = getPeriodo();
  const { data: relatorioData, isLoading, error } = useRelatoriosFinanceiro(inicio, fim);

  const gerarRelatorio = async (tipo: string) => {
    if (!relatorioData) {
      toast({
        title: "Erro",
        description: "Dados do relatório não disponíveis",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingReport(true);
    try {
      await gerarRelatorioExcel(relatorioData, tipo);
      toast({
        title: "Relatório gerado!",
        description: `Relatório de ${tipo} baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Relatórios Financeiros">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando relatórios...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Relatórios Financeiros">
        <div className="text-center text-red-600 p-8">
          Erro ao carregar dados: {(error as Error).message}
        </div>
      </Layout>
    );
  }

  const { estatisticas, dadosRecebimentos, dadosStatus } = relatorioData || {
    estatisticas: { totalRecebido: 0, totalPendente: 0, ticketMedio: 0, inadimplencia: 0, totalFiancas: 0 },
    dadosRecebimentos: [],
    dadosStatus: []
  };

  return (
    <Layout title="Relatórios Financeiros">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Relatórios Financeiros</h2>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="ano">Este Ano</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros personalizados */}
          {periodoSelecionado === 'personalizado' && (
            <Card>
              <CardHeader>
                <CardTitle>Período Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInicio">Data Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data Fim</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Recebido</p>
                  <p className="text-2xl font-bold text-success">
                    R$ {estatisticas.totalRecebido.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pendente</p>
                  <p className="text-2xl font-bold text-warning">
                    R$ {estatisticas.totalPendente.toLocaleString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {estatisticas.ticketMedio.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inadimplência</p>
                  <p className="text-2xl font-bold text-red-500">
                    {estatisticas.inadimplencia.toFixed(1)}%
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recebimentos por Mês</CardTitle>
              <CardDescription>Evolução dos recebimentos ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosRecebimentos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Valor']} />
                  <Bar dataKey="valor" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Pagamentos</CardTitle>
              <CardDescription>Distribuição atual dos status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {dadosStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ações de Relatório */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar Relatórios</CardTitle>
            <CardDescription>Exporte relatórios detalhados em PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => gerarRelatorio('recebimentos')}
                disabled={isGeneratingReport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Recebimentos (.csv)</span>
              </Button>

              <Button
                onClick={() => gerarRelatorio('inadimplencia')}
                disabled={isGeneratingReport}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Inadimplência (.csv)</span>
              </Button>

              <Button
                onClick={() => gerarRelatorio('analitico')}
                disabled={isGeneratingReport}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Analítico (.csv)</span>
              </Button>

              <Button
                onClick={() => gerarRelatorio('consolidado')}
                disabled={isGeneratingReport}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Consolidado (.csv)</span>
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Relatório Automático Mensal</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Todo primeiro dia do mês, um relatório do mês anterior será gerado automaticamente com suas fianças.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosFinanceiro;

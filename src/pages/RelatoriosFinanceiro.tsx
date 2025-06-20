
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Calendar
} from 'lucide-react';

const RelatoriosFinanceiro = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

  const dadosRecebimentos = [
    { mes: 'Jan', valor: 45000 },
    { mes: 'Fev', valor: 52000 },
    { mes: 'Mar', valor: 48000 },
    { mes: 'Abr', valor: 61000 },
    { mes: 'Mai', valor: 55000 },
    { mes: 'Jun', valor: 67000 }
  ];

  const dadosStatus = [
    { name: 'Pagos', value: 75, color: '#22c55e' },
    { name: 'Pendentes', value: 15, color: '#eab308' },
    { name: 'Vencidos', value: 10, color: '#ef4444' }
  ];

  const estatisticas = {
    totalRecebido: 328000,
    totalPendente: 45000,
    ticketMedio: 2850,
    inadimplencia: 8.5
  };

  const gerarRelatorio = (tipo: string) => {
    // Simular geração de relatório
    const link = document.createElement('a');
    link.href = '#';
    link.download = `relatorio-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  };

  return (
    <Layout title="Relatórios Financeiros">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
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
              </SelectContent>
            </Select>
          </div>
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
                    {estatisticas.inadimplencia}%
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
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Recebimentos</span>
              </Button>

              <Button
                onClick={() => gerarRelatorio('inadimplencia')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Inadimplência</span>
              </Button>

              <Button
                onClick={() => gerarRelatorio('analitico')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Analítico</span>
              </Button>

              <Button
                onClick={() => gerarRelatorio('consolidado')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Consolidado</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosFinanceiro;

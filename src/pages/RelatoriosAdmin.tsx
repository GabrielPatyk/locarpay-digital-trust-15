
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { 
  Download,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Filter
} from 'lucide-react';

const RelatoriosAdmin = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedReport, setSelectedReport] = useState('geral');

  // Dados para os gráficos
  const crescimentoUsuarios = [
    { mes: 'Jan', usuarios: 45, receita: 125000 },
    { mes: 'Fev', usuarios: 52, receita: 142000 },
    { mes: 'Mar', usuarios: 48, receita: 138000 },
    { mes: 'Abr', usuarios: 61, receita: 165000 },
    { mes: 'Mai', usuarios: 58, receita: 158000 },
    { mes: 'Jun', usuarios: 67, receita: 185000 },
  ];

  const tiposUsuarios = [
    { name: 'Inquilinos', value: 245, color: '#3b82f6' },
    { name: 'Imobiliárias', value: 89, color: '#f59e0b' },
    { name: 'Analistas', value: 23, color: '#10b981' },
    { name: 'Executivos', value: 12, color: '#8b5cf6' },
    { name: 'Jurídico', value: 8, color: '#ef4444' },
  ];

  const contratosPorStatus = [
    { status: 'Ativos', quantidade: 156, valor: 2840000 },
    { status: 'Pendentes', quantidade: 34, valor: 612000 },
    { status: 'Cancelados', quantidade: 12, valor: 180000 },
    { status: 'Vencidos', quantidade: 8, valor: 125000 },
  ];

  const performanceMensal = [
    { mes: 'Jan', leads: 120, conversoes: 45, contratos: 38 },
    { mes: 'Fev', leads: 135, conversoes: 52, contratos: 42 },
    { mes: 'Mar', leads: 148, conversoes: 48, contratos: 39 },
    { mes: 'Abr', leads: 162, conversoes: 61, contratos: 51 },
    { mes: 'Mai', leads: 155, conversoes: 58, contratos: 47 },
    { mes: 'Jun', leads: 178, conversoes: 67, contratos: 55 },
  ];

  const exportarRelatorio = (tipo: string) => {
    console.log(`Exportando relatório: ${tipo}`);
    // Aqui seria implementada a lógica de exportação
  };

  return (
    <Layout title="Relatórios Administrativos">
      <div className="space-y-6 animate-fade-in p-4 sm:p-6">
        {/* Controles de Filtro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Filter className="mr-2 h-5 w-5" />
              Filtros e Exportação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report">Tipo de Relatório</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Relatório Geral</SelectItem>
                    <SelectItem value="usuarios">Usuários</SelectItem>
                    <SelectItem value="contratos">Contratos</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFrom">Data Inicial</Label>
                <Input type="date" id="dateFrom" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo">Data Final</Label>
                <Input type="date" id="dateTo" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={() => exportarRelatorio('pdf')} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={() => exportarRelatorio('excel')} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button onClick={() => exportarRelatorio('csv')} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                  <p className="text-2xl font-bold text-primary">377</p>
                  <p className="text-xs text-green-500">+12% vs mês anterior</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                  <p className="text-2xl font-bold text-green-500">156</p>
                  <p className="text-xs text-green-500">+8% vs mês anterior</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-blue-500">R$ 185k</p>
                  <p className="text-xs text-green-500">+15% vs mês anterior</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-purple-500">37.6%</p>
                  <p className="text-xs text-green-500">+2.1% vs mês anterior</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Evolução mensal do número de usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={crescimentoUsuarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="usuarios" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
              <CardDescription>Por tipo de usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tiposUsuarios}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {tiposUsuarios.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Receita */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>Receita mensal em reais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={crescimentoUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                  <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contratos por Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contratos por Status</CardTitle>
              <CardDescription>Quantidade de contratos por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contratosPorStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance de Conversão</CardTitle>
              <CardDescription>Leads, conversões e contratos mensais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversoes" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="contratos" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Resumo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Contratos</CardTitle>
            <CardDescription>Valor total por status de contrato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="space-y-4">
                {contratosPorStatus.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'Ativos' ? 'bg-green-500' :
                        item.status === 'Pendentes' ? 'bg-yellow-500' :
                        item.status === 'Cancelados' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:flex sm:space-x-6">
                      <div>
                        <p className="text-sm text-gray-500">Quantidade</p>
                        <p className="font-semibold">{item.quantidade}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="font-semibold">R$ {item.valor.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosAdmin;

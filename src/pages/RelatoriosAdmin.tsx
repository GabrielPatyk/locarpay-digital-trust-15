import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { 
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Building,
  BarChart3
} from 'lucide-react';

const RelatoriosAdmin = () => {
  const [periodo, setPeriodo] = useState('30dias');
  const [tipoRelatorio, setTipoRelatorio] = useState('usuarios');

  // Dados para os gráficos
  const dadosUsuarios = [
    { mes: 'Jan', total: 45, ativos: 42, inativos: 3 },
    { mes: 'Fev', total: 52, ativos: 48, inativos: 4 },
    { mes: 'Mar', total: 61, ativos: 56, inativos: 5 },
    { mes: 'Abr', total: 67, ativos: 62, inativos: 5 },
    { mes: 'Mai', total: 73, ativos: 67, inativos: 6 },
    { mes: 'Jun', total: 81, ativos: 74, inativos: 7 },
  ];

  const dadosFinanceiros = [
    { mes: 'Jan', receita: 45000, despesas: 12000 },
    { mes: 'Fev', receita: 52000, despesas: 14000 },
    { mes: 'Mar', receita: 61000, despesas: 16000 },
    { mes: 'Abr', receita: 67000, despesas: 15000 },
    { mes: 'Mai', receita: 73000, despesas: 17000 },
    { mes: 'Jun', receita: 81000, despesas: 18000 },
  ];

  const dadosTiposUsuario = [
    { nome: 'Inquilinos', valor: 35, cor: '#8884d8' },
    { nome: 'Imobiliárias', valor: 15, cor: '#82ca9d' },
    { nome: 'Analistas', valor: 12, cor: '#ffc658' },
    { nome: 'Executivos', valor: 8, cor: '#ff7c7c' },
    { nome: 'SDR', valor: 6, cor: '#8dd1e1' },
    { nome: 'Jurídico', valor: 4, cor: '#d084d0' },
    { nome: 'Financeiro', valor: 3, cor: '#87d068' },
  ];

  const dadosContratos = [
    { mes: 'Jan', criados: 25, ativos: 120, cancelados: 5 },
    { mes: 'Fev', criados: 32, ativos: 147, cancelados: 3 },
    { mes: 'Mar', criados: 28, ativos: 172, cancelados: 7 },
    { mes: 'Abr', criados: 35, ativos: 200, cancelados: 4 },
    { mes: 'Mai', criados: 42, ativos: 238, cancelados: 6 },
    { mes: 'Jun', criados: 38, ativos: 270, cancelados: 8 },
  ];

  const exportarRelatorio = (tipo: string) => {
    console.log(`Exportando relatório de ${tipo}`);
    // Aqui implementaria a lógica de exportação
  };

  return (
    <Layout title="Relatórios Administrativos">
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-sm text-gray-600">Análise completa dos dados da plataforma</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                <SelectItem value="1ano">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Usuários</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">1,247</p>
                  <p className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-500">R$ 81k</p>
                  <p className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8%
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Contratos Ativos</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-500">270</p>
                  <p className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15%
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-500">15</p>
                  <p className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2
                  </p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Crescimento de Usuários</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportarRelatorio('usuarios')}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dadosUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="ativos" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Receitas vs Despesas</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportarRelatorio('financeiro')}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosFinanceiros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#10b981" />
                  <Bar dataKey="despesas" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Secundários */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Distribuição por Tipo</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportarRelatorio('tipos')}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dadosTiposUsuario}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="valor"
                  >
                    {dadosTiposUsuario.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Performance de Contratos</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportarRelatorio('contratos')}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dadosContratos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="criados" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="ativos" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="cancelados" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios Detalhados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Relatório de Usuários
              </CardTitle>
              <CardDescription className="text-sm">
                Análise completa da base de usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total de registros:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Crescimento mensal:</span>
                  <span className="font-medium text-green-500">+12%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => exportarRelatorio('usuarios-detalhado')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Relatório Financeiro
              </CardTitle>
              <CardDescription className="text-sm">
                Performance financeira da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Receita atual:</span>
                  <span className="font-medium">R$ 81.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Crescimento:</span>
                  <span className="font-medium text-green-500">+8%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => exportarRelatorio('financeiro-detalhado')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Relatório de Performance
              </CardTitle>
              <CardDescription className="text-sm">
                Métricas de performance geral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Taxa de conversão:</span>
                  <span className="font-medium">23.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Satisfação:</span>
                  <span className="font-medium text-green-500">94%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => exportarRelatorio('performance-detalhado')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RelatoriosAdmin;

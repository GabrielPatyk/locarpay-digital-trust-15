
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  FileText,
  Target,
  Calendar,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useDashboardExecutivo } from '@/hooks/useDashboardExecutivo';

const PerformanceExecutivo = () => {
  const { dashboardData, isLoading } = useDashboardExecutivo();

  // Mock data para os gráficos
  const monthlyData = [
    { month: 'Jan', vendas: 12, meta: 15 },
    { month: 'Fev', vendas: 18, meta: 15 },
    { month: 'Mar', vendas: 14, meta: 15 },
    { month: 'Abr', vendas: 22, meta: 20 },
    { month: 'Mai', vendas: 19, meta: 20 },
    { month: 'Jun', vendas: 25, meta: 20 },
  ];

  const statusData = [
    { name: 'Fechadas', value: 45, color: '#22c55e' },
    { name: 'Em Negociação', value: 25, color: '#f59e0b' },
    { name: 'Pendentes', value: 20, color: '#ef4444' },
    { name: 'Canceladas', value: 10, color: '#6b7280' },
  ];

  // Dados reais das imobiliárias
  const imobiliariasData = dashboardData?.imobiliarias?.map(imob => ({
    name: imob.nome,
    fiancas: imob.totalFiancas,
    valor: imob.valorTotal
  })) || [];

  if (isLoading) {
    return (
      <Layout title="Performance do Executivo">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Performance do Executivo">
      <div className="space-y-6 animate-fade-in">
        {/* Golden Banner */}
        <div className="bg-gradient-to-r from-[#F4D573] via-[#E6C46E] to-[#BC942C] rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-[#0C1C2E]" />
            <div>
              <h1 className="text-2xl font-bold text-[#0C1C2E]">Performance & Análises</h1>
              <p className="text-[#0C1C2E]/80">Acompanhe seus resultados e metas</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Fianças</p>
                  <p className="text-2xl font-bold text-primary">{dashboardData?.stats?.totalFiancas || 0}</p>
                  <p className="text-xs text-success flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Fianças geradas
                  </p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imobiliárias Ativas</p>
                  <p className="text-2xl font-bold text-warning">{dashboardData?.stats?.imobiliariasAtivas || 0}</p>
                  <p className="text-xs text-success">
                    de {dashboardData?.stats?.totalImobiliarias || 0} total
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Fianças</p>
                  <p className="text-2xl font-bold text-success">
                    R$ {dashboardData?.stats?.valorTotalFiancas?.toLocaleString('pt-BR') || '0'}
                  </p>
                  <p className="text-xs text-success flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Valor gerado
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
                  <p className="text-sm font-medium text-gray-600">Total Imobiliárias</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardData?.stats?.totalImobiliarias || 0}</p>
                  <p className="text-xs text-gray-500">
                    Cadastradas na plataforma
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Vendas Mensais */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas vs Meta Mensal</CardTitle>
              <CardDescription>Comparativo entre vendas realizadas e metas estabelecidas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendas" stroke="#22c55e" strokeWidth={2} name="Vendas" />
                  <Line type="monotone" dataKey="meta" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status das Negociações */}
          <Card>
            <CardHeader>
              <CardTitle>Status das Negociações</CardTitle>
              <CardDescription>Distribuição das negociações por status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-4 space-x-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance por Imobiliária */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Imobiliária</CardTitle>
            <CardDescription>Fianças e valores gerados por cada imobiliária</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={imobiliariasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fiancas" fill="#3b82f6" name="Fianças" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ranking de Imobiliárias */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Imobiliárias</CardTitle>
            <CardDescription>Classificação por valor total gerado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imobiliariasData
                .sort((a, b) => b.valor - a.valor)
                .map((imobiliaria, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{imobiliaria.name}</p>
                        <p className="text-sm text-gray-600">{imobiliaria.fiancas} fianças</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">
                        R$ {imobiliaria.valor.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Valor total</p>
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

export default PerformanceExecutivo;

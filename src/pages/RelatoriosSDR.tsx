
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const RelatoriosSDR = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('30');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');

  // Mock data para os gráficos
  const dadosConversao = [
    { nome: 'Jan', leads: 65, conversoes: 18, taxa: 27.7 },
    { nome: 'Fev', leads: 78, conversoes: 21, taxa: 26.9 },
    { nome: 'Mar', leads: 90, conversoes: 24, taxa: 26.7 },
    { nome: 'Abr', leads: 81, conversoes: 22, taxa: 27.2 },
    { nome: 'Mai', leads: 95, conversoes: 28, taxa: 29.5 },
    { nome: 'Jun', leads: 88, conversoes: 25, taxa: 28.4 }
  ];

  const dadosOrigem = [
    { nome: 'Website', valor: 35, cor: '#3B82F6' },
    { nome: 'LinkedIn', valor: 28, cor: '#10B981' },
    { nome: 'Indicação', valor: 20, cor: '#F59E0B' },
    { nome: 'Google Ads', valor: 12, cor: '#EF4444' },
    { nome: 'Outros', valor: 5, cor: '#8B5CF6' }
  ];

  const dadosStatus = [
    { status: 'Novos', quantidade: 23 },
    { status: 'Em Contato', quantidade: 18 },
    { status: 'Qualificados', quantidade: 15 },
    { status: 'Convertidos', quantidade: 12 },
    { status: 'Perdidos', quantidade: 8 }
  ];

  const metricas = {
    totalLeads: 542,
    leadsQualificados: 158,
    taxaConversao: 29.2,
    tempoMedioConversao: 5.3,
    leadsPorDia: 18.1,
    metaMensal: 600,
    progressoMeta: 90.3
  };

  const campanhasMaisEfetivas = [
    { nome: 'LinkedIn Outreach Q2', leads: 45, conversoes: 14, taxa: 31.1 },
    { nome: 'Email Marketing Maio', leads: 38, conversoes: 11, taxa: 28.9 },
    { nome: 'Google Ads Imobiliárias', leads: 29, conversoes: 8, taxa: 27.6 },
    { nome: 'Indicações Parceiros', leads: 22, conversoes: 7, taxa: 31.8 }
  ];

  const exportarRelatorio = () => {
    // Simular exportação
    const dados = {
      periodo: periodoSelecionado,
      tipo: tipoRelatorio,
      metricas: metricas,
      dados: dadosConversao
    };
    
    console.log('Exportando relatório:', dados);
    // Aqui você implementaria a lógica real de exportação
  };

  return (
    <Layout title="Relatórios SDR">
      <div className="space-y-6 animate-fade-in">
        {/* Header with filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-primary">Relatórios de Performance</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="180">Últimos 6 meses</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Geral</SelectItem>
                <SelectItem value="campanhas">Campanhas</SelectItem>
                <SelectItem value="conversao">Conversão</SelectItem>
                <SelectItem value="origem">Origem</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={exportarRelatorio} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                  <p className="text-2xl font-bold text-primary">{metricas.totalLeads}</p>
                  <p className="text-xs text-gray-500">Meta: {metricas.metaMensal}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads Qualificados</p>
                  <p className="text-2xl font-bold text-success">{metricas.leadsQualificados}</p>
                  <p className="text-xs text-gray-500">↑ 15% vs mês anterior</p>
                </div>
                <Target className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-warning">{metricas.taxaConversao}%</p>
                  <p className="text-xs text-gray-500">↑ 2.3% vs mês anterior</p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads por Dia</p>
                  <p className="text-2xl font-bold text-blue-500">{metricas.leadsPorDia}</p>
                  <p className="text-xs text-gray-500">Média móvel 30 dias</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Evolução de Leads e Conversões */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Leads e Conversões</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosConversao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={3} name="Leads" />
                  <Line type="monotone" dataKey="conversoes" stroke="#10B981" strokeWidth={3} name="Conversões" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Origem dos Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Origem dos Leads</CardTitle>
              <CardDescription>Distribuição por canal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosOrigem}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, valor }) => `${nome}: ${valor}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosOrigem.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Status dos Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Leads</CardTitle>
              <CardDescription>Distribuição atual do pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Progress Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Metas e Progresso</CardTitle>
              <CardDescription>Acompanhamento mensal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Meta Mensal de Leads</span>
                  <span className="text-sm text-gray-500">{metricas.totalLeads}/{metricas.metaMensal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${metricas.progressoMeta}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{metricas.progressoMeta}% da meta atingida</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-warning">{metricas.tempoMedioConversao}</p>
                  <p className="text-xs text-gray-600">Dias médios para conversão</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">{metricas.taxaConversao}%</p>
                  <p className="text-xs text-gray-600">Taxa de conversão média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campanhas Mais Efetivas */}
        <Card>
          <CardHeader>
            <CardTitle>Campanhas Mais Efetivas</CardTitle>
            <CardDescription>Performance das principais campanhas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campanhasMaisEfetivas.map((campanha, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{campanha.nome}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{campanha.leads} leads</span>
                      <span>{campanha.conversoes}

 conversões</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{campanha.taxa}%</p>
                    <p className="text-xs text-gray-500">Taxa de conversão</p>
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

export default RelatoriosSDR;

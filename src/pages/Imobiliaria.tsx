import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Calendar
} from 'lucide-react';

const Imobiliaria = () => {
  const { user } = useAuth();

  // Dados mock para demonstração
  const dashboardData = {
    totalImoveis: 47,
    inquilinosAtivos: 38,
    contratosPendentes: 5,
    receitaMensal: 85420,
    dadosGraficos: [
      { mes: 'Jan', contratos: 12, receita: 78000 },
      { mes: 'Fev', contratos: 15, receita: 82000 },
      { mes: 'Mar', contratos: 18, receita: 85420 },
    ],
    statusImoveis: [
      { name: 'Ocupados', value: 38, color: '#10b981' },
      { name: 'Vagos', value: 9, color: '#f59e0b' }
    ]
  };

  const contratosPendentes = [
    {
      id: 1,
      inquilino: 'Maria Silva',
      imovel: 'Apt 101 - Rua das Flores, 123',
      valor: 2500,
      status: 'aguardando_assinatura',
      dataVencimento: '2024-01-25'
    },
    {
      id: 2,
      inquilino: 'João Santos',
      imovel: 'Casa - Rua Central, 456',
      valor: 3200,
      status: 'analise_credito',
      dataVencimento: '2024-01-28'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'aguardando_assinatura': 'bg-yellow-500',
      'analise_credito': 'bg-blue-500',
      'aprovado': 'bg-green-500',
      'reprovado': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'aguardando_assinatura': 'Aguardando Assinatura',
      'analise_credito': 'Análise de Crédito',
      'aprovado': 'Aprovado',
      'reprovado': 'Reprovado'
    };
    return labels[status] || status;
  };

  return (
    <Layout title={`Dashboard - ${user?.name || 'Imobiliária'}`}>
      <div className="space-y-6 animate-fade-in">
        {/* Header com informações da imobiliária */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-6 text-[#0C1C2E]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Olá, {user?.name}!
              </h1>
              <p className="opacity-90">
                Bem-vindo ao seu painel de controle da LocarPay
              </p>
            </div>
            <Building className="h-12 w-12 opacity-50" />
          </div>
        </div>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{dashboardData.totalImoveis}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.statusImoveis[0].value} ocupados, {dashboardData.statusImoveis[1].value} vagos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos Ativos</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{dashboardData.inquilinosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                +3 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{dashboardData.contratosPendentes}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#BC942C]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-[#BC942C]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {(dashboardData.receitaMensal / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">
                +5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com conteúdo detalhado */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="tenants">Inquilinos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Contratos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    Evolução de Contratos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.dadosGraficos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="contratos" fill="#BC942C" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status dos Imóveis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-success" />
                    Status dos Imóveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.statusImoveis}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {dashboardData.statusImoveis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Contratos Pendentes</h3>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Contrato
              </Button>
            </div>

            <div className="space-y-4">
              {contratosPendentes.map((contrato) => (
                <Card key={contrato.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{contrato.inquilino}</h4>
                        <p className="text-sm text-gray-600">{contrato.imovel}</p>
                      </div>
                      <Badge className={`${getStatusColor(contrato.status)} text-white`}>
                        {getStatusLabel(contrato.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Valor do Aluguel</p>
                        <p className="font-medium">R$ {contrato.valor.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vencimento</p>
                        <p className="font-medium">{new Date(contrato.dataVencimento).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-3 w-3" />
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lista de Imóveis</h3>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Imóvel
              </Button>
            </div>
            <Card>
              <CardContent>
                <p>Em breve, a listagem completa dos imóveis da sua imobiliária estará disponível aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lista de Inquilinos</h3>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Inquilino
              </Button>
            </div>
            <Card>
              <CardContent>
                <p>Em breve, a listagem completa dos seus inquilinos estará disponível aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Imobiliaria;

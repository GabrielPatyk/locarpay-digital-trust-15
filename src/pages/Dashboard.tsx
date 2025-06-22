import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { UserType } from '@/types/user';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getDashboardRoute = () => {
    switch (user?.type) {
      case 'analista': return '/analista';
      case 'juridico': return '/juridico';
      case 'sdr': return '/sdr';
      case 'executivo': return '/executivo';
      case 'imobiliaria': return '/imobiliaria';
      case 'inquilino': return '/inquilino';
      case 'financeiro': return '/financeiro';
      case 'admin': return '/admin';
      default: return '/dashboard';
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Bom dia';
    if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else if (hour >= 18) greeting = 'Boa noite';
    
    return `${greeting}, ${user?.name}!`;
  };

  const getQuickStats = () => {
    // Mock data - in real app this would come from API
    const baseStats = {
      totalContracts: 1247,
      activeGuarantees: 892,
      pendingApprovals: 23,
      monthlyRevenue: 125000
    };

    return baseStats;
  };

  const getRecentActivities = () => {
    return [
      {
        id: 1,
        type: 'approval',
        message: 'Nova proposta aguardando aprovação',
        time: '2 minutos atrás',
        status: 'pending'
      },
      {
        id: 2,
        type: 'contract',
        message: 'Contrato assinado - Imob. Central',
        time: '15 minutos atrás',
        status: 'success'
      },
      {
        id: 3,
        type: 'payment',
        message: 'Pagamento processado - João Silva',
        time: '1 hora atrás',
        status: 'success'
      },
      {
        id: 4,
        type: 'alert',
        message: 'Score de crédito requer atenção',
        time: '2 horas atrás',
        status: 'warning'
      }
    ];
  };

  const stats = getQuickStats();
  const activities = getRecentActivities();

  return (
    <Layout title="Dashboard Principal">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section with LocarPay branding */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-6 text-[#0C1C2E] relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
          <p className="opacity-90 mb-4">
            Bem-vindo à plataforma LocarPay. Aqui você tem acesso aos principais indicadores e pode navegar para sua área específica.
          </p>
          <Button 
            onClick={() => navigate(getDashboardRoute())}
            className="bg-white text-[#0C1C2E] hover:bg-gray-100 font-semibold shadow-md"
          >
            Ir para minha área
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#F4D573]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Contratos
              </CardTitle>
              <FileText className="h-4 w-4 text-[#BC942C]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalContracts}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fianças Ativas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeGuarantees}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeGuarantees / stats.totalContracts) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aprovações Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Requer atenção imediata
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#BC942C]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#BC942C]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {(stats.monthlyRevenue / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">
                +8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#BC942C]" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas movimentações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-success' :
                      activity.status === 'warning' ? 'bg-warning' :
                      'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'warning' ? 'secondary' :
                      'outline'
                    }>
                      {activity.status === 'success' ? 'Concluído' :
                       activity.status === 'warning' ? 'Atenção' :
                       'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-warning" />
                Notificações Importantes
              </CardTitle>
              <CardDescription>
                Itens que precisam da sua atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-warning pl-4">
                  <h4 className="font-medium text-gray-900">Assinaturas Pendentes</h4>
                  <p className="text-sm text-gray-600">
                    5 contratos aguardando assinatura digital
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-gray-900">Pagamentos em Atraso</h4>
                  <p className="text-sm text-gray-600">
                    3 pagamentos com vencimento em aberto
                  </p>
                </div>
                <div className="border-l-4 border-[#BC942C] pl-4">
                  <h4 className="font-medium text-gray-900">Novos Leads</h4>
                  <p className="text-sm text-gray-600">
                    8 novos leads para análise comercial
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

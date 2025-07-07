import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInquilinosImobiliaria, InquilinoFianca } from '@/hooks/useInquilinosImobiliaria';
import { useContratosLocarpay } from '@/hooks/useContratosLocarpay';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import InquilinoDetalhesModal from '@/components/InquilinoDetalhesModal';
import ContratoPendenteModal from '@/components/ContratoPendenteModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  User,
  Loader2
} from 'lucide-react';

const Imobiliaria = () => {
  const { user } = useAuth();
  const { formatPhone } = usePhoneFormatter();
  const { inquilinos, isLoading: inquilinosLoading, getStatusColor, getStatusLabel, getVerificationColor, getVerificationLabel } = useInquilinosImobiliaria();
  const { 
    verificarECriarContrato, 
    isLoading: contratosLoading, 
    hasError: contratosError,
    temContratoPendente,
    getContratoPendente
  } = useContratosLocarpay();
  
  const [selectedInquilino, setSelectedInquilino] = useState<InquilinoFianca | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contratoModalOpen, setContratoModalOpen] = useState(false);
  const [inquilinosAtivos, setInquilinosAtivos] = useState(0);
  const [novosInquilinosNoMes, setNovosInquilinosNoMes] = useState(0);
  const [loadingInquilinos, setLoadingInquilinos] = useState(true);

  // Buscar dados reais de inquilinos ativos
  useEffect(() => {
    const fetchInquilinosAtivos = async () => {
      if (!user || user.type !== 'imobiliaria') return;

      try {
        setLoadingInquilinos(true);
        
        // Buscar inquilinos ativos (com status 'ativa')
        const { data: inquilinosAtivosData, error: inquilinosAtivosError } = await supabase
          .from('fiancas_locaticias')
          .select('*')
          .eq('id_imobiliaria', user.id)
          .eq('status_fianca', 'ativa');

        if (inquilinosAtivosError) {
          console.error('Erro ao buscar inquilinos ativos:', inquilinosAtivosError);
        } else {
          setInquilinosAtivos(inquilinosAtivosData?.length || 0);
        }

        // Buscar novos inquilinos do mês atual
        const inicioDoMes = new Date();
        inicioDoMes.setDate(1);
        inicioDoMes.setHours(0, 0, 0, 0);

        const { data: novosInquilinosData, error: novosInquilinosError } = await supabase
          .from('fiancas_locaticias')
          .select('*')
          .eq('id_imobiliaria', user.id)
          .gte('data_criacao', inicioDoMes.toISOString());

        if (novosInquilinosError) {
          console.error('Erro ao buscar novos inquilinos:', novosInquilinosError);
        } else {
          setNovosInquilinosNoMes(novosInquilinosData?.length || 0);
        }
      } catch (error) {
        console.error('Erro geral ao buscar dados de inquilinos:', error);
      } finally {
        setLoadingInquilinos(false);
      }
    };

    fetchInquilinosAtivos();
  }, [user]);

  // Verificar e criar contrato LocarPay se necessário
  useEffect(() => {
    if (user?.type === 'imobiliaria' && !contratosLoading && !contratosError) {
      const timer = setTimeout(() => {
        verificarECriarContrato();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, verificarECriarContrato, contratosLoading, contratosError]);

  // Verificar se deve abrir o modal de contrato pendente
  useEffect(() => {
    if (!contratosLoading && temContratoPendente()) {
      const timer = setTimeout(() => {
        setContratoModalOpen(true);
      }, 2000); // Aguardar 2 segundos após o carregamento

      return () => clearTimeout(timer);
    }
  }, [contratosLoading, temContratoPendente]);

  // Definir dados do dashboard após carregar os dados dos inquilinos
  const totalImoveis = 47;
  const contratosPendentes = 5;
  const receitaMensal = 85420;
  
  const dashboardData = {
    totalImoveis,
    contratosPendentes,
    receitaMensal,
    dadosGraficos: [
      { mes: 'Jan', contratos: 12, receita: 78000 },
      { mes: 'Fev', contratos: 15, receita: 82000 },
      { mes: 'Mar', contratos: 18, receita: 85420 },
    ],
    statusImoveis: [
      { name: 'Ocupados', value: inquilinosAtivos, color: '#10b981' },
      { name: 'Vagos', value: totalImoveis - inquilinosAtivos, color: '#f59e0b' }
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

  const getStatusColorContrato = (status: string) => {
    const colors: { [key: string]: string } = {
      'aguardando_assinatura': 'bg-yellow-500',
      'analise_credito': 'bg-blue-500',
      'aprovado': 'bg-green-500',
      'reprovado': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabelContrato = (status: string) => {
    const labels: { [key: string]: string } = {
      'aguardando_assinatura': 'Aguardando Assinatura',
      'analise_credito': 'Análise de Crédito',
      'aprovado': 'Aprovado',
      'reprovado': 'Reprovado'
    };
    return labels[status] || status;
  };

  const handleLigar = (telefone: string) => {
    if (telefone) {
      window.open(`tel:${telefone}`, '_self');
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const contratoPendente = getContratoPendente();

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
                {inquilinosAtivos} ocupados, {dashboardData.totalImoveis - inquilinosAtivos} vagos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos Ativos</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {loadingInquilinos ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Carregando...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-success">{inquilinosAtivos}</div>
                  <p className="text-xs text-muted-foreground">
                    +{novosInquilinosNoMes} novos este mês
                  </p>
                </>
              )}
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
                      <Badge className={`${getStatusColorContrato(contrato.status)} text-white`}>
                        {getStatusLabelContrato(contrato.status)}
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
            </div>
            
            {inquilinosLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  {inquilinos.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum inquilino encontrado</h3>
                      <p className="text-gray-600">
                        Ainda não há inquilinos cadastrados para sua imobiliária.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquilinos.map((inquilino) => (
                        <div
                          key={inquilino.id}
                          className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                            <div>
                              <h4 className="font-medium text-gray-900">{inquilino.nome}</h4>
                              <p className="text-sm text-gray-600">CPF: {inquilino.cpf}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={inquilino.statusAtivo ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                                {inquilino.statusAtivo ? 'Ativo' : 'Inativo'}
                              </Badge>
                              <Badge className={inquilino.statusVerificacao === 'verificado' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                                {inquilino.statusVerificacao === 'verificado' ? 'Verificado' : 'Verificação Pendente'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500">E-mail</p>
                              <p className="text-sm font-medium truncate">{inquilino.email || 'Não informado'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Telefone</p>
                              <p className="text-sm font-medium">{inquilino.telefone ? formatPhone(inquilino.telefone) : 'Não informado'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Fianças</p>
                              <p className="text-sm font-medium">{inquilino.totalFiancas}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Valor Aluguel</p>
                              <p className="text-sm font-medium text-success">
                                R$ {inquilino.valorAluguel.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedInquilino(inquilino);
                                setModalOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </Button>
                            {inquilino.telefone && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLigar(inquilino.telefone)}
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Ligar
                              </Button>
                            )}
                            {inquilino.email && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEmail(inquilino.email)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                E-mail
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes do Inquilino */}
      <InquilinoDetalhesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        inquilino={selectedInquilino}
      />

      {/* Modal de Contrato Pendente */}
      <ContratoPendenteModal
        isOpen={contratoModalOpen}
        onClose={() => setContratoModalOpen(false)}
        linkAssinatura={contratoPendente?.link_assinatura}
      />
    </Layout>
  );
};

export default Imobiliaria;

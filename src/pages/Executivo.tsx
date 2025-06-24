
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardExecutivo } from '@/hooks/useDashboardExecutivo';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { toast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  FileText, 
  DollarSign,
  Phone, 
  Mail, 
  Eye,
  Loader2,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const Executivo = () => {
  const { dashboardData, isLoading } = useDashboardExecutivo();
  const { formatPhone, formatCNPJ } = usePhoneFormatter();

  const handleLigar = (telefone: string) => {
    if (telefone) {
      window.open(`tel:${telefone}`, '_self');
    } else {
      toast({
        title: "Telefone não disponível",
        description: "Esta imobiliária não possui telefone cadastrado.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    } else {
      toast({
        title: "E-mail não disponível",
        description: "Esta imobiliária não possui e-mail cadastrado.",
        variant: "destructive",
      });
    }
  };

  const handleVerDetalhes = (imobiliaria: any) => {
    toast({
      title: "Detalhes da Imobiliária",
      description: `${imobiliaria.nome} - ${imobiliaria.totalFiancas} fianças ativas`,
    });
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-success' : 'bg-red-500';
  };

  const getStatusText = (ativo: boolean) => {
    return ativo ? 'Ativa' : 'Inativa';
  };

  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return 'Não informado';
    return formatPhone(phone);
  };

  const formatCNPJForDisplay = (cnpj: string) => {
    if (!cnpj) return 'Não informado';
    return formatCNPJ(cnpj);
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard Executivo">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const stats = dashboardData?.stats || {
    totalImobiliarias: 0,
    imobiliariasAtivas: 0,
    totalFiancas: 0,
    valorTotalFiancas: 0
  };

  const imobiliarias = dashboardData?.imobiliarias || [];

  return (
    <Layout title="Dashboard Executivo">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Executivo</h1>
          <p className="text-gray-600">Visão geral do seu desempenho e imobiliárias</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Imobiliárias</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalImobiliarias}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imobiliárias Ativas</p>
                  <p className="text-2xl font-bold text-success">{stats.imobiliariasAtivas}</p>
                </div>
                <UserCheck className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Fianças</p>
                  <p className="text-2xl font-bold text-warning">{stats.totalFiancas}</p>
                </div>
                <FileText className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Fianças</p>
                  <p className="text-2xl font-bold text-success">R$ {stats.valorTotalFiancas.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minhas Imobiliárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Minhas Imobiliárias
            </CardTitle>
            <CardDescription>
              Lista de imobiliárias parceiras cadastradas por você
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imobiliarias.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma imobiliária cadastrada</h3>
                <p className="text-gray-600 mb-4">Comece cadastrando sua primeira imobiliária parceira.</p>
                <Button className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]">
                  Cadastrar Imobiliária
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {imobiliarias.slice(0, 5).map((imobiliaria: any) => (
                  <div
                    key={imobiliaria.id}
                    className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                      <div>
                        <h4 className="font-medium text-gray-900">{imobiliaria.nome}</h4>
                        <p className="text-sm text-gray-600">
                          CNPJ: {formatCNPJForDisplay(imobiliaria.perfil_usuario?.cnpj || '')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Contato: {imobiliaria.nome}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(imobiliaria.ativo)} text-white`}>
                        {getStatusText(imobiliaria.ativo)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">E-mail</p>
                        <p className="text-sm font-medium truncate">{imobiliaria.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="text-sm font-medium">{formatPhoneForDisplay(imobiliaria.telefone || '')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Fianças</p>
                        <p className="text-sm font-medium">{imobiliaria.totalFiancas || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="text-sm font-medium text-success">
                          R$ {(imobiliaria.valorTotal || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Endereço</p>
                      <p className="text-sm text-gray-900">
                        {imobiliaria.perfil_usuario ? 
                          `${imobiliaria.perfil_usuario.endereco}, ${imobiliaria.perfil_usuario.numero} - ${imobiliaria.perfil_usuario.bairro}, ${imobiliaria.perfil_usuario.cidade}/${imobiliaria.perfil_usuario.estado}` 
                          : 'Endereço não informado'
                        }
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerDetalhes(imobiliaria)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLigar(imobiliaria.telefone || '')}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Ligar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEmail(imobiliaria.email)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        E-mail
                      </Button>
                    </div>
                  </div>
                ))}
                
                {imobiliarias.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      Ver Todas as Imobiliárias ({imobiliarias.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Ativação</span>
                  <span className="font-medium">
                    {stats.totalImobiliarias > 0 
                      ? Math.round((stats.imobiliariasAtivas / stats.totalImobiliarias) * 100)
                      : 0
                    }%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Média Fianças/Imobiliária</span>
                  <span className="font-medium">
                    {stats.totalImobiliarias > 0 
                      ? Math.round(stats.totalFiancas / stats.totalImobiliarias)
                      : 0
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Médio/Fiança</span>
                  <span className="font-medium">
                    R$ {stats.totalFiancas > 0 
                      ? Math.round(stats.valorTotalFiancas / stats.totalFiancas).toLocaleString()
                      : 0
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]">
                  <Building className="mr-2 h-4 w-4" />
                  Cadastrar Nova Imobiliária
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Relatórios
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Parcerias
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Executivo;

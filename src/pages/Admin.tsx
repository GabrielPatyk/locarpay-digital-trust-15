
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  status: 'ativo' | 'inativo';
  ultimoAcesso: string;
  dataCreacao: string;
}

interface LogAcao {
  id: string;
  usuario: string;
  acao: string;
  timestamp: string;
  detalhes: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('usuarios');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const usuarios: Usuario[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      email: 'analista@locarpay.com',
      tipo: 'analista',
      status: 'ativo',
      ultimoAcesso: '2024-01-15T10:30:00',
      dataCreacao: '2023-06-15'
    },
    {
      id: '2',
      nome: 'Dr. João Santos',
      email: 'juridico@locarpay.com',
      tipo: 'juridico',
      status: 'ativo',
      ultimoAcesso: '2024-01-15T09:15:00',
      dataCreacao: '2023-06-15'
    },
    {
      id: '3',
      nome: 'Carlos Oliveira',
      email: 'sdr@locarpay.com',
      tipo: 'sdr',
      status: 'ativo',
      ultimoAcesso: '2024-01-15T11:45:00',
      dataCreacao: '2023-07-01'
    },
    {
      id: '4',
      nome: 'Ana Costa',
      email: 'executivo@locarpay.com',
      tipo: 'executivo',
      status: 'ativo',
      ultimoAcesso: '2024-01-14T16:20:00',
      dataCreacao: '2023-07-15'
    }
  ];

  const logsAcoes: LogAcao[] = [
    {
      id: '1',
      usuario: 'Maria Silva',
      acao: 'Proposta Aprovada',
      timestamp: '2024-01-15T10:30:00',
      detalhes: 'Proposta ID: 123 - João Silva Santos'
    },
    {
      id: '2',
      usuario: 'Carlos Oliveira',
      acao: 'Lead Qualificado',
      timestamp: '2024-01-15T10:15:00',
      detalhes: 'Lead: Roberto Silva - Imobiliária Sucesso'
    },
    {
      id: '3',
      usuario: 'Ana Costa',
      acao: 'Imobiliária Vinculada',
      timestamp: '2024-01-15T09:45:00',
      detalhes: 'Imobiliária: Prime - Contato: Roberto'
    },
    {
      id: '4',
      usuario: 'Dr. João Santos',
      acao: 'Sinistro Analisado',
      timestamp: '2024-01-15T09:30:00',
      detalhes: 'Contrato ID: 456 - Inadimplência'
    }
  ];

  const alterarStatusUsuario = (usuarioId: string, novoStatus: 'ativo' | 'inativo') => {
    toast({
      title: "Status alterado!",
      description: `Usuário ${novoStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'bg-success' : 'bg-red-500';
  };

  const getTipoLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      'analista': 'Analista de Conta',
      'juridico': 'Departamento Jurídico',
      'sdr': 'SDR - Comercial',
      'executivo': 'Executivo de Conta',
      'imobiliaria': 'Imobiliária',
      'inquilino': 'Inquilino',
      'admin': 'Administrador'
    };
    return labels[tipo] || tipo;
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsuarios: usuarios.length,
    usuariosAtivos: usuarios.filter(u => u.status === 'ativo').length,
    usuariosInativos: usuarios.filter(u => u.status === 'inativo').length,
    logsHoje: logsAcoes.filter(l => 
      new Date(l.timestamp).toDateString() === new Date().toDateString()
    ).length
  };

  return (
    <Layout title="Administração">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalUsuarios}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-success">{stats.usuariosAtivos}</p>
                </div>
                <Shield className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
                  <p className="text-2xl font-bold text-red-500">{stats.usuariosInativos}</p>
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ações Hoje</p>
                  <p className="text-2xl font-bold text-warning">{stats.logsHoje}</p>
                </div>
                <Activity className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="logs">Logs de Ação</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Gestão de Usuários
                    </CardTitle>
                    <CardDescription>
                      Gerencie todos os usuários da plataforma
                    </CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{usuario.nome}</h4>
                          <p className="text-sm text-gray-600">{usuario.email}</p>
                          <p className="text-sm text-gray-500">{getTipoLabel(usuario.tipo)}</p>
                        </div>
                        <Badge className={`${getStatusColor(usuario.status)} text-white`}>
                          {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Último Acesso</p>
                          <p className="text-sm font-medium">
                            {new Date(usuario.ultimoAcesso).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data de Criação</p>
                          <p className="text-sm font-medium">
                            {new Date(usuario.dataCreacao).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alterarStatusUsuario(
                            usuario.id, 
                            usuario.status === 'ativo' ? 'inativo' : 'ativo'
                          )}
                        >
                          {usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Logs de Ação
                </CardTitle>
                <CardDescription>
                  Histórico de todas as ações realizadas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logsAcoes.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{log.acao}</h4>
                          <p className="text-sm text-gray-600">Por: {log.usuario}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{log.detalhes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Configure parâmetros gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taxaMinima">Taxa Mínima de Fiança (%)</Label>
                    <Input
                      id="taxaMinima"
                      type="number"
                      defaultValue="8"
                      className="w-32"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="taxaMaxima">Taxa Máxima de Fiança (%)</Label>
                    <Input
                      id="taxaMaxima"
                      type="number"
                      defaultValue="15"
                      className="w-32"
                    />
                  </div>

                  <div>
                    <Label htmlFor="scoreMinimo">Score Mínimo para Aprovação</Label>
                    <Input
                      id="scoreMinimo"
                      type="number"
                      defaultValue="500"
                      className="w-32"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emailNotificacao">E-mail para Notificações</Label>
                    <Input
                      id="emailNotificacao"
                      type="email"
                      defaultValue="admin@locarpay.com"
                      className="w-80"
                    />
                  </div>
                </div>

                <Button className="bg-primary hover:bg-primary/90">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Relatórios e Estatísticas
                </CardTitle>
                <CardDescription>
                  Gere relatórios gerenciais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Relatório de Fianças
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    Relatório de Usuários
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Activity className="h-6 w-6 mb-2" />
                    Relatório de Atividades
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="h-6 w-6 mb-2" />
                    Relatório de Segurança
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;

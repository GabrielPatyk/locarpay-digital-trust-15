import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { UserType } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsuarioDB {
  id: string;
  nome: string;
  email: string;
  cargo: UserType;
  ativo: boolean;
  telefone: string | null;
  criado_em: string;
  atualizado_em: string;
}

const Admin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UsuarioDB | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    tipo: 'inquilino' as UserType,
    senha: '',
    telefone: ''
  });

  // Verificar se o usuário atual é admin
  const isAdmin = user?.type === 'admin';

  // Buscar usuários do banco de dados
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      console.log('Iniciando busca de usuários...');
      console.log('Usuário atual:', user);
      console.log('É admin?', isAdmin);

      let query = supabase.from('usuarios').select('*', { count: 'exact' });

      // Se não é admin, só busca seus próprios dados
      if (!isAdmin && user?.email) {
        query = query.eq('email', user.email);
      }

      const { data, error, count } = await query.order('criado_em', { ascending: false });

      console.log('Resposta da consulta:', { data, error, count });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        
        if (error.code === '42501' || error.message.includes('policy')) {
          if (!isAdmin) {
            toast({
              title: "Acesso Limitado",
              description: "Você pode visualizar apenas seus próprios dados. Para acessar todos os usuários, você precisa ser um administrador.",
              variant: "default"
            });
          } else {
            toast({
              title: "Erro de permissão",
              description: "Erro de permissão no banco de dados. Contacte o suporte técnico.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Erro",
            description: `Erro ao carregar usuários: ${error.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Dados recebidos:', data);
      console.log('Total de registros:', count);

      if (!data || data.length === 0) {
        console.log('Nenhum usuário encontrado na base de dados');
        if (isAdmin) {
          toast({
            title: "Aviso",
            description: "Nenhum usuário encontrado na base de dados. Você pode criar o primeiro usuário.",
            variant: "default"
          });
        }
      }

      // Formatar usuários
      const usuariosFormatados = data?.map(usuario => ({
        ...usuario,
        cargo: usuario.cargo as UserType
      })) || [];

      console.log('Usuários formatados:', usuariosFormatados);
      setUsuarios(usuariosFormatados);
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsuarios();
    }
  }, [user, isAdmin]);

  const criarUsuario = async () => {
    if (!isAdmin) {
      toast({
        title: "Erro de permissão",
        description: "Apenas administradores podem criar usuários.",
        variant: "destructive"
      });
      return;
    }

    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
      toast({
        title: "Erro",
        description: "Nome, e-mail e senha são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Criando usuário:', novoUsuario);
      
      // Primeiro, vamos gerar o hash da senha usando a função do Supabase
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password: novoUsuario.senha });

      if (hashError) {
        console.error('Erro ao gerar hash da senha:', hashError);
        toast({
          title: "Erro",
          description: "Erro ao processar a senha.",
          variant: "destructive"
        });
        return;
      }

      console.log('Hash da senha gerado com sucesso');
      
      // Criar o usuário com a senha hasheada
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            senha: hashedPassword,
            cargo: novoUsuario.tipo,
            telefone: novoUsuario.telefone || null,
            ativo: true
          }
        ])
        .select();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        
        if (error.code === '23505' && error.message.includes('duplicate')) {
          toast({
            title: "Erro",
            description: "Este e-mail já está em uso.",
            variant: "destructive"
          });
        } else if (error.code === '42501') {
          toast({
            title: "Erro de permissão",
            description: "Você não tem permissão para criar usuários. Verifique se você é um administrador.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro",
            description: `Erro ao criar usuário: ${error.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Usuário criado:', data);
      toast({
        title: "Usuário criado!",
        description: `Usuário ${novoUsuario.nome} criado com sucesso.`,
      });
      
      setIsCreateModalOpen(false);
      setNovoUsuario({ nome: '', email: '', tipo: 'inquilino', senha: '', telefone: '' });
      fetchUsuarios(); // Recarregar lista
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar usuário.",
        variant: "destructive"
      });
    }
  };

  const alterarStatusUsuario = async (usuarioId: string, novoStatus: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Erro de permissão",
        description: "Apenas administradores podem alterar status de usuários.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Alterando status do usuário:', usuarioId, 'para:', novoStatus);
      
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: novoStatus })
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast({
          title: "Erro",
          description: `Erro ao alterar status: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Status alterado!",
        description: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });
      
      fetchUsuarios(); // Recarregar lista
    } catch (err) {
      console.error('Erro:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao alterar status.",
        variant: "destructive"
      });
    }
  };

  const excluirUsuario = async (usuarioId: string) => {
    if (!isAdmin) {
      toast({
        title: "Erro de permissão",
        description: "Apenas administradores podem excluir usuários.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      console.log('Excluindo usuário:', usuarioId);
      
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao excluir usuário:', error);
        toast({
          title: "Erro",
          description: `Erro ao excluir usuário: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Usuário excluído!",
        description: "Usuário excluído com sucesso.",
      });
      
      fetchUsuarios(); // Recarregar lista
    } catch (err) {
      console.error('Erro:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir usuário.",
        variant: "destructive"
      });
    }
  };

  const handleViewUser = (usuario: UsuarioDB) => {
    setSelectedUser(usuario);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (usuario: UsuarioDB) => {
    if (usuario.cargo === 'imobiliaria') {
      navigate(`/editar-imobiliaria/${usuario.id}`);
    } else {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A edição para este tipo de usuário estará disponível em breve.",
      });
    }
  };

  const stats = {
    totalUsuarios: usuarios.length,
    usuariosAtivos: usuarios.filter(u => u.ativo).length,
    usuariosInativos: usuarios.filter(u => !u.ativo).length,
    porTipo: {
      analista: usuarios.filter(u => u.cargo === 'analista').length,
      juridico: usuarios.filter(u => u.cargo === 'juridico').length,
      sdr: usuarios.filter(u => u.cargo === 'sdr').length,
      executivo: usuarios.filter(u => u.cargo === 'executivo').length,
      imobiliaria: usuarios.filter(u => u.cargo === 'imobiliaria').length,
      inquilino: usuarios.filter(u => u.cargo === 'inquilino').length,
      financeiro: usuarios.filter(u => u.cargo === 'financeiro').length,
      admin: usuarios.filter(u => u.cargo === 'admin').length,
    }
  };

  // Dados para os gráficos
  const chartDataTipos = [
    { name: 'Analistas', value: stats.porTipo.analista, color: '#3b82f6' },
    { name: 'Jurídico', value: stats.porTipo.juridico, color: '#8b5cf6' },
    { name: 'SDR', value: stats.porTipo.sdr, color: '#f97316' },
    { name: 'Executivos', value: stats.porTipo.executivo, color: '#10b981' },
    { name: 'Imobiliárias', value: stats.porTipo.imobiliaria, color: '#eab308' },
    { name: 'Inquilinos', value: stats.porTipo.inquilino, color: '#6b7280' },
    { name: 'Financeiro', value: stats.porTipo.financeiro, color: '#14b8a6' },
    { name: 'Admins', value: stats.porTipo.admin, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const statusData = [
    { name: 'Ativos', value: stats.usuariosAtivos, color: '#10b981' },
    { name: 'Inativos', value: stats.usuariosInativos, color: '#ef4444' },
  ];

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-green-500' : 'bg-red-500';
  };

  const getTipoLabel = (tipo: UserType) => {
    const labels: { [key in UserType]: string } = {
      'analista': 'Analista de Conta',
      'juridico': 'Departamento Jurídico',
      'sdr': 'SDR - Comercial',
      'executivo': 'Executivo de Conta',
      'imobiliaria': 'Imobiliária',
      'inquilino': 'Inquilino',
      'financeiro': 'Departamento Financeiro',
      'admin': 'Administrador'
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo: UserType) => {
    const colors: { [key in UserType]: string } = {
      'analista': 'bg-blue-500',
      'juridico': 'bg-purple-500',
      'sdr': 'bg-orange-500',
      'executivo': 'bg-green-500',
      'imobiliaria': 'bg-yellow-500',
      'inquilino': 'bg-gray-500',
      'financeiro': 'bg-teal-500',
      'admin': 'bg-red-500'
    };
    return colors[tipo] || 'bg-gray-500';
  };

  const filteredUsuarios = usuarios.filter(u => {
    const matchesSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'todos' || u.cargo === filterTipo;
    const matchesStatus = filterStatus === 'todos' || 
                         (filterStatus === 'ativo' && u.ativo) ||
                         (filterStatus === 'inativo' && !u.ativo);
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  if (loading) {
    return (
      <Layout title="Gestão de Usuários">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando usuários...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Usuários">
      <div className="space-y-4 lg:space-y-6 animate-fade-in max-w-full overflow-hidden">
        {/* Alerta se não é admin */}
        {!isAdmin && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Acesso Limitado</p>
                  <p className="text-sm text-orange-700">
                    Você está visualizando apenas seus próprios dados. Para acessar todos os usuários, você precisa ser um administrador.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card className="min-w-0">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">
                    {isAdmin ? 'Total Usuários' : 'Seus Dados'}
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-primary">{stats.totalUsuarios}</p>
                </div>
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-primary flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Usuários Ativos</p>
                  <p className="text-lg lg:text-2xl font-bold text-green-500">{stats.usuariosAtivos}</p>
                </div>
                <UserPlus className="h-6 w-6 lg:h-8 lg:w-8 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Usuários Inativos</p>
                  <p className="text-lg lg:text-2xl font-bold text-red-500">{stats.usuariosInativos}</p>
                </div>
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-red-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Imobiliárias</p>
                  <p className="text-lg lg:text-2xl font-bold text-yellow-500">{stats.porTipo.imobiliaria}</p>
                </div>
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos - só mostra se é admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card className="min-w-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm lg:text-base">Distribuição por Tipo</CardTitle>
              </CardHeader>
              <CardContent className="p-2 lg:p-4">
                <div className="w-full h-48 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataTipos}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {chartDataTipos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm lg:text-base">Status dos Usuários</CardTitle>
              </CardHeader>
              <CardContent className="p-2 lg:p-4">
                <div className="w-full h-48 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gestão de Usuários */}
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="min-w-0">
                <CardTitle className="flex items-center text-base lg:text-lg">
                  <Users className="mr-2 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">
                    {isAdmin ? 'Gestão de Usuários' : 'Meus Dados'}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs lg:text-sm">
                  {isAdmin 
                    ? 'Gerencie todos os usuários da plataforma' 
                    : 'Visualize seus dados pessoais'
                  }
                </CardDescription>
              </div>
              
              {isAdmin && (
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-base">Criar Novo Usuário</DialogTitle>
                      <DialogDescription className="text-sm">
                        Preencha os dados para criar um novo usuário na plataforma.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome" className="text-sm">Nome Completo</Label>
                        <Input
                          id="nome"
                          value={novoUsuario.nome}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Digite o nome completo"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={novoUsuario.email}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Digite o e-mail"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="telefone" className="text-sm">Telefone (opcional)</Label>
                        <Input
                          id="telefone"
                          value={novoUsuario.telefone}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, telefone: e.target.value }))}
                          placeholder="Digite o telefone"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="tipo" className="text-sm">Tipo de Usuário</Label>
                        <Select 
                          value={novoUsuario.tipo} 
                          onValueChange={(value: UserType) => setNovoUsuario(prev => ({ ...prev, tipo: value }))}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="analista">Analista de Conta</SelectItem>
                            <SelectItem value="juridico">Departamento Jurídico</SelectItem>
                            <SelectItem value="sdr">SDR - Comercial</SelectItem>
                            <SelectItem value="executivo">Executivo de Conta</SelectItem>
                            <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                            <SelectItem value="inquilino">Inquilino</SelectItem>
                            <SelectItem value="financeiro">Departamento Financeiro</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="senha" className="text-sm">Senha</Label>
                        <Input
                          id="senha"
                          type="password"
                          value={novoUsuario.senha}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                          placeholder="Digite uma senha"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="w-full sm:w-auto text-sm">
                        Cancelar
                      </Button>
                      <Button onClick={criarUsuario} className="w-full sm:w-auto text-sm">
                        Criar Usuário
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {/* Filtros - só mostra se é admin */}
            {isAdmin && (
              <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4 mt-4">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:flex-shrink-0">
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger className="w-full sm:w-[180px] text-sm">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="analista">Analista</SelectItem>
                      <SelectItem value="juridico">Jurídico</SelectItem>
                      <SelectItem value="sdr">SDR</SelectItem>
                      <SelectItem value="executivo">Executivo</SelectItem>
                      <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                      <SelectItem value="inquilino">Inquilino</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[150px] text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 lg:space-y-4">
              {filteredUsuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="p-3 lg:p-4 rounded-lg border hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="flex flex-col space-y-3 lg:flex-row lg:justify-between lg:items-start lg:space-y-0 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">{usuario.nome}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getTipoColor(usuario.cargo)} text-white text-xs`}>
                            {getTipoLabel(usuario.cargo)}
                          </Badge>
                          <Badge className={`${getStatusColor(usuario.ativo)} text-white text-xs`}>
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600 truncate">{usuario.email}</p>
                      {usuario.telefone && (
                        <p className="text-xs text-gray-500">{usuario.telefone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Data de Criação</p>
                      <p className="text-xs lg:text-sm font-medium">
                        {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Última Atualização</p>
                      <p className="text-xs lg:text-sm font-medium">
                        {new Date(usuario.atualizado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleViewUser(usuario)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleEditUser(usuario)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alterarStatusUsuario(usuario.id, !usuario.ativo)}
                        className="text-xs"
                      >
                        {usuario.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => excluirUsuario(usuario.id)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredUsuarios.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {usuarios.length === 0 
                      ? (isAdmin 
                        ? "Não há usuários cadastrados na plataforma. Crie o primeiro usuário usando o botão 'Novo Usuário'."
                        : "Seus dados não foram encontrados na plataforma."
                        )
                      : "Tente ajustar os filtros ou termos de busca."
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Visualização do Usuário */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                Informações completas do usuário selecionado
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nome Completo</Label>
                    <p className="text-sm font-medium">{selectedUser.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">E-mail</Label>
                    <p className="text-sm font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Tipo de Usuário</Label>
                    <Badge className={`${getTipoColor(selectedUser.cargo)} text-white`}>
                      {getTipoLabel(selectedUser.cargo)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={`${getStatusColor(selectedUser.ativo)} text-white`}>
                      {selectedUser.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  {selectedUser.telefone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                      <p className="text-sm font-medium">{selectedUser.telefone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">ID do Usuário</Label>
                    <p className="text-sm font-mono text-gray-600">{selectedUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Criação</Label>
                    <p className="text-sm font-medium">
                      {new Date(selectedUser.criado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Última Atualização</Label>
                    <p className="text-sm font-medium">
                      {new Date(selectedUser.atualizado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </Button>
              {selectedUser && (
                <Button onClick={() => handleEditUser(selectedUser)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Usuário
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;


import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Users, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  UserPlus
} from 'lucide-react';
import { UserType } from '@/types/user';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  status: 'ativo' | 'inativo';
  ultimoAcesso: string;
  dataCreacao: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    tipo: 'inquilino' as UserType,
    senha: '',
    whatsapp: '',
    cpf: '',
    empresa: '',
    cnpj: '',
    endereco: '',
    telefone: ''
  });

  // Mock data expandido
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
    },
    {
      id: '5',
      nome: 'Imobiliária Prime',
      email: 'prime@imobiliarias.com',
      tipo: 'imobiliaria',
      status: 'ativo',
      ultimoAcesso: '2024-01-15T08:30:00',
      dataCreacao: '2023-08-01'
    },
    {
      id: '6',
      nome: 'João Silva Santos',
      email: 'joao@inquilino.com',
      tipo: 'inquilino',
      status: 'ativo',
      ultimoAcesso: '2024-01-15T12:15:00',
      dataCreacao: '2023-09-15'
    },
    {
      id: '7',
      nome: 'Lucas Oliveira',
      email: 'financeiro@locarpay.com',
      tipo: 'financeiro',
      status: 'ativo',
      ultimoAcesso: '2024-01-15T14:20:00',
      dataCreacao: '2023-10-01'
    }
  ];

  const criarUsuario = () => {
    const camposObrigatorios = ['nome', 'email', 'senha'];
    
    if (novoUsuario.tipo === 'inquilino') {
      camposObrigatorios.push('whatsapp', 'cpf');
    } else if (novoUsuario.tipo === 'imobiliaria') {
      camposObrigatorios.push('empresa', 'cnpj', 'endereco', 'telefone');
    }

    const camposFaltando = camposObrigatorios.filter(campo => !novoUsuario[campo as keyof typeof novoUsuario]);
    
    if (camposFaltando.length > 0) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Usuário criado!",
      description: `Usuário ${novoUsuario.nome} criado com sucesso.`,
    });
    
    setIsCreateModalOpen(false);
    setNovoUsuario({ 
      nome: '', 
      email: '', 
      tipo: 'inquilino', 
      senha: '', 
      whatsapp: '', 
      cpf: '', 
      empresa: '', 
      cnpj: '', 
      endereco: '', 
      telefone: '' 
    });
  };

  const alterarStatusUsuario = (usuarioId: string, novoStatus: 'ativo' | 'inativo') => {
    toast({
      title: "Status alterado!",
      description: `Usuário ${novoStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'bg-green-500' : 'bg-red-500';
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
    const matchesTipo = filterTipo === 'todos' || u.tipo === filterTipo;
    const matchesStatus = filterStatus === 'todos' || u.status === filterStatus;
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  const stats = {
    totalUsuarios: usuarios.length,
    usuariosAtivos: usuarios.filter(u => u.status === 'ativo').length,
    usuariosInativos: usuarios.filter(u => u.status === 'inativo').length,
    porTipo: {
      analista: usuarios.filter(u => u.tipo === 'analista').length,
      juridico: usuarios.filter(u => u.tipo === 'juridico').length,
      sdr: usuarios.filter(u => u.tipo === 'sdr').length,
      executivo: usuarios.filter(u => u.tipo === 'executivo').length,
      imobiliaria: usuarios.filter(u => u.tipo === 'imobiliaria').length,
      inquilino: usuarios.filter(u => u.tipo === 'inquilino').length,
      financeiro: usuarios.filter(u => u.tipo === 'financeiro').length,
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
  ];

  const crescimentoUsuarios = [
    { mes: 'Jun', usuarios: 12 },
    { mes: 'Jul', usuarios: 19 },
    { mes: 'Ago', usuarios: 24 },
    { mes: 'Set', usuarios: 31 },
    { mes: 'Out', usuarios: 38 },
    { mes: 'Nov', usuarios: 45 },
    { mes: 'Dez', usuarios: 52 },
    { mes: 'Jan', usuarios: 67 },
  ];

  const statusData = [
    { name: 'Ativos', value: stats.usuariosAtivos, color: '#10b981' },
    { name: 'Inativos', value: stats.usuariosInativos, color: '#ef4444' },
  ];

  const renderFormularioEspecifico = () => {
    if (novoUsuario.tipo === 'inquilino') {
      return (
        <>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              value={novoUsuario.whatsapp}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              value={novoUsuario.cpf}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, cpf: e.target.value }))}
              placeholder="000.000.000-00"
            />
          </div>
        </>
      );
    }

    if (novoUsuario.tipo === 'imobiliaria') {
      return (
        <>
          <div className="grid gap-2">
            <Label htmlFor="empresa">Nome da Empresa *</Label>
            <Input
              id="empresa"
              value={novoUsuario.empresa}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, empresa: e.target.value }))}
              placeholder="Nome da imobiliária"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={novoUsuario.cnpj}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, cnpj: e.target.value }))}
              placeholder="00.000.000/0001-00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={novoUsuario.endereco}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, endereco: e.target.value }))}
              placeholder="Endereço completo"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={novoUsuario.telefone}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(11) 3333-4444"
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <Layout title="Gestão de Usuários">
      <div className="space-y-6 animate-fade-in p-4 sm:p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-2xl font-bold text-green-500">{stats.usuariosAtivos}</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-500" />
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
                  <p className="text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.porTipo.imobiliaria}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataTipos}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
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

          <Card>
            <CardHeader>
              <CardTitle>Status dos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crescimento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crescimentoUsuarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usuarios" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gestão de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Gestão de Usuários
                </CardTitle>
                <CardDescription>
                  Gerencie todos os usuários da plataforma
                </CardDescription>
              </div>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo usuário na plataforma.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={novoUsuario.nome}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Digite o nome completo"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={novoUsuario.email}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Digite o e-mail"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="tipo">Tipo de Usuário *</Label>
                      <Select 
                        value={novoUsuario.tipo} 
                        onValueChange={(value: UserType) => setNovoUsuario(prev => ({ ...prev, tipo: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inquilino">Inquilino</SelectItem>
                          <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                          <SelectItem value="analista">Analista de Conta</SelectItem>
                          <SelectItem value="juridico">Departamento Jurídico</SelectItem>
                          <SelectItem value="sdr">SDR - Comercial</SelectItem>
                          <SelectItem value="executivo">Executivo de Conta</SelectItem>
                          <SelectItem value="financeiro">Departamento Financeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {renderFormularioEspecifico()}
                    
                    <div className="grid gap-2">
                      <Label htmlFor="senha">Senha Temporária *</Label>
                      <Input
                        id="senha"
                        type="password"
                        value={novoUsuario.senha}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                        placeholder="Digite uma senha temporária"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={criarUsuario}>
                      Criar Usuário
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px]">
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
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {filteredUsuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{usuario.nome}</h4>
                        <Badge className={`${getTipoColor(usuario.tipo)} text-white`}>
                          {getTipoLabel(usuario.tipo)}
                        </Badge>
                        <Badge className={`${getStatusColor(usuario.status)} text-white`}>
                          {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
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

                  <div className="flex flex-wrap gap-2">
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
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredUsuarios.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tente ajustar os filtros ou termos de busca.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;

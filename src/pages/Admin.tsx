
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
    // Campos específicos
    nomeCompleto: '',
    whatsapp: '',
    cpf: '',
    cnpj: '',
    nomeEmpresa: '',
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
    // Validações específicas por tipo
    const camposObrigatorios = ['email', 'senha'];
    
    if (novoUsuario.tipo === 'inquilino') {
      camposObrigatorios.push('nomeCompleto', 'whatsapp', 'cpf');
    } else if (novoUsuario.tipo === 'imobiliaria') {
      camposObrigatorios.push('nomeEmpresa', 'cnpj', 'endereco', 'telefone');
    } else {
      camposObrigatorios.push('nome');
    }

    const campoVazio = camposObrigatorios.find(campo => !novoUsuario[campo as keyof typeof novoUsuario]);
    
    if (campoVazio) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Usuário criado!",
      description: `Usuário ${novoUsuario.nome || novoUsuario.nomeCompleto || novoUsuario.nomeEmpresa} criado com sucesso.`,
    });
    
    setIsCreateModalOpen(false);
    setNovoUsuario({ 
      nome: '', 
      email: '', 
      tipo: 'inquilino', 
      senha: '',
      nomeCompleto: '',
      whatsapp: '',
      cpf: '',
      cnpj: '',
      nomeEmpresa: '',
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
  const statusData = [
    { name: 'Ativos', value: stats.usuariosAtivos, color: '#10b981' },
    { name: 'Inativos', value: stats.usuariosInativos, color: '#ef4444' },
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

  const renderFormularioEspecifico = () => {
    switch (novoUsuario.tipo) {
      case 'inquilino':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                value={novoUsuario.nomeCompleto}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                placeholder="Digite o nome completo"
              />
            </div>
            
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
        
      case 'imobiliaria':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
              <Input
                id="nomeEmpresa"
                value={novoUsuario.nomeEmpresa}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                placeholder="Digite o nome da imobiliária"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={novoUsuario.cnpj}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0000-00"
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
        
      default:
        return (
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={novoUsuario.nome}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome completo"
            />
          </div>
        );
    }
  };

  return (
    <Layout title="Gestão de Usuários">
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Usuários</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{stats.totalUsuarios}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-500">{stats.usuariosAtivos}</p>
                </div>
                <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Usuários Inativos</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-500">{stats.usuariosInativos}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-500">{stats.porTipo.imobiliaria}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Status dos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Crescimento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={crescimentoUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usuarios" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gestão de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Users className="mr-2 h-5 w-5" />
                  Gestão de Usuários
                </CardTitle>
                <CardDescription className="text-sm">
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
                      <Label htmlFor="tipo">Tipo de Usuário *</Label>
                      <Select 
                        value={novoUsuario.tipo} 
                        onValueChange={(value: UserType) => setNovoUsuario(prev => ({ ...prev, tipo: value }))}
                      >
                        <SelectTrigger>
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
                        </SelectContent>
                      </Select>
                    </div>

                    {renderFormularioEspecifico()}
                    
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
                  
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                    <Button onClick={criarUsuario} className="w-full sm:w-auto">
                      Criar Usuário
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="relative">
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
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{usuario.nome}</h4>
                        <Badge className={`${getTipoColor(usuario.tipo)} text-white text-xs`}>
                          {getTipoLabel(usuario.tipo)}
                        </Badge>
                        <Badge className={`${getStatusColor(usuario.status)} text-white text-xs`}>
                          {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{usuario.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Último Acesso</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(usuario.ultimoAcesso).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Data de Criação</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(usuario.dataCreacao).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alterarStatusUsuario(
                        usuario.id, 
                        usuario.status === 'ativo' ? 'inativo' : 'ativo'
                      )}
                      className="text-xs"
                    >
                      {usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 text-xs">
                      <Trash2 className="mr-1 h-3 w-3" />
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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  User, 
  Users, 
  Building, 
  TrendingUp, 
  Loader2, 
  Eye,
  Edit,
  UserX,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useExecutivosAdmin } from '@/hooks/useExecutivosAdmin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ExecutivosAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [executivoToDelete, setExecutivoToDelete] = useState<any>(null);

  const {
    executivos,
    isLoading,
    error,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    stats
  } = useExecutivosAdmin(searchTerm, statusFilter);

  const atualizarStatusMutation = useMutation({
    mutationFn: async ({ executivoId, ativo }: { executivoId: string, ativo: boolean }) => {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo })
        .eq('id', executivoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executivos-admin'] });
    }
  });

  const excluirMutation = useMutation({
    mutationFn: async ({ executivoId }: { executivoId: string }) => {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', executivoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executivos-admin'] });
    }
  });

  const handleDesativar = async (executivoId: string, currentStatus: boolean) => {
    try {
      await atualizarStatusMutation.mutateAsync({
        executivoId,
        ativo: !currentStatus
      });

      toast({
        title: currentStatus ? "Executivo desativado!" : "Executivo ativado!",
        description: `O executivo foi ${currentStatus ? 'desativado' : 'ativado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do executivo.",
        variant: "destructive"
      });
    }
  };

  const handleExcluir = async (executivoId: string) => {
    try {
      await excluirMutation.mutateAsync({ executivoId });
      
      toast({
        title: "Executivo excluído!",
        description: "O executivo foi removido do sistema.",
      });
      setExecutivoToDelete(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir executivo.",
        variant: "destructive"
      });
    }
  };

  const handleViewExecutivo = (executivoId: string) => {
    // TODO: Implementar página de detalhes do executivo
    toast({
      title: "Em desenvolvimento",
      description: "Página de detalhes do executivo em desenvolvimento.",
    });
  };

  const handleEditExecutivo = (executivoId: string) => {
    navigate(`/editar-executivo/${executivoId}`);
  };

  if (isLoading) {
    return (
      <Layout title="Gestão de Executivos">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Gestão de Executivos">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar executivos: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Executivos">
      <div className="space-y-6">
        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Executivos</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-500">{stats.ativos}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold text-red-500">{stats.inativos}</p>
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance Média</p>
                  <p className="text-2xl font-bold text-primary">{stats.performanceMedia}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imobiliárias Total</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalImobiliarias}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Todos os Executivos</CardTitle>
                <CardDescription>Gerencie a equipe de executivos de conta</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executivos.length > 0 ? (
                executivos.map((executivo) => (
                  <div key={executivo.id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{executivo.nome}</h4>
                        <p className="text-sm text-gray-600">{executivo.email}</p>
                        {executivo.telefone && (
                          <p className="text-sm text-gray-600">{executivo.telefone}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(executivo.status)}>
                        {getStatusLabel(executivo.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total de Imobiliárias</p>
                        <p className="font-medium">{executivo.totalImobiliarias}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Imobiliárias Ativas</p>
                        <p className="font-medium text-green-600">{executivo.imobiliariasAtivas}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Performance</p>
                        <p className="font-medium">
                          {executivo.totalImobiliarias > 0 
                            ? Math.round((executivo.imobiliariasAtivas / executivo.totalImobiliarias) * 100)
                            : 0
                          }%
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Cadastrado em: {new Date(executivo.dataCriacao).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewExecutivo(executivo.id)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditExecutivo(executivo.id)}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant={executivo.status === 'ativo' ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleDesativar(executivo.id, executivo.status === 'ativo')}
                          disabled={atualizarStatusMutation.isPending}
                        >
                          <UserX className="mr-1 h-4 w-4" />
                          {executivo.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setExecutivoToDelete(executivo)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum executivo encontrado
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'todos'
                      ? 'Tente ajustar sua busca ou filtros.'
                      : 'Nenhum executivo cadastrado ainda.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Confirmação de Exclusão */}
        {executivoToDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Confirmar Exclusão
                </CardTitle>
                <CardDescription>
                  Esta ação não pode ser desfeita. Tem certeza que deseja excluir o executivo{' '}
                  <strong>{executivoToDelete.nome}</strong>?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleExcluir(executivoToDelete.id)}
                    disabled={excluirMutation.isPending}
                    className="flex-1"
                  >
                    {excluirMutation.isPending ? 'Excluindo...' : 'Sim, Excluir'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setExecutivoToDelete(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExecutivosAdmin;

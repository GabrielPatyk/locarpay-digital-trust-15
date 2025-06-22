
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useImobiliarias } from '@/hooks/useImobiliarias';
import { 
  Building, 
  Users, 
  FileText, 
  AlertTriangle,
  Eye,
  Edit,
  UserX,
  Trash2,
  Search
} from 'lucide-react';

const ImobiliariasAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { imobiliarias, stats, isLoading, atualizarStatusImobiliaria, excluirImobiliaria, isUpdating } = useImobiliarias();
  const [searchTerm, setSearchTerm] = useState('');
  const [imobiliariaToDelete, setImobiliariaToDelete] = useState<any>(null);

  const handleDesativar = async (imobiliariaId: string, currentStatus: boolean) => {
    try {
      await atualizarStatusImobiliaria.mutateAsync({
        imobiliariaId,
        ativo: !currentStatus
      });

      toast({
        title: currentStatus ? "Imobiliária desativada!" : "Imobiliária ativada!",
        description: `A imobiliária foi ${currentStatus ? 'desativada' : 'ativada'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status da imobiliária.",
        variant: "destructive"
      });
    }
  };

  const handleExcluir = async (imobiliariaId: string) => {
    try {
      await excluirImobiliaria.mutateAsync({ imobiliariaId });
      
      toast({
        title: "Imobiliária excluída!",
        description: "A imobiliária foi removida do sistema.",
      });
      setImobiliariaToDelete(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir imobiliária.",
        variant: "destructive"
      });
    }
  };

  const filteredImobiliarias = imobiliarias.filter(imobiliaria => {
    const nomeEmpresa = imobiliaria.perfil_usuario?.nome_empresa || '';
    const cnpj = imobiliaria.perfil_usuario?.cnpj || '';
    
    return (
      imobiliaria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imobiliaria.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cnpj.includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <Layout title="Gestão de Imobiliárias">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando imobiliárias...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Imobiliárias">
      <div className="space-y-6">
        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold text-green-500">{stats.ativas}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inativas</p>
                  <p className="text-2xl font-bold text-red-500">{stats.inativas}</p>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Total</p>
                  <p className="text-2xl font-bold text-primary">{stats.contratosTotais}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar imobiliárias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Lista de Imobiliárias */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Imobiliárias</CardTitle>
            <CardDescription>Gerencie todas as imobiliárias parceiras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredImobiliarias.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma imobiliária encontrada.</p>
                </div>
              ) : (
                filteredImobiliarias.map((imobiliaria) => (
                  <div key={imobiliaria.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-lg">
                          {imobiliaria.perfil_usuario?.nome_empresa || imobiliaria.nome}
                        </h4>
                        <p className="text-sm text-gray-600">
                          CNPJ: {imobiliaria.perfil_usuario?.cnpj || 'Não informado'}
                        </p>
                      </div>
                      <Badge className={imobiliaria.ativo ? "bg-green-500" : "bg-red-500"}>
                        {imobiliaria.ativo ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">E-mail</p>
                        <p className="font-medium">{imobiliaria.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{imobiliaria.telefone || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Responsável</p>
                        <p className="font-medium">{imobiliaria.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fianças Ativas</p>
                        <p className="font-medium">0</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant={imobiliaria.ativo ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleDesativar(imobiliaria.id, imobiliaria.ativo)}
                        disabled={isUpdating}
                      >
                        <UserX className="mr-1 h-4 w-4" />
                        {imobiliaria.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setImobiliariaToDelete(imobiliaria)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Confirmação de Exclusão */}
        {imobiliariaToDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Confirmar Exclusão
                </CardTitle>
                <CardDescription>
                  Esta ação não pode ser desfeita. Tem certeza que deseja excluir a imobiliária{' '}
                  <strong>{imobiliariaToDelete.perfil_usuario?.nome_empresa || imobiliariaToDelete.nome}</strong>?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleExcluir(imobiliariaToDelete.id)}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? 'Excluindo...' : 'Sim, Excluir'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setImobiliariaToDelete(null)}
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

export default ImobiliariasAdmin;

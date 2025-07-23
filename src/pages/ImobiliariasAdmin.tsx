
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
  Search,
  CheckCircle,
  XCircle,
  Clock
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

  const handleViewImobiliaria = (imobiliariaId: string) => {
    navigate(`/detalhe-imobiliaria/${imobiliariaId}`);
  };

  const handleEditImobiliaria = (imobiliariaId: string) => {
    navigate(`/editar-imobiliaria/${imobiliariaId}`);
  };

  const getDocumentStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'verificado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'verificando':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDocumentStatusText = (status: string | undefined) => {
    switch (status) {
      case 'verificado':
        return 'Verificado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'verificando':
        return 'Em verificação';
      default:
        return 'Pendente';
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
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                          <div className="min-w-0">
                            <h4 className="font-medium text-lg truncate">
                              {imobiliaria.perfil_usuario?.nome_empresa || imobiliaria.nome}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              CNPJ: {imobiliaria.perfil_usuario?.cnpj || 'Não informado'}
                            </p>
                          </div>
                          <Badge className={imobiliaria.ativo ? "bg-green-500 flex-shrink-0" : "bg-red-500 flex-shrink-0"}>
                            {imobiliaria.ativo ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <div className="min-w-0">
                            <p className="text-sm text-gray-500">E-mail</p>
                            <p className="font-medium truncate" title={imobiliaria.email}>
                              {imobiliaria.email}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-500">Telefone</p>
                            <p className="font-medium truncate">
                              {imobiliaria.telefone || 'Não informado'}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-500">Responsável</p>
                            <p className="font-medium truncate" title={imobiliaria.nome}>
                              {imobiliaria.nome}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-500">Fianças Ativas</p>
                            <p className="font-medium">0</p>
                          </div>
                        </div>
                        
                        {/* Status dos Documentos */}
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Status dos Documentos:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2">
                              {getDocumentStatusIcon(imobiliaria.perfil_usuario?.status_cartao_cnpj)}
                              <div>
                                <p className="text-xs text-gray-500">CNPJ</p>
                                <p className="text-sm font-medium">
                                  {getDocumentStatusText(imobiliaria.perfil_usuario?.status_cartao_cnpj)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getDocumentStatusIcon(imobiliaria.perfil_usuario?.status_comprovante_endereco)}
                              <div>
                                <p className="text-xs text-gray-500">Endereço</p>
                                <p className="text-sm font-medium">
                                  {getDocumentStatusText(imobiliaria.perfil_usuario?.status_comprovante_endereco)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getDocumentStatusIcon(imobiliaria.perfil_usuario?.status_cartao_creci)}
                              <div>
                                <p className="text-xs text-gray-500">CRECI</p>
                                <p className="text-sm font-medium">
                                  {getDocumentStatusText(imobiliaria.perfil_usuario?.status_cartao_creci)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 lg:flex-col lg:w-auto justify-start lg:justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewImobiliaria(imobiliaria.id)}
                          className="flex-1 sm:flex-none"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditImobiliaria(imobiliaria.id)}
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant={imobiliaria.ativo ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleDesativar(imobiliaria.id, imobiliaria.ativo)}
                          disabled={isUpdating}
                          className="flex-1 sm:flex-none"
                        >
                          <UserX className="mr-1 h-4 w-4" />
                          {imobiliaria.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setImobiliariaToDelete(imobiliaria)}
                          className="flex-1 sm:flex-none"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
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

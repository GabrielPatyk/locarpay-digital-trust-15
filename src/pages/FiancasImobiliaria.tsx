
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Plus, Filter, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useFiancas } from '@/hooks/useFiancas';
import CriarFiancaModal from '@/components/CriarFiancaModal';

const FiancasImobiliaria = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const {
    fiancas,
    stats,
    isLoading,
    error,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    formatCurrency
  } = useFiancas(searchTerm, statusFilter);

  const handleViewFianca = (fiancaId: string) => {
    navigate(`/detalhe-fianca/${fiancaId}`);
  };

  if (isLoading) {
    return (
      <Layout title="Minhas Fianças">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Minhas Fianças">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar fianças: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Minhas Fianças">
      <div className="space-y-4 px-2 sm:px-0">
        {/* Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Fianças</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{stats.totalFiancas}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Em Análise</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-500">{stats.emAnalise}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-500">{stats.aprovadas}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-sm sm:text-xl font-bold text-primary">{formatCurrency(stats.valorTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Lista de Fianças</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar por inquilino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Fiança
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Fiança</DialogTitle>
                      <DialogDescription>
                        Preencha os dados para criar uma nova solicitação de fiança
                      </DialogDescription>
                    </DialogHeader>
                    <CriarFiancaModal onClose={() => setShowCreateModal(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] px-3 py-2 text-xs">Inquilino</TableHead>
                      <TableHead className="w-[200px] px-3 py-2 text-xs">Imóvel</TableHead>
                      <TableHead className="w-[120px] px-3 py-2 text-xs">Valor Aluguel</TableHead>
                      <TableHead className="w-[100px] px-3 py-2 text-xs">Status</TableHead>
                      <TableHead className="w-[80px] px-3 py-2 text-xs">Data</TableHead>
                      <TableHead className="w-[60px] px-3 py-2 text-xs">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fiancas.map((fianca) => (
                      <TableRow key={fianca.id} className="hover:bg-gray-50">
                        <TableCell className="px-3 py-2">
                          <div className="max-w-[190px]">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {fianca.inquilino_nome_completo}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {fianca.inquilino_email}
                            </p>
                          </div>
                        </TableCell>
                        
                        <TableCell className="px-3 py-2">
                          <div className="max-w-[190px]">
                            <p className="text-xs text-gray-900 truncate">
                              {fianca.imovel_endereco}, {fianca.imovel_numero}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {fianca.imovel_bairro}
                            </p>
                          </div>
                        </TableCell>
                        
                        <TableCell className="px-3 py-2">
                          <span className="text-xs font-medium">
                            {formatCurrency(fianca.imovel_valor_aluguel)}
                          </span>
                        </TableCell>
                        
                        <TableCell className="px-3 py-2">
                          <Badge className={`${getStatusColor(fianca.status_fianca)} text-white text-xs`}>
                            {getStatusLabel(fianca.status_fianca)}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="px-3 py-2">
                          <span className="text-xs text-gray-500">
                            {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                        
                        <TableCell className="px-3 py-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewFianca(fianca.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {fiancas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Nenhuma fiança encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? "Tente ajustar sua busca" : "Comece criando sua primeira fiança"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasImobiliaria;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Filter, FileText } from 'lucide-react';
import { useFiancasAdmin } from '@/hooks/useFiancasAdmin';
import FiancaStatusTooltipAdmin from '@/components/FiancaStatusTooltipAdmin';

const FiancasAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  const {
    fiancas,
    isLoading,
    error,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    formatCurrency
  } = useFiancasAdmin(searchTerm, statusFilter);

  const handleViewFianca = (fiancaId: string) => {
    navigate(`/detalhe-fianca/${fiancaId}`);
  };

  if (isLoading) {
    return (
      <Layout title="Gestão de Fianças">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Gestão de Fianças">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar fianças: {error.message}</p>
        </div>
      </Layout>
    );
  }

  // Calculate stats
  const stats = {
    total: fiancas.length,
    aprovadas: fiancas.filter(f => f.status_fianca === 'aprovada').length,
    pendentes: fiancas.filter(f => f.status_fianca === 'em_analise').length,
    valorTotal: fiancas.reduce((sum, f) => sum + (f.valor_fianca || 0), 0)
  };

  return (
    <Layout title="Gestão de Fianças">
      <div className="space-y-4 px-2 sm:px-0">
        {/* Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Fianças</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{stats.total}</p>
                </div>
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-500">{stats.pendentes}</p>
                </div>
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
                  placeholder="Buscar inquilino ou imobiliária..."
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
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px] px-4 py-3">Inquilino</TableHead>
                    <TableHead className="w-[180px] px-4 py-3">Imobiliária</TableHead>
                    <TableHead className="w-[220px] px-4 py-3">Imóvel</TableHead>
                    <TableHead className="w-[120px] px-4 py-3">Valor Fiança</TableHead>
                    <TableHead className="w-[140px] px-4 py-3">Status</TableHead>
                    <TableHead className="w-[100px] px-4 py-3">Data</TableHead>
                    <TableHead className="w-[80px] px-4 py-3">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiancas.map((fianca) => (
                    <TableRow key={fianca.id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {fianca.inquilino_nome_completo}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-blue-600 break-words">
                            {fianca.imobiliaria_nome}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900 break-words">
                            {`${fianca.imovel_endereco}, ${fianca.imovel_numero}`}
                          </p>
                          <p className="text-xs text-gray-500 break-words">
                            {fianca.imovel_bairro}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-medium">
                          {formatCurrency(fianca.valor_fianca || 0)}
                        </span>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <FiancaStatusTooltipAdmin
                          status={fianca.status_fianca}
                          motivoReprovacao={fianca.motivo_reprovacao}
                          dataAnalise={fianca.data_analise}
                          analisadoPor={fianca.analisado_por}
                          getStatusColor={getStatusColor}
                          getStatusLabel={getStatusLabel}
                        />
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-500">
                          {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewFianca(fianca.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {fiancas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Nenhuma fiança encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? "Tente ajustar sua busca" : "Nenhuma fiança foi criada ainda"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FiancasAdmin;

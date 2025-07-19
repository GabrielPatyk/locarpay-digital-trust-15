
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Filter, FileText } from 'lucide-react';
import { useFiancasInquilino } from '@/hooks/useFiancasInquilino';
import { useIsMobile } from '@/hooks/use-mobile';

const Fiancas = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  const {
    fiancas,
    isLoading,
    error,
    getStatusOptions,
    getStatusColor,
    getStatusText,
    stats
  } = useFiancasInquilino(searchTerm, statusFilter);

  const handleViewFianca = (fiancaId: string) => {
    navigate(`/detalhe-fianca/${fiancaId}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          <p className="text-red-600">Erro ao carregar fianças</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Minhas Fianças">
      <div className="space-y-4 p-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600">Total Fianças</p>
                <p className="text-xl font-bold text-primary">{stats.ativas + stats.pendentes + stats.vencidas}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600">Ativas</p>
                <p className="text-xl font-bold text-success">{stats.ativas}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600">Pendentes</p>
                <p className="text-xl font-bold text-warning">{stats.pendentes}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600">Valor Total</p>
                <p className="text-sm font-bold text-primary">{formatCurrency(stats.valorTotal)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Minhas Fianças</CardTitle>
            <div className="space-y-2">
              <Input
                placeholder="Buscar por imobiliária ou imóvel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
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
          </CardHeader>

          <CardContent className="p-0">
            <div className="space-y-3 p-4">
              {fiancas.map((fianca) => (
                <Card key={fianca.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Linha 1: Imobiliária e Status */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {fianca.imobiliaria}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(fianca.status)} text-white text-xs ml-2`}>
                          {getStatusText(fianca.status)}
                        </Badge>
                      </div>
                      
                      {/* Linha 2: Endereço do Imóvel */}
                      <div>
                        <p className="text-sm text-gray-900 break-words">
                          {fianca.endereco}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fianca.imovel}
                        </p>
                      </div>
                      
                      {/* Linha 3: Valor, Data e Ação */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {formatCurrency(fianca.valor)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(fianca.dataEmissao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewFianca(fianca.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {fiancas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Nenhuma fiança encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? "Tente ajustar sua busca" : "Você ainda não possui fianças cadastradas"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Fiancas;

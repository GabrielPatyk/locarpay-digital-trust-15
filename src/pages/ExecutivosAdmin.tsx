
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, User, TrendingUp, Building, Loader2 } from 'lucide-react';
import { useExecutivosAdmin } from '@/hooks/useExecutivosAdmin';

const ExecutivosAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const {
    executivos,
    isLoading,
    error,
    getStatusOptions,
    getStats,
    formatCurrency
  } = useExecutivosAdmin(searchTerm, statusFilter);

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

  const stats = getStats();

  return (
    <Layout title="Gestão de Executivos">
      <div className="space-y-6">
        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Executivos</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalExecutivos}</p>
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
                <TrendingUp className="h-8 w-8 text-green-500" />
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
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Todos os Executivos</CardTitle>
                <CardDescription>Gerencie a equipe de executivos de conta</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar por nome ou email..."
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
          <CardContent>
            <div className="space-y-4">
              {executivos.map((executivo) => (
                <div key={executivo.id} className="p-4 rounded-lg border">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{executivo.nome}</h4>
                      <p className="text-sm text-gray-600 truncate">{executivo.email}</p>
                      {executivo.telefone && (
                        <p className="text-sm text-gray-600">{executivo.telefone}</p>
                      )}
                    </div>
                    <Badge className={`${executivo.ativo ? 'bg-green-500' : 'bg-red-500'} text-white shrink-0`}>
                      {executivo.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Imobiliárias Atendidas</p>
                      <p className="font-medium">{executivo.imobiliarias_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total de Fianças</p>
                      <p className="font-medium">{executivo.fiancas_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Total Gerado</p>
                      <p className="font-medium text-green-600">{formatCurrency(executivo.valor_total_fiancas)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Cadastrado em: {new Date(executivo.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {executivos.length === 0 && (
                <div className="text-center py-8">
                  <User className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum executivo encontrado</h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Tente ajustar sua busca" : "Nenhum executivo foi cadastrado ainda"}
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

export default ExecutivosAdmin;

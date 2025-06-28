
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, User, Users, Building, TrendingUp, Loader2 } from 'lucide-react';
import { useExecutivosAdmin } from '@/hooks/useExecutivosAdmin';

const ExecutivosAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const {
    executivos,
    isLoading,
    error,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    stats
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
      </div>
    </Layout>
  );
};

export default ExecutivosAdmin;

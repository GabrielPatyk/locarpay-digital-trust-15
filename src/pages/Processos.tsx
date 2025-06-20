
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Scale, 
  Search, 
  Plus, 
  Eye, 
  Calendar,
  User,
  FileText,
  Filter
} from 'lucide-react';

interface Processo {
  id: string;
  titulo: string;
  cliente: string;
  tipo: string;
  dataAbertura: string;
  status: 'aberto' | 'em_andamento' | 'pendente' | 'finalizado';
  prioridade: 'baixa' | 'media' | 'alta';
}

const Processos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  const processos: Processo[] = [
    {
      id: 'PROC-001',
      titulo: 'Cobrança Judicial - Aluguel em Atraso',
      cliente: 'João Silva Santos',
      tipo: 'Cobrança',
      dataAbertura: '2024-01-15',
      status: 'em_andamento',
      prioridade: 'alta'
    },
    {
      id: 'PROC-002',
      titulo: 'Rescisão Contratual - Quebra de Fiança',
      cliente: 'Maria Oliveira Costa',
      tipo: 'Rescisão',
      dataAbertura: '2024-02-01',
      status: 'aberto',
      prioridade: 'media'
    }
  ];

  const filteredProcessos = processos.filter(processo => {
    const matchesSearch = processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || processo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-blue-100 text-blue-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendente':
        return 'bg-orange-100 text-orange-800';
      case 'finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Processos">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Processos</h1>
            <p className="text-gray-600">Gerencie todos os processos jurídicos</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar processos por título, cliente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredProcessos.map((processo) => (
            <Card key={processo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Scale className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{processo.id}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(processo.status)}>
                          {processo.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPrioridadeColor(processo.prioridade)}>
                          {processo.prioridade}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{processo.titulo}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{processo.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium">{processo.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Abertura</p>
                      <p className="font-medium">
                        {new Date(processo.dataAbertura).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProcessos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Scale className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum processo encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'todos'
                  ? 'Tente ajustar sua busca ou filtros.'
                  : 'Adicione seu primeiro processo para começar.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Processos;

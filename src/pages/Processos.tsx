
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Scale, 
  Search,
  Eye,
  Calendar,
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';

interface Processo {
  id: string;
  numero: string;
  tipo: 'inadimplencia' | 'despejo' | 'cobranca' | 'danos' | 'rescisao';
  inquilino: string;
  imovel: string;
  valorCausa: number;
  dataAbertura: string;
  status: 'aberto' | 'em_andamento' | 'suspenso' | 'finalizado';
  advogado: string;
  prazoLimite?: string;
  observacoes?: string;
}

const Processos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  
  // Mock data
  const processos: Processo[] = [
    {
      id: '1',
      numero: '1001234-12.2024.8.26.0100',
      tipo: 'inadimplencia',
      inquilino: 'João Silva Santos',
      imovel: 'Apartamento 2 quartos - Jardins',
      valorCausa: 7500,
      dataAbertura: '2024-01-10',
      status: 'em_andamento',
      advogado: 'Dr. Roberto Almeida',
      prazoLimite: '2024-03-15',
      observacoes: 'Processo de cobrança de 3 meses de aluguel em atraso'
    },
    {
      id: '2',
      numero: '1001235-45.2024.8.26.0100',
      tipo: 'despejo',
      inquilino: 'Maria Oliveira',
      imovel: 'Casa 3 quartos - Vila Madalena',
      valorCausa: 12000,
      dataAbertura: '2024-01-15',
      status: 'aberto',
      advogado: 'Dra. Ana Costa',
      prazoLimite: '2024-04-20',
      observacoes: 'Ação de despejo por falta de pagamento'
    },
    {
      id: '3',
      numero: '1001236-78.2024.8.26.0100',
      tipo: 'danos',
      inquilino: 'Carlos Ferreira',
      imovel: 'Apartamento 1 quarto - Pinheiros',
      valorCausa: 3000,
      dataAbertura: '2023-12-20',
      status: 'finalizado',
      advogado: 'Dr. Roberto Almeida',
      observacoes: 'Processo finalizado com acordo entre as partes'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-blue-500';
      case 'em_andamento':
        return 'bg-warning';
      case 'suspenso':
        return 'bg-gray-500';
      case 'finalizado':
        return 'bg-success';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'aberto': 'Aberto',
      'em_andamento': 'Em Andamento',
      'suspenso': 'Suspenso',
      'finalizado': 'Finalizado'
    };
    return statusMap[status] || status;
  };

  const getTipoText = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'inadimplencia': 'Inadimplência',
      'despejo': 'Despejo',
      'cobranca': 'Cobrança',
      'danos': 'Danos',
      'rescisao': 'Rescisão'
    };
    return tipoMap[tipo] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'inadimplencia':
        return 'bg-red-100 text-red-800';
      case 'despejo':
        return 'bg-orange-100 text-orange-800';
      case 'cobranca':
        return 'bg-yellow-100 text-yellow-800';
      case 'danos':
        return 'bg-purple-100 text-purple-800';
      case 'rescisao':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProcessos = processos.filter(p => {
    const matchesSearch = p.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.imovel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: processos.length,
    abertos: processos.filter(p => p.status === 'aberto').length,
    emAndamento: processos.filter(p => p.status === 'em_andamento').length,
    finalizados: processos.filter(p => p.status === 'finalizado').length
  };

  return (
    <Layout title="Processos Jurídicos">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="mr-2 h-5 w-5" />
              Processos Jurídicos
            </CardTitle>
            <CardDescription>
              Acompanhamento de todos os processos judiciais e extrajudiciais
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <Scale className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Abertos</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.abertos}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-warning">{stats.emAndamento}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Finalizados</p>
                  <p className="text-2xl font-bold text-success">{stats.finalizados}</p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Lista de Processos</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número do processo, inquilino ou imóvel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Processos List */}
        <div className="space-y-4">
          {filteredProcessos.map((processo) => (
            <Card key={processo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {processo.numero}
                      </h3>
                      <Badge className={getTipoColor(processo.tipo)}>
                        {getTipoText(processo.tipo)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 font-medium">{processo.inquilino}</p>
                    <p className="text-gray-500 text-sm">{processo.imovel}</p>
                  </div>
                  <Badge className={`${getStatusColor(processo.status)} text-white`}>
                    {getStatusText(processo.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Valor da Causa</p>
                    <p className="text-sm font-medium text-green-600">
                      R$ {processo.valorCausa.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Abertura</p>
                    <p className="text-sm font-medium flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(processo.dataAbertura).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Advogado</p>
                    <p className="text-sm font-medium">{processo.advogado}</p>
                  </div>
                  {processo.prazoLimite && (
                    <div>
                      <p className="text-sm text-gray-500">Prazo Limite</p>
                      <p className="text-sm font-medium text-red-600 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(processo.prazoLimite).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {processo.observacoes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Observações</p>
                    <p className="text-sm text-gray-700">{processo.observacoes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProcessos.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Scale className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum processo encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros de busca ou verifique os critérios.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Processos;

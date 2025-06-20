
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search,
  Eye,
  Download,
  Calendar,
  Upload,
  Folder
} from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: 'contrato' | 'processo' | 'certidao' | 'parecer' | 'procuracao' | 'outros';
  processo?: string;
  dataUpload: string;
  tamanho: string;
  status: 'ativo' | 'arquivado' | 'vencido' | 'pendente';
  responsavel: string;
  observacoes?: string;
}

const Documentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  
  // Mock data
  const documentos: Documento[] = [
    {
      id: '1',
      nome: 'Contrato de Locação - João Silva',
      tipo: 'contrato',
      processo: '1001234-12.2024.8.26.0100',
      dataUpload: '2024-01-10',
      tamanho: '2.3 MB',
      status: 'ativo',
      responsavel: 'Dr. Roberto Almeida',
      observacoes: 'Contrato principal do processo de inadimplência'
    },
    {
      id: '2',
      nome: 'Petição Inicial - Ação de Despejo',
      tipo: 'processo',
      processo: '1001235-45.2024.8.26.0100',
      dataUpload: '2024-01-15',
      tamanho: '1.8 MB',
      status: 'pendente',
      responsavel: 'Dra. Ana Costa',
      observacoes: 'Aguardando protocolo no tribunal'
    },
    {
      id: '3',
      nome: 'Certidão de Registro de Imóveis',
      tipo: 'certidao',
      dataUpload: '2023-12-20',
      tamanho: '850 KB',
      status: 'vencido',
      responsavel: 'Dr. Roberto Almeida',
      observacoes: 'Certidão com validade vencida - necessária atualização'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-success';
      case 'pendente':
        return 'bg-warning';
      case 'arquivado':
        return 'bg-gray-500';
      case 'vencido':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ativo': 'Ativo',
      'pendente': 'Pendente',
      'arquivado': 'Arquivado',
      'vencido': 'Vencido'
    };
    return statusMap[status] || status;
  };

  const getTipoText = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      'contrato': 'Contrato',
      'processo': 'Processo',
      'certidao': 'Certidão',
      'parecer': 'Parecer',
      'procuracao': 'Procuração',
      'outros': 'Outros'
    };
    return tipoMap[tipo] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'contrato':
        return 'bg-blue-100 text-blue-800';
      case 'processo':
        return 'bg-red-100 text-red-800';
      case 'certidao':
        return 'bg-green-100 text-green-800';
      case 'parecer':
        return 'bg-purple-100 text-purple-800';
      case 'procuracao':
        return 'bg-yellow-100 text-yellow-800';
      case 'outros':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.processo && doc.processo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filtroStatus === 'todos' || doc.status === filtroStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: documentos.length,
    ativos: documentos.filter(d => d.status === 'ativo').length,
    pendentes: documentos.filter(d => d.status === 'pendente').length,
    vencidos: documentos.filter(d => d.status === 'vencido').length
  };

  return (
    <Layout title="Documentos Jurídicos">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documentos Jurídicos
            </CardTitle>
            <CardDescription>
              Gestão de todos os documentos e arquivos jurídicos
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
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-success">{stats.ativos}</p>
                </div>
                <Folder className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-warning">{stats.pendentes}</p>
                </div>
                <Upload className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vencidos</p>
                  <p className="text-2xl font-bold text-red-500">{stats.vencidos}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Lista de Documentos</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar documentos por nome, processo ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload Documento
          </Button>
        </div>

        {/* Documentos List */}
        <div className="space-y-4">
          {filteredDocumentos.map((documento) => (
            <Card key={documento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {documento.nome}
                      </h3>
                      <Badge className={getTipoColor(documento.tipo)}>
                        {getTipoText(documento.tipo)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 font-medium">{documento.responsavel}</p>
                    {documento.processo && (
                      <p className="text-gray-500 text-sm">Processo: {documento.processo}</p>
                    )}
                  </div>
                  <Badge className={`${getStatusColor(documento.status)} text-white`}>
                    {getStatusText(documento.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Data de Upload</p>
                    <p className="text-sm font-medium flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(documento.dataUpload).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tamanho</p>
                    <p className="text-sm font-medium">{documento.tamanho}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Responsável</p>
                    <p className="text-sm font-medium">{documento.responsavel}</p>
                  </div>
                </div>

                {documento.observacoes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Observações</p>
                    <p className="text-sm text-gray-700">{documento.observacoes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredDocumentos.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum documento encontrado
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

export default Documentos;

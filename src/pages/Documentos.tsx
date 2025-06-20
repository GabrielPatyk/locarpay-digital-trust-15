
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search,
  Download,
  Upload,
  Eye,
  Calendar,
  User,
  Folder
} from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: 'contrato' | 'processo' | 'certidao' | 'comprovante' | 'peticao' | 'sentenca';
  categoria: 'juridico' | 'financeiro' | 'administrativo';
  inquilino?: string;
  processo?: string;
  dataUpload: string;
  tamanho: string;
  status: 'ativo' | 'arquivado' | 'vencido';
  responsavel: string;
}

const Documentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('todos');
  
  // Mock data
  const documentos: Documento[] = [
    {
      id: '1',
      nome: 'Contrato de Locação - João Silva.pdf',
      tipo: 'contrato',
      categoria: 'juridico',
      inquilino: 'João Silva Santos',
      dataUpload: '2024-01-15',
      tamanho: '2.3 MB',
      status: 'ativo',
      responsavel: 'Dr. Roberto Almeida'
    },
    {
      id: '2',
      nome: 'Petição Inicial - Processo 1001234.pdf',
      tipo: 'peticao',
      categoria: 'juridico',
      processo: '1001234-12.2024.8.26.0100',
      inquilino: 'Maria Oliveira',
      dataUpload: '2024-01-20',
      tamanho: '1.8 MB',
      status: 'ativo',
      responsavel: 'Dra. Ana Costa'
    },
    {
      id: '3',
      nome: 'Certidão de Nascimento - Carlos Ferreira.pdf',
      tipo: 'certidao',
      categoria: 'administrativo',
      inquilino: 'Carlos Ferreira',
      dataUpload: '2023-12-10',
      tamanho: '0.9 MB',
      status: 'arquivado',
      responsavel: 'Dr. Roberto Almeida'
    },
    {
      id: '4',
      nome: 'Comprovante de Pagamento - Janeiro 2024.pdf',
      tipo: 'comprovante',
      categoria: 'financeiro',
      inquilino: 'Ana Santos',
      dataUpload: '2024-02-01',
      tamanho: '0.5 MB',
      status: 'ativo',
      responsavel: 'Dra. Ana Costa'
    },
    {
      id: '5',
      nome: 'Sentença - Processo 1001236.pdf',
      tipo: 'sentenca',
      categoria: 'juridico',
      processo: '1001236-78.2024.8.26.0100',
      inquilino: 'Carlos Ferreira',
      dataUpload: '2024-01-25',
      tamanho: '3.1 MB',
      status: 'ativo',
      responsavel: 'Dr. Roberto Almeida'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-success';
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
      'comprovante': 'Comprovante',
      'peticao': 'Petição',
      'sentenca': 'Sentença'
    };
    return tipoMap[tipo] || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'contrato':
        return <FileText className="h-4 w-4" />;
      case 'processo':
        return <Folder className="h-4 w-4" />;
      case 'certidao':
        return <FileText className="h-4 w-4" />;
      case 'comprovante':
        return <FileText className="h-4 w-4" />;
      case 'peticao':
        return <FileText className="h-4 w-4" />;
      case 'sentenca':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'juridico':
        return 'bg-blue-100 text-blue-800';
      case 'financeiro':
        return 'bg-green-100 text-green-800';
      case 'administrativo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocumentos = documentos.filter(d => {
    const matchesSearch = d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.inquilino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.processo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'todos') return matchesSearch;
    return matchesSearch && d.categoria === selectedTab;
  });

  const stats = {
    total: documentos.length,
    juridico: documentos.filter(d => d.categoria === 'juridico').length,
    financeiro: documentos.filter(d => d.categoria === 'financeiro').length,
    administrativo: documentos.filter(d => d.categoria === 'administrativo').length
  };

  return (
    <Layout title="Documentos">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Documentos Jurídicos
                </CardTitle>
                <CardDescription>
                  Gestão centralizada de todos os documentos jurídicos
                </CardDescription>
              </div>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Documento
              </Button>
            </div>
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
                  <p className="text-sm font-medium text-gray-600">Jurídicos</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.juridico}</p>
                </div>
                <Folder className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Financeiros</p>
                  <p className="text-2xl font-bold text-green-500">{stats.financeiro}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrativos</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.administrativo}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar documentos por nome, inquilino, processo ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="juridico">Jurídicos</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiros</TabsTrigger>
            <TabsTrigger value="administrativo">Administrativos</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4 mt-6">
            {filteredDocumentos.map((documento) => (
              <Card key={documento.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getTipoIcon(documento.tipo)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {documento.nome}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">
                            {getTipoText(documento.tipo)}
                          </Badge>
                          <Badge className={getCategoriaColor(documento.categoria)}>
                            {documento.categoria.charAt(0).toUpperCase() + documento.categoria.slice(1)}
                          </Badge>
                        </div>
                        {documento.inquilino && (
                          <p className="text-gray-600 text-sm flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {documento.inquilino}
                          </p>
                        )}
                        {documento.processo && (
                          <p className="text-gray-500 text-sm">
                            Processo: {documento.processo}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(documento.status)} text-white`}>
                      {getStatusText(documento.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Data Upload</p>
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
                    Tente ajustar os filtros de busca ou faça upload de novos documentos.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Documentos;

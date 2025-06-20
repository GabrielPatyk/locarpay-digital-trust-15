
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Download,
  Calendar,
  User,
  Filter
} from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  cliente: string;
  dataCriacao: string;
  status: 'rascunho' | 'revisao' | 'aprovado' | 'assinado';
  tamanho: string;
}

const Documentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  const documentos: Documento[] = [
    {
      id: 'DOC-001',
      nome: 'Contrato de Fiança Locatícia',
      tipo: 'Contrato',
      cliente: 'João Silva Santos',
      dataCriacao: '2024-01-15',
      status: 'assinado',
      tamanho: '2.5 MB'
    },
    {
      id: 'DOC-002',
      nome: 'Termo de Rescisão',
      tipo: 'Rescisão',
      cliente: 'Maria Oliveira Costa',
      dataCriacao: '2024-02-01',
      status: 'revisao',
      tamanho: '1.8 MB'
    }
  ];

  const filteredDocumentos = documentos.filter(documento => {
    const matchesSearch = documento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || documento.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'revisao':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovado':
        return 'bg-blue-100 text-blue-800';
      case 'assinado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Documentos">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
            <p className="text-gray-600">Gerencie todos os documentos jurídicos</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Documento
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar documentos por nome, cliente ou tipo..."
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
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="revisao">Revisão</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="assinado">Assinado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredDocumentos.map((documento) => (
            <Card key={documento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{documento.nome}</h3>
                      <Badge className={getStatusColor(documento.status)}>
                        {documento.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tamanho</p>
                    <p className="font-medium">{documento.tamanho}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{documento.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium">{documento.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Criação</p>
                      <p className="font-medium">
                        {new Date(documento.dataCriacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
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
        </div>

        {filteredDocumentos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'todos'
                  ? 'Tente ajustar sua busca ou filtros.'
                  : 'Adicione seu primeiro documento para começar.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Documentos;

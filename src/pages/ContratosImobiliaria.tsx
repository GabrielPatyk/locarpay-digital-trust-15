
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  User,
  Building
} from 'lucide-react';

interface Contrato {
  id: string;
  inquilino: string;
  imovel: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  status: 'ativo' | 'vencido' | 'pendente' | 'cancelado';
  tipo: 'residencial' | 'comercial';
}

const ContratosImobiliaria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const contratos: Contrato[] = [
    {
      id: 'CTR-001',
      inquilino: 'João Silva Santos',
      imovel: 'Rua das Flores, 123 - Apt 45',
      dataInicio: '2024-01-15',
      dataFim: '2025-01-15',
      valor: 2500,
      status: 'ativo',
      tipo: 'residencial'
    },
    {
      id: 'CTR-002',
      inquilino: 'Maria Oliveira Costa',
      imovel: 'Av. Paulista, 456 - Sala 12',
      dataInicio: '2024-02-01',
      dataFim: '2025-02-01',
      valor: 3200,
      status: 'ativo',
      tipo: 'comercial'
    },
    {
      id: 'CTR-003',
      inquilino: 'Pedro Ferreira Lima',
      imovel: 'Rua Augusta, 789 - Casa',
      dataInicio: '2023-12-01',
      dataFim: '2024-12-01',
      valor: 1800,
      status: 'vencido',
      tipo: 'residencial'
    }
  ];

  const filteredContratos = contratos.filter(contrato =>
    contrato.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'vencido':
        return 'Vencido';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'residencial':
        return 'Residencial';
      case 'comercial':
        return 'Comercial';
      default:
        return tipo;
    }
  };

  return (
    <Layout title="Contratos">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
            <p className="text-gray-600">Gerencie todos os contratos da sua imobiliária</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar contratos por inquilino, imóvel ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contratos List */}
        <div className="grid gap-4">
          {filteredContratos.map((contrato) => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{contrato.id}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(contrato.status)}>
                          {getStatusLabel(contrato.status)}
                        </Badge>
                        <Badge variant="outline">
                          {getTipoLabel(contrato.tipo)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor Mensal</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {contrato.valor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Inquilino</p>
                      <p className="font-medium">{contrato.inquilino}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Imóvel</p>
                      <p className="font-medium">{contrato.imovel}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Período</p>
                      <p className="font-medium">
                        {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="font-medium">R$ {(contrato.valor * 12).toLocaleString('pt-BR')}</p>
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

        {filteredContratos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou adicione um novo contrato.'
                  : 'Adicione seu primeiro contrato para começar.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ContratosImobiliaria;

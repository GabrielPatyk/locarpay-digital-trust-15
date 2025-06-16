
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Building, 
  Calendar, 
  DollarSign,
  Eye,
  Search
} from 'lucide-react';

interface Contrato {
  id: string;
  numero: string;
  imovel: string;
  endereco: string;
  imobiliaria: string;
  valor: number;
  dataInicio: string;
  dataFim: string;
  status: 'ativo' | 'vencido' | 'cancelado';
  proprietario: string;
}

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  
  // Mock data
  const contratos: Contrato[] = [
    {
      id: '1',
      numero: 'CT-2024-001',
      imovel: 'Apartamento 2 quartos',
      endereco: 'Rua das Flores, 123 - Centro',
      imobiliaria: 'Imobiliária Prime',
      valor: 2500,
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      status: 'ativo',
      proprietario: 'João Silva'
    },
    {
      id: '2',
      numero: 'CT-2023-045',
      imovel: 'Casa 3 quartos',
      endereco: 'Av. Principal, 456 - Jardim América',
      imobiliaria: 'Imobiliária Top',
      valor: 3200,
      dataInicio: '2023-06-01',
      dataFim: '2024-05-31',
      status: 'vencido',
      proprietario: 'Maria Santos'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success';
      case 'vencido': return 'bg-red-500';
      case 'cancelado': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'vencido': return 'Vencido';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const filteredContratos = contratos.filter(contrato =>
    contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.imobiliaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Meus Contratos">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Meus Contratos</h2>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                  <p className="text-2xl font-bold text-success">
                    {contratos.filter(c => c.status === 'ativo').length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Mensal</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {contratos.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valor, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {new Set(contratos.map(c => c.imobiliaria)).size}
                  </p>
                </div>
                <Building className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Contratos</CardTitle>
            <CardDescription>
              Todos os seus contratos de locação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContratos.map((contrato) => (
                <div
                  key={contrato.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{contrato.numero}</h4>
                      <p className="text-sm text-gray-600">{contrato.imovel}</p>
                      <p className="text-sm text-gray-500">{contrato.endereco}</p>
                    </div>
                    <Badge className={`${getStatusColor(contrato.status)} text-white`}>
                      {getStatusText(contrato.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Imobiliária</p>
                      <p className="text-sm font-medium">{contrato.imobiliaria}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="text-sm font-medium">R$ {contrato.valor.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Início</p>
                      <p className="text-sm font-medium">
                        {new Date(contrato.dataInicio).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fim</p>
                      <p className="text-sm font-medium">
                        {new Date(contrato.dataFim).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContrato(contrato)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contract Details Modal */}
        {selectedContrato && (
          <Card className="fixed inset-0 z-50 m-4 max-w-2xl mx-auto mt-20 max-h-fit bg-white">
            <CardHeader>
              <CardTitle>Detalhes do Contrato</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedContrato(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número do Contrato</Label>
                    <p className="font-medium">{selectedContrato.numero}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={`${getStatusColor(selectedContrato.status)} text-white mt-1`}>
                      {getStatusText(selectedContrato.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label>Imóvel</Label>
                    <p className="font-medium">{selectedContrato.imovel}</p>
                  </div>
                  <div>
                    <Label>Proprietário</Label>
                    <p className="font-medium">{selectedContrato.proprietario}</p>
                  </div>
                  <div>
                    <Label>Imobiliária</Label>
                    <p className="font-medium">{selectedContrato.imobiliaria}</p>
                  </div>
                  <div>
                    <Label>Valor Mensal</Label>
                    <p className="font-medium">R$ {selectedContrato.valor.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <Label>Endereço Completo</Label>
                  <p className="font-medium">{selectedContrato.endereco}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Início</Label>
                    <p className="font-medium">{new Date(selectedContrato.dataInicio).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Data de Fim</Label>
                    <p className="font-medium">{new Date(selectedContrato.dataFim).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Contratos;


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
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header - Otimizado para mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Meus Contratos</h2>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        {/* Stats Cards - Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Contratos Ativos</p>
                  <p className="text-xl sm:text-2xl font-bold text-success">
                    {contratos.filter(c => c.status === 'ativo').length}
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total Mensal</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    R$ {contratos.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valor, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {new Set(contratos.map(c => c.imobiliaria)).size}
                  </p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List - Otimizado para mobile */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Lista de Contratos</CardTitle>
            <CardDescription className="text-sm">
              Todos os seus contratos de locação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {filteredContratos.map((contrato) => (
                <div
                  key={contrato.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{contrato.numero}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{contrato.imovel}</p>
                      <p className="text-xs sm:text-sm text-gray-500 break-words">{contrato.endereco}</p>
                    </div>
                    <Badge className={`${getStatusColor(contrato.status)} text-white text-xs mt-1 sm:mt-0`}>
                      {getStatusText(contrato.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Imobiliária</p>
                      <p className="text-xs sm:text-sm font-medium break-words">{contrato.imobiliaria}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Valor</p>
                      <p className="text-xs sm:text-sm font-medium">R$ {contrato.valor.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Início</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(contrato.dataInicio).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Fim</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(contrato.dataFim).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContrato(contrato)}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contract Details Modal - Responsivo */}
        {selectedContrato && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Detalhes do Contrato</CardTitle>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm">Número do Contrato</Label>
                      <p className="font-medium text-sm sm:text-base">{selectedContrato.numero}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Status</Label>
                      <Badge className={`${getStatusColor(selectedContrato.status)} text-white mt-1 text-xs`}>
                        {getStatusText(selectedContrato.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Imóvel</Label>
                      <p className="font-medium text-sm sm:text-base">{selectedContrato.imovel}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Proprietário</Label>
                      <p className="font-medium text-sm sm:text-base">{selectedContrato.proprietario}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Imobiliária</Label>
                      <p className="font-medium text-sm sm:text-base break-words">{selectedContrato.imobiliaria}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Valor Mensal</Label>
                      <p className="font-medium text-sm sm:text-base">R$ {selectedContrato.valor.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Endereço Completo</Label>
                    <p className="font-medium text-sm sm:text-base break-words">{selectedContrato.endereco}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm">Data de Início</Label>
                      <p className="font-medium text-sm sm:text-base">{new Date(selectedContrato.dataInicio).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Data de Fim</Label>
                      <p className="font-medium text-sm sm:text-base">{new Date(selectedContrato.dataFim).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Contratos;

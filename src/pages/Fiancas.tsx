
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  Clock,
  XCircle,
  Eye,
  Search,
  Download,
  DollarSign
} from 'lucide-react';

interface Fianca {
  id: string;
  numero: string;
  imovel: string;
  endereco: string;
  valor: number;
  taxa: number;
  dataEmissao: string;
  status: 'ativa' | 'vencida' | 'cancelada' | 'pendente';
  contrato: string;
  imobiliaria: string;
}

const Fiancas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFianca, setSelectedFianca] = useState<Fianca | null>(null);
  
  // Mock data
  const fiancas: Fianca[] = [
    {
      id: '1',
      numero: 'FI-2024-001',
      imovel: 'Apartamento 2 quartos',
      endereco: 'Rua das Flores, 123 - Centro',
      valor: 250,
      taxa: 10,
      dataEmissao: '2024-01-15',
      status: 'ativa',
      contrato: 'CT-2024-001',
      imobiliaria: 'Imobiliária Prime'
    },
    {
      id: '2',
      numero: 'FI-2023-045',
      imovel: 'Casa 3 quartos',
      endereco: 'Av. Principal, 456 - Jardim América',
      valor: 320,
      taxa: 10,
      dataEmissao: '2023-06-01',
      status: 'vencida',
      contrato: 'CT-2023-045',
      imobiliaria: 'Imobiliária Top'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'pendente': return 'bg-warning';
      case 'vencida': return 'bg-red-500';
      case 'cancelada': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pendente': return 'Pendente';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const filteredFiancas = fiancas.filter(fianca =>
    fianca.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.contrato.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCertificate = (fianca: Fianca) => {
    // Simular download do certificado
    console.log(`Download do certificado da fiança ${fianca.numero}`);
  };

  return (
    <Layout title="Minhas Fianças">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header - Otimizado para mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Minhas Fianças</h2>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Buscar fianças..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        {/* Stats Cards - Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Fianças Ativas</p>
                  <p className="text-xl sm:text-2xl font-bold text-success">
                    {fiancas.filter(f => f.status === 'ativa').length}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-xl sm:text-2xl font-bold text-warning">
                    {fiancas.filter(f => f.status === 'pendente').length}
                  </p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    R$ {fiancas.filter(f => f.status === 'ativa').reduce((acc, f) => acc + f.valor, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Vencidas</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-500">
                    {fiancas.filter(f => f.status === 'vencida').length}
                  </p>
                </div>
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warranties List - Otimizado para mobile */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Lista de Fianças</CardTitle>
            <CardDescription className="text-sm">
              Todas as suas fianças locatícias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {filteredFiancas.map((fianca) => (
                <div
                  key={fianca.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{fianca.numero}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{fianca.imovel}</p>
                      <p className="text-xs sm:text-sm text-gray-500 break-words">{fianca.endereco}</p>
                    </div>
                    <Badge className={`${getStatusColor(fianca.status)} text-white text-xs mt-1 sm:mt-0`}>
                      {getStatusText(fianca.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Contrato</p>
                      <p className="text-xs sm:text-sm font-medium">{fianca.contrato}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Valor</p>
                      <p className="text-xs sm:text-sm font-medium">R$ {fianca.valor.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Taxa</p>
                      <p className="text-xs sm:text-sm font-medium">{fianca.taxa}%</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <p className="text-xs text-gray-500">Emissão</p>
                      <p className="text-xs sm:text-sm font-medium">
                        {new Date(fianca.dataEmissao).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFianca(fianca)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    
                    {fianca.status === 'ativa' && (
                      <Button
                        size="sm"
                        onClick={() => downloadCertificate(fianca)}
                        className="w-full sm:w-auto bg-success hover:bg-success/90"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Certificado
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warranty Details Modal - Responsivo */}
        {selectedFianca && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Detalhes da Fiança</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedFianca(null)}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm">Número da Fiança</Label>
                      <p className="font-medium text-sm sm:text-base">{selectedFianca.numero}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Status</Label>
                      <Badge className={`${getStatusColor(selectedFianca.status)} text-white mt-1 text-xs`}>
                        {getStatusText(selectedFianca.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Contrato Vinculado</Label>
                      <p className="font-medium text-sm sm:text-base">{selectedFianca.contrato}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Imobiliária</Label>
                      <p className="font-medium text-sm sm:text-base break-words">{selectedFianca.imobiliaria}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Valor da Fiança</Label>
                      <p className="font-medium text-sm sm:text-base">R$ {selectedFianca.valor.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Taxa Aplicada</Label>
                      <p className="font-medium text-sm sm:text-base">{selectedFianca.taxa}%</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Imóvel</Label>
                    <p className="font-medium text-sm sm:text-base">{selectedFianca.imovel}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Endereço</Label>
                    <p className="font-medium text-sm sm:text-base break-words">{selectedFianca.endereco}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Data de Emissão</Label>
                    <p className="font-medium text-sm sm:text-base">{new Date(selectedFianca.dataEmissao).toLocaleDateString()}</p>
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

export default Fiancas;

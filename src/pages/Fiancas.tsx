
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  Calendar,
  DollarSign,
  Eye,
  Search
} from 'lucide-react';

interface Fianca {
  id: string;
  numeroContrato: string;
  numeroFianca: string;
  imovel: string;
  valorCobertura: number;
  valorMensal: number;
  dataInicio: string;
  dataVencimento: string;
  status: 'ativa' | 'vencida' | 'cancelada';
  proximoPagamento: string;
  imobiliaria: string;
}

const Fiancas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFianca, setSelectedFianca] = useState<Fianca | null>(null);
  
  // Mock data
  const fiancas: Fianca[] = [
    {
      id: '1',
      numeroContrato: 'CT-2024-001',
      numeroFianca: 'FI-2024-001',
      imovel: 'Apartamento 2 quartos - Centro',
      valorCobertura: 25000,
      valorMensal: 125,
      dataInicio: '2024-01-01',
      dataVencimento: '2024-12-31',
      status: 'ativa',
      proximoPagamento: '2024-02-01',
      imobiliaria: 'Imobiliária Prime'
    },
    {
      id: '2',
      numeroContrato: 'CT-2023-045',
      numeroFianca: 'FI-2023-045',
      imovel: 'Casa 3 quartos - Jardim América',
      valorCobertura: 38400,
      valorMensal: 160,
      dataInicio: '2023-06-01',
      dataVencimento: '2024-05-31',
      status: 'vencida',
      proximoPagamento: '2024-06-01',
      imobiliaria: 'Imobiliária Top'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'vencida': return 'bg-red-500';
      case 'cancelada': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const handlePagamento = (fianca: Fianca) => {
    // Simular redirecionamento para pagamento
    window.open('https://pagamento.exemplo.com/fianca/' + fianca.id, '_blank');
  };

  const filteredFiancas = fiancas.filter(fianca =>
    fianca.numeroFianca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.imovel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Minhas Fianças">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Minhas Fianças</h2>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar fianças..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Ativas</p>
                  <p className="text-2xl font-bold text-success">
                    {fiancas.filter(f => f.status === 'ativa').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Mensal</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {fiancas.filter(f => f.status === 'ativa').reduce((acc, f) => acc + f.valorMensal, 0).toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Cobertura Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {fiancas.filter(f => f.status === 'ativa').reduce((acc, f) => acc + f.valorCobertura, 0).toLocaleString()}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próx. Vencimento</p>
                  <p className="text-sm font-bold text-warning">
                    {fiancas.filter(f => f.status === 'ativa').length > 0 
                      ? new Date(Math.min(...fiancas.filter(f => f.status === 'ativa').map(f => new Date(f.proximoPagamento).getTime()))).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fianças List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Fianças</CardTitle>
            <CardDescription>
              Todas as suas fianças locatícias e seus detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFiancas.map((fianca) => (
                <div
                  key={fianca.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{fianca.numeroFianca}</h4>
                      <p className="text-sm text-gray-600">Contrato: {fianca.numeroContrato}</p>
                      <p className="text-sm text-gray-500">{fianca.imovel}</p>
                    </div>
                    <Badge className={`${getStatusColor(fianca.status)} text-white`}>
                      {getStatusText(fianca.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Valor Mensal</p>
                      <p className="text-sm font-medium">R$ {fianca.valorMensal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cobertura</p>
                      <p className="text-sm font-medium">R$ {fianca.valorCobertura.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Próximo Pagamento</p>
                      <p className="text-sm font-medium">
                        {new Date(fianca.proximoPagamento).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Imobiliária</p>
                      <p className="text-sm font-medium">{fianca.imobiliaria}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFianca(fianca)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    
                    {fianca.status === 'ativa' && (
                      <Button
                        size="sm"
                        onClick={() => handlePagamento(fianca)}
                        className="bg-success hover:bg-success/90"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar Agora
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fiança Details Modal */}
        {selectedFianca && (
          <Card className="fixed inset-0 z-50 m-4 max-w-2xl mx-auto mt-20 max-h-fit bg-white">
            <CardHeader>
              <CardTitle>Detalhes da Fiança</CardTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número da Fiança</Label>
                    <p className="font-medium">{selectedFianca.numeroFianca}</p>
                  </div>
                  <div>
                    <Label>Número do Contrato</Label>
                    <p className="font-medium">{selectedFianca.numeroContrato}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={`${getStatusColor(selectedFianca.status)} text-white mt-1`}>
                      {getStatusText(selectedFianca.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label>Imobiliária</Label>
                    <p className="font-medium">{selectedFianca.imobiliaria}</p>
                  </div>
                </div>
                <div>
                  <Label>Imóvel</Label>
                  <p className="font-medium">{selectedFianca.imovel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor Mensal da Fiança</Label>
                    <p className="font-medium">R$ {selectedFianca.valorMensal.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Valor da Cobertura</Label>
                    <p className="font-medium">R$ {selectedFianca.valorCobertura.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Data de Início</Label>
                    <p className="font-medium">{new Date(selectedFianca.dataInicio).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Data de Vencimento</Label>
                    <p className="font-medium">{new Date(selectedFianca.dataVencimento).toLocaleDateString()}</p>
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

export default Fiancas;

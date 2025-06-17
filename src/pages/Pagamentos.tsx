
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  DollarSign,
  Calendar,
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Pagamento {
  id: string;
  numeroFianca: string;
  numeroContrato: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'processando';
  metodoPagamento?: string;
  linkPagamento?: string;
  comprovante?: string;
}

const Pagamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  
  // Mock data
  const pagamentos: Pagamento[] = [
    {
      id: '1',
      numeroFianca: 'FI-2024-001',
      numeroContrato: 'CT-2024-001',
      valor: 125,
      dataVencimento: '2024-02-01',
      dataPagamento: '2024-01-30',
      status: 'pago',
      metodoPagamento: 'PIX',
      comprovante: 'COMP-001-2024'
    },
    {
      id: '2',
      numeroFianca: 'FI-2024-001',
      numeroContrato: 'CT-2024-001',
      valor: 125,
      dataVencimento: '2024-03-01',
      status: 'pendente',
      linkPagamento: 'https://pay.exemplo.com/fianca-001-mar'
    },
    {
      id: '3',
      numeroFianca: 'FI-2023-045',
      numeroContrato: 'CT-2023-045',
      valor: 160,
      dataVencimento: '2024-01-01',
      status: 'vencido',
      linkPagamento: 'https://pay.exemplo.com/fianca-045-jan'
    },
    {
      id: '4',
      numeroFianca: 'FI-2024-001',
      numeroContrato: 'CT-2024-001',
      valor: 125,
      dataVencimento: '2024-01-01',
      dataPagamento: '2024-01-02',
      status: 'pago',
      metodoPagamento: 'Cartão de Crédito',
      comprovante: 'COMP-002-2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-success';
      case 'pendente': return 'bg-warning';
      case 'vencido': return 'bg-red-500';
      case 'processando': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      case 'vencido': return 'Vencido';
      case 'processando': return 'Processando';
      default: return status;
    }
  };

  const handlePagamento = (pagamento: Pagamento) => {
    if (pagamento.linkPagamento) {
      window.open(pagamento.linkPagamento, '_blank');
    }
  };

  const downloadComprovante = (pagamento: Pagamento) => {
    // Simular download do comprovante
    const link = document.createElement('a');
    link.href = '#';
    link.download = `comprovante-${pagamento.comprovante}.pdf`;
    link.click();
  };

  const filteredPagamentos = pagamentos.filter(pagamento => {
    const matchesSearch = 
      pagamento.numeroFianca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || pagamento.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    todos: pagamentos.length,
    pago: pagamentos.filter(p => p.status === 'pago').length,
    pendente: pagamentos.filter(p => p.status === 'pendente').length,
    vencido: pagamentos.filter(p => p.status === 'vencido').length,
  };

  const totalPago = pagamentos.filter(p => p.status === 'pago').reduce((acc, p) => acc + p.valor, 0);
  const totalPendente = pagamentos.filter(p => p.status === 'pendente' || p.status === 'vencido').reduce((acc, p) => acc + p.valor, 0);

  return (
    <Layout title="Pagamentos">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header - Otimizado para mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Histórico de Pagamentos</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Input
                placeholder="Buscar pagamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards - Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Pago</p>
                  <p className="text-xl sm:text-2xl font-bold text-success">R$ {totalPago.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pendente</p>
                  <p className="text-xl sm:text-2xl font-bold text-warning">R$ {totalPendente.toLocaleString()}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pagamentos</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{statusCounts.pago}</p>
                </div>
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Em Atraso</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-500">{statusCounts.vencido}</p>
                </div>
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments List - Otimizado para mobile */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Lista de Pagamentos</CardTitle>
            <CardDescription className="text-sm">
              Histórico completo de pagamentos e links para quitação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {filteredPagamentos.map((pagamento) => (
                <div
                  key={pagamento.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{pagamento.numeroFianca}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Contrato: {pagamento.numeroContrato}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Vencimento: {new Date(pagamento.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <Badge className={`${getStatusColor(pagamento.status)} text-white text-xs`}>
                        {getStatusText(pagamento.status)}
                      </Badge>
                      <span className="text-lg font-bold text-gray-900">
                        R$ {pagamento.valor.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {pagamento.dataPagamento && (
                    <div className="mb-3 bg-gray-50 p-2 rounded">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Pago em: {new Date(pagamento.dataPagamento).toLocaleDateString()}
                      </p>
                      {pagamento.metodoPagamento && (
                        <p className="text-xs sm:text-sm text-gray-500">
                          Método: {pagamento.metodoPagamento}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPagamento(pagamento)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    
                    {pagamento.status === 'pendente' || pagamento.status === 'vencido' ? (
                      <Button
                        size="sm"
                        onClick={() => handlePagamento(pagamento)}
                        className="w-full sm:w-auto bg-success hover:bg-success/90"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar Agora
                      </Button>
                    ) : pagamento.comprovante && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadComprovante(pagamento)}
                        className="w-full sm:w-auto"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Comprovante
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Modal - Responsivo */}
        {selectedPagamento && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Detalhes do Pagamento</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedPagamento(null)}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Número da Fiança</p>
                      <p className="font-medium text-sm sm:text-base">{selectedPagamento.numeroFianca}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Número do Contrato</p>
                      <p className="font-medium text-sm sm:text-base">{selectedPagamento.numeroContrato}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Valor</p>
                      <p className="font-medium text-sm sm:text-base">R$ {selectedPagamento.valor.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Status</p>
                      <Badge className={`${getStatusColor(selectedPagamento.status)} text-white mt-1 text-xs`}>
                        {getStatusText(selectedPagamento.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Data de Vencimento</p>
                      <p className="font-medium text-sm sm:text-base">{new Date(selectedPagamento.dataVencimento).toLocaleDateString()}</p>
                    </div>
                    {selectedPagamento.dataPagamento && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Data do Pagamento</p>
                        <p className="font-medium text-sm sm:text-base">{new Date(selectedPagamento.dataPagamento).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedPagamento.metodoPagamento && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Método de Pagamento</p>
                        <p className="font-medium text-sm sm:text-base">{selectedPagamento.metodoPagamento}</p>
                      </div>
                    )}
                    {selectedPagamento.comprovante && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Comprovante</p>
                        <p className="font-medium text-sm sm:text-base">{selectedPagamento.comprovante}</p>
                      </div>
                    )}
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

export default Pagamentos;

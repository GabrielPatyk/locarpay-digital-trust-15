
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  CreditCard, 
  Send, 
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react';

interface Pagamento {
  id: string;
  inquilino: string;
  valor: number;
  status: 'pendente' | 'enviado' | 'confirmado' | 'vencido';
  vencimento: string;
  tipo: 'fianca' | 'mensalidade';
}

const Financeiro = () => {
  const { toast } = useToast();
  const [pagamentos] = useState<Pagamento[]>([
    {
      id: '1',
      inquilino: 'Pedro Almeida',
      valor: 250,
      status: 'pendente',
      vencimento: '2024-02-15',
      tipo: 'fianca'
    },
    {
      id: '2',
      inquilino: 'Maria Santos',
      valor: 300,
      status: 'enviado',
      vencimento: '2024-02-10',
      tipo: 'fianca'
    },
    {
      id: '3',
      inquilino: 'João Silva',
      valor: 400,
      status: 'confirmado',
      vencimento: '2024-02-05',
      tipo: 'fianca'
    }
  ]);

  const gerarPagamento = (id: string) => {
    toast({
      title: "Pagamento gerado!",
      description: "Link de pagamento criado com sucesso.",
    });
  };

  const enviarPagamento = (id: string) => {
    toast({
      title: "Pagamento enviado!",
      description: "Link enviado para o inquilino via e-mail.",
    });
  };

  const confirmarPagamento = (id: string) => {
    toast({
      title: "Pagamento confirmado!",
      description: "Pagamento processado e confirmado no sistema.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-success';
      case 'enviado': return 'bg-blue-500';
      case 'pendente': return 'bg-warning';
      case 'vencido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado': return CheckCircle;
      case 'enviado': return Send;
      case 'pendente': return Clock;
      case 'vencido': return AlertCircle;
      default: return Clock;
    }
  };

  const stats = {
    totalPagamentos: pagamentos.length,
    confirmados: pagamentos.filter(p => p.status === 'confirmado').length,
    pendentes: pagamentos.filter(p => p.status === 'pendente').length,
    valorTotal: pagamentos.reduce((sum, p) => sum + p.valor, 0)
  };

  return (
    <Layout title="Departamento Financeiro">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Departamento Financeiro</h2>
                <p className="opacity-90 text-sm sm:text-base">
                  Gerencie pagamentos, confirme transações e mantenha o controle financeiro.
                </p>
              </div>
              <DollarSign className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.totalPagamentos}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Confirmados</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{stats.confirmados}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Pendentes</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{stats.pendentes}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#BC942C]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Valor Total</p>
                  <p className="text-lg sm:text-2xl font-bold">R$ {stats.valorTotal}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-[#BC942C]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagamentos List */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Gestão de Pagamentos</CardTitle>
            <CardDescription className="text-sm">
              Gerencie todos os pagamentos dos inquilinos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {pagamentos.map((pagamento) => {
                const StatusIcon = getStatusIcon(pagamento.status);
                return (
                  <div key={pagamento.id} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <StatusIcon className="h-4 w-4 text-gray-600" />
                          <h4 className="font-medium text-sm sm:text-base">{pagamento.inquilino}</h4>
                          <Badge className={`${getStatusColor(pagamento.status)} text-white text-xs`}>
                            {pagamento.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Valor:</span> R$ {pagamento.valor}
                          </div>
                          <div>
                            <span className="font-medium">Tipo:</span> {pagamento.tipo}
                          </div>
                          <div>
                            <span className="font-medium">Vencimento:</span> {new Date(pagamento.vencimento).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {pagamento.status === 'pendente' && (
                          <Button 
                            onClick={() => gerarPagamento(pagamento.id)}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-xs"
                          >
                            <CreditCard className="mr-1 h-3 w-3" />
                            Gerar
                          </Button>
                        )}
                        {pagamento.status === 'pendente' && (
                          <Button 
                            onClick={() => enviarPagamento(pagamento.id)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Send className="mr-1 h-3 w-3" />
                            Enviar
                          </Button>
                        )}
                        {pagamento.status === 'enviado' && (
                          <Button 
                            onClick={() => confirmarPagamento(pagamento.id)}
                            size="sm"
                            className="bg-success hover:bg-success/90 text-xs"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Financeiro;

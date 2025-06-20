
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Send, 
  CheckCircle,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  Eye,
  Search
} from 'lucide-react';

interface PagamentoFinanceiro {
  id: string;
  inquilino: string;
  emailInquilino: string;
  cpfInquilino: string;
  imovel: string;
  enderecoImovel: string;
  valor: number;
  status: 'pendente_link' | 'link_enviado' | 'pago' | 'vencido';
  vencimento: string;
  linkPagamento?: string;
  dataEnvio?: string;
}

const PagamentosFinanceiro = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoFinanceiro | null>(null);
  const [linkPagamento, setLinkPagamento] = useState('');
  
  const [pagamentos] = useState<PagamentoFinanceiro[]>([
    {
      id: '1',
      inquilino: 'Pedro Almeida',
      emailInquilino: 'pedro@exemplo.com',
      cpfInquilino: '123.456.789-01',
      imovel: 'Apartamento 302',
      enderecoImovel: 'Rua das Flores, 123 - Centro, São Paulo/SP',
      valor: 2500,
      status: 'pendente_link',
      vencimento: '2024-02-15'
    },
    {
      id: '2',
      inquilino: 'Maria Santos',
      emailInquilino: 'maria@exemplo.com',
      cpfInquilino: '987.654.321-09',
      imovel: 'Casa Térrea',
      enderecoImovel: 'Av. Principal, 456 - Jardins, São Paulo/SP',
      valor: 3000,
      status: 'link_enviado',
      vencimento: '2024-02-10',
      linkPagamento: 'https://banco.com.br/pagamento/abc123',
      dataEnvio: '2024-02-08'
    }
  ]);

  const anexarLink = (id: string) => {
    if (!linkPagamento.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um link de pagamento válido.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Link anexado!",
      description: "Link de pagamento anexado com sucesso.",
    });
    setLinkPagamento('');
    setSelectedPagamento(null);
  };

  const enviarLink = (id: string) => {
    toast({
      title: "Link enviado!",
      description: "Link de pagamento enviado para o inquilino via e-mail.",
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
      case 'pago': return 'bg-success';
      case 'link_enviado': return 'bg-blue-500';
      case 'pendente_link': return 'bg-warning';
      case 'vencido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'link_enviado': return 'Link Enviado';
      case 'pendente_link': return 'Pendente Link';
      case 'vencido': return 'Vencido';
      default: return status;
    }
  };

  const filteredPagamentos = pagamentos.filter(pagamento =>
    pagamento.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pagamento.emailInquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pagamento.imovel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Gestão de Pagamentos">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Gestão de Pagamentos</h2>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pagamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>

        {/* Pagamentos List */}
        <div className="space-y-4">
          {filteredPagamentos.map((pagamento) => (
            <Card key={pagamento.id} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{pagamento.inquilino}</h4>
                    <p className="text-sm text-gray-600">{pagamento.emailInquilino}</p>
                    <p className="text-sm text-gray-600">CPF: {pagamento.cpfInquilino}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">{pagamento.imovel}</p>
                    <p className="text-sm text-gray-600">{pagamento.enderecoImovel}</p>
                  </div>
                  
                  <div>
                    <p className="text-lg font-bold text-gray-900">R$ {pagamento.valor.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Venc: {new Date(pagamento.vencimento).toLocaleDateString()}</p>
                    <Badge className={`${getStatusColor(pagamento.status)} text-white mt-1`}>
                      {getStatusText(pagamento.status)}
                    </Badge>
                  </div>
                </div>

                {pagamento.linkPagamento && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <LinkIcon className="inline h-4 w-4 mr-1" />
                      Link: {pagamento.linkPagamento}
                    </p>
                    {pagamento.dataEnvio && (
                      <p className="text-sm text-blue-600">
                        Enviado em: {new Date(pagamento.dataEnvio).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPagamento(pagamento)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Ver Detalhes
                  </Button>

                  {pagamento.status === 'pendente_link' && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedPagamento(pagamento)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <LinkIcon className="mr-1 h-4 w-4" />
                      Anexar Link
                    </Button>
                  )}

                  {pagamento.status === 'pendente_link' && pagamento.linkPagamento && (
                    <Button
                      size="sm"
                      onClick={() => enviarLink(pagamento.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Send className="mr-1 h-4 w-4" />
                      Enviar Link
                    </Button>
                  )}

                  {pagamento.status === 'link_enviado' && (
                    <Button
                      size="sm"
                      onClick={() => confirmarPagamento(pagamento.id)}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Confirmar Pagamento
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal para anexar link */}
        {selectedPagamento && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle>Anexar Link de Pagamento</CardTitle>
                <CardDescription>
                  {selectedPagamento.inquilino} - R$ {selectedPagamento.valor.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Link de Pagamento do Banco</label>
                  <Input
                    placeholder="https://banco.com.br/pagamento/..."
                    value={linkPagamento}
                    onChange={(e) => setLinkPagamento(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => anexarLink(selectedPagamento.id)}
                    className="flex-1"
                  >
                    Anexar Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPagamento(null);
                      setLinkPagamento('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PagamentosFinanceiro;

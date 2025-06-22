
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Users,
  Link as LinkIcon,
  Eye,
  Search
} from 'lucide-react';

interface FiancaFinanceiro {
  id: string;
  inquilino: string;
  emailInquilino: string;
  cpfInquilino: string;
  imovel: string;
  enderecoImovel: string;
  valor: number;
  status: 'pendente_link' | 'link_anexado' | 'link_enviado' | 'pago' | 'vencido';
  vencimento: string;
  linkPagamento?: string;
  dataEnvio?: string;
  dataPagamento?: string;
  observacoes?: string;
}

const Financeiro = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFianca, setSelectedFianca] = useState<FiancaFinanceiro | null>(null);
  const [linkPagamento, setLinkPagamento] = useState('');
  
  const [fiancas] = useState<FiancaFinanceiro[]>([
    {
      id: '1',
      inquilino: 'Pedro Almeida',
      emailInquilino: 'pedro@exemplo.com',
      cpfInquilino: '123.456.789-01',
      imovel: 'Apartamento 302',
      enderecoImovel: 'Rua das Flores, 123 - Centro, São Paulo/SP - CEP: 01234-567',
      valor: 2500,
      status: 'pendente_link',
      vencimento: '2024-02-15',
      observacoes: 'Fiança aprovada pelo analista em 10/02/2024'
    },
    {
      id: '2',
      inquilino: 'Maria Santos',
      emailInquilino: 'maria@exemplo.com',
      cpfInquilino: '987.654.321-09',
      imovel: 'Casa Térrea',
      enderecoImovel: 'Av. Principal, 456 - Jardins, São Paulo/SP - CEP: 98765-432',
      valor: 3000,
      status: 'link_enviado',
      vencimento: '2024-02-10',
      linkPagamento: 'https://banco.com.br/pagamento/abc123',
      dataEnvio: '2024-02-08',
      observacoes: 'Link enviado via e-mail e WhatsApp'
    },
    {
      id: '3',
      inquilino: 'João Silva',
      emailInquilino: 'joao@exemplo.com',
      cpfInquilino: '456.789.123-45',
      imovel: 'Apartamento 505',
      enderecoImovel: 'Rua das Palmeiras, 789 - Vila Madalena, São Paulo/SP - CEP: 54321-098',
      valor: 2800,
      status: 'pago',
      vencimento: '2024-02-05',
      linkPagamento: 'https://banco.com.br/pagamento/def456',
      dataEnvio: '2024-02-03',
      dataPagamento: '2024-02-04',
      observacoes: 'Pagamento confirmado via PIX'
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
    setSelectedFianca(null);
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
      case 'link_anexado': return 'bg-purple-500';
      case 'pendente_link': return 'bg-warning';
      case 'vencido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'link_enviado': return 'Link Enviado';
      case 'link_anexado': return 'Link Anexado';
      case 'pendente_link': return 'Aguardando Link';
      case 'vencido': return 'Vencido';
      default: return status;
    }
  };

  const filteredFiancas = fiancas.filter(fianca =>
    fianca.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.emailInquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.imovel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalFiancas: fiancas.length,
    aguardandoLink: fiancas.filter(f => f.status === 'pendente_link').length,
    linkEnviado: fiancas.filter(f => f.status === 'link_enviado').length,
    pagos: fiancas.filter(f => f.status === 'pago').length,
    valorTotal: fiancas.reduce((sum, f) => sum + f.valor, 0),
    valorPago: fiancas.filter(f => f.status === 'pago').reduce((sum, f) => sum + f.valor, 0)
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
                  Gerencie pagamentos de fianças, anexe links de pagamento e confirme transações.
                </p>
              </div>
              <DollarSign className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Fianças</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.totalFiancas}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Aguardando</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{stats.aguardandoLink}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Enviados</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-500">{stats.linkEnviado}</p>
                </div>
                <Send className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Pagos</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{stats.pagos}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#BC942C]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Valor Total</p>
                  <p className="text-lg sm:text-2xl font-bold">R$ {stats.valorTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-[#BC942C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Recebido</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">R$ {stats.valorPago.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por inquilino, e-mail ou imóvel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Gestão de Fianças */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Gestão de Fianças Locatícias</CardTitle>
            <CardDescription className="text-sm">
              Gerencie links de pagamento e confirme recebimentos das fianças aprovadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFiancas.map((fianca) => (
                <Card key={fianca.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      {/* Informações do Inquilino */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{fianca.inquilino}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>E-mail:</strong> {fianca.emailInquilino}</p>
                          <p><strong>CPF:</strong> {fianca.cpfInquilino}</p>
                        </div>
                      </div>
                      
                      {/* Informações do Imóvel */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">{fianca.imovel}</h5>
                        <p className="text-sm text-gray-600">{fianca.enderecoImovel}</p>
                      </div>
                      
                      {/* Informações Financeiras */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            R$ {fianca.valor.toLocaleString()}
                          </span>
                          <Badge className={`${getStatusColor(fianca.status)} text-white`}>
                            {getStatusText(fianca.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          <strong>Vencimento:</strong> {new Date(fianca.vencimento).toLocaleDateString()}
                        </p>
                        {fianca.dataPagamento && (
                          <p className="text-sm text-success font-medium">
                            <strong>Pago em:</strong> {new Date(fianca.dataPagamento).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Link de Pagamento */}
                    {fianca.linkPagamento && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 break-all">
                          <LinkIcon className="inline h-4 w-4 mr-1" />
                          <strong>Link:</strong> {fianca.linkPagamento}
                        </p>
                        {fianca.dataEnvio && (
                          <p className="text-sm text-blue-600 mt-1">
                            <strong>Enviado em:</strong> {new Date(fianca.dataEnvio).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Observações */}
                    {fianca.observacoes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Observações:</strong> {fianca.observacoes}
                        </p>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFianca(fianca)}
                        className="flex items-center"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver Detalhes
                      </Button>

                      {fianca.status === 'pendente_link' && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedFianca(fianca)}
                          className="bg-blue-500 hover:bg-blue-600 flex items-center"
                        >
                          <LinkIcon className="mr-1 h-4 w-4" />
                          Anexar Link
                        </Button>
                      )}

                      {(fianca.status === 'link_anexado' || fianca.status === 'pendente_link') && fianca.linkPagamento && (
                        <Button
                          size="sm"
                          onClick={() => enviarLink(fianca.id)}
                          className="bg-green-500 hover:bg-green-600 flex items-center"
                        >
                          <Send className="mr-1 h-4 w-4" />
                          Enviar Link
                        </Button>
                      )}

                      {fianca.status === 'link_enviado' && (
                        <Button
                          size="sm"
                          onClick={() => confirmarPagamento(fianca.id)}
                          className="bg-success hover:bg-success/90 flex items-center"
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
          </CardContent>
        </Card>

        {/* Modal para anexar link */}
        {selectedFianca && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Anexar Link de Pagamento</CardTitle>
                <CardDescription>
                  {selectedFianca.inquilino} - {selectedFianca.imovel} - R$ {selectedFianca.valor.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600"><strong>Inquilino:</strong> {selectedFianca.inquilino}</p>
                    <p className="text-sm text-gray-600"><strong>E-mail:</strong> {selectedFianca.emailInquilino}</p>
                    <p className="text-sm text-gray-600"><strong>CPF:</strong> {selectedFianca.cpfInquilino}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Imóvel:</strong> {selectedFianca.imovel}</p>
                    <p className="text-sm text-gray-600"><strong>Valor:</strong> R$ {selectedFianca.valor.toLocaleString()}</p>
                    <p className="text-sm text-gray-600"><strong>Vencimento:</strong> {new Date(selectedFianca.vencimento).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Link de Pagamento do Banco</label>
                  <Input
                    placeholder="https://banco.com.br/pagamento/..."
                    value={linkPagamento}
                    onChange={(e) => setLinkPagamento(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cole aqui o link de pagamento gerado pelo sistema do banco
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => anexarLink(selectedFianca.id)}
                    className="flex-1"
                  >
                    Anexar Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFianca(null);
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

export default Financeiro;

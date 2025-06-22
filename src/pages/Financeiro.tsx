
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import AdicionarLinkPagamentoModal from '@/components/AdicionarLinkPagamentoModal';
import { 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Link as LinkIcon,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const Financeiro = () => {
  const { fiancas, isLoading, getStats, confirmarPagamento, isConfirmingPayment } = useFinanceiro();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedFianca, setSelectedFianca] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviada_ao_financeiro': return 'bg-purple-500';
      case 'pagamento_disponivel': return 'bg-blue-500';
      case 'comprovante_enviado': return 'bg-green-500';
      case 'ativa': return 'bg-success';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'enviada_ao_financeiro': return 'Aguardando Link';
      case 'pagamento_disponivel': return 'Link Enviado';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      case 'ativa': return 'Ativa';
      default: return status;
    }
  };

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = fianca.inquilino_nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fianca.inquilino_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || fianca.status_fianca === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAnexarLink = (fianca: any) => {
    setSelectedFianca(fianca);
    setIsModalOpen(true);
  };

  const handleConfirmarPagamento = (fiancaId: string) => {
    confirmarPagamento.mutate(fiancaId);
  };

  if (isLoading) {
    return (
      <Layout title="Financeiro">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Financeiro">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Gestão Financeira</h1>
              <p className="opacity-90">Gerencie pagamentos e confirmações de fianças</p>
            </div>
            <DollarSign className="h-12 w-12 opacity-50" />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Fianças</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalFiancas}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aguardando Link</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.aguardandoLink}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Link Enviado</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.linkEnviado}</p>
                </div>
                <LinkIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.pagos}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fianças */}
        <Card>
          <CardHeader>
            <CardTitle>Fianças para Processamento</CardTitle>
            <CardDescription>
              Gerencie links de pagamento e confirmações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por inquilino ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="enviada_ao_financeiro">Aguardando Link</SelectItem>
                  <SelectItem value="pagamento_disponivel">Link Enviado</SelectItem>
                  <SelectItem value="comprovante_enviado">Comprovante Enviado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiancas.map((fianca) => (
                  <TableRow key={fianca.id}>
                    <TableCell className="font-medium">{fianca.inquilino_nome_completo}</TableCell>
                    <TableCell>{fianca.inquilino_email}</TableCell>
                    <TableCell>R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(fianca.status_fianca)} text-white`}>
                        {getStatusLabel(fianca.status_fianca)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {fianca.status_fianca === 'enviada_ao_financeiro' && (
                          <Button
                            size="sm"
                            onClick={() => handleAnexarLink(fianca)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <LinkIcon className="mr-1 h-4 w-4" />
                            Anexar Link
                          </Button>
                        )}
                        {fianca.status_fianca === 'comprovante_enviado' && (
                          <Button
                            size="sm"
                            onClick={() => handleConfirmarPagamento(fianca.id)}
                            className="bg-green-500 hover:bg-green-600"
                            disabled={isConfirmingPayment}
                          >
                            {isConfirmingPayment ? (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="mr-1 h-4 w-4" />
                            )}
                            Confirmar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredFiancas.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma fiança encontrada
                </h3>
                <p className="text-gray-600">
                  Não há fianças para processamento no momento.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para anexar link */}
        {selectedFianca && (
          <AdicionarLinkPagamentoModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedFianca(null);
            }}
            fiancaId={selectedFianca.id}
            inquilinoNome={selectedFianca.inquilino_nome_completo}
            valorFianca={selectedFianca.imovel_valor_aluguel}
          />
        )}
      </div>
    </Layout>
  );
};

export default Financeiro;

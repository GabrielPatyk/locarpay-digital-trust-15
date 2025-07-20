
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import { 
  Eye,
  Search,
  Filter,
  AlertCircle,
  FileText
} from 'lucide-react';

const PagamentosFinanceiro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fiancas, isLoading, error } = useFinanceiro();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'pagamento_confirmado': return 'bg-green-700';
      case 'comprovante_enviado': return 'bg-green-600';
      case 'pagamento_disponivel': return 'bg-blue-500';
      case 'enviada_ao_financeiro': return 'bg-warning';
      case 'aprovada': return 'bg-orange-500';
      case 'assinatura_imobiliaria': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'pagamento_confirmado': return 'Pagamento Confirmado';
      case 'comprovante_enviado': return 'Comprovante Enviado';
      case 'pagamento_disponivel': return 'Link Disponível';
      case 'enviada_ao_financeiro': return 'Aguardando Link';
      case 'aprovada': return 'Aprovada';
      case 'assinatura_imobiliaria': return 'Aguardando Assinatura';
      default: return status;
    }
  };

  const formatImovelTipo = (tipo: string) => {
    if (!tipo) return '';
    return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
  };

  const filteredFiancas = fiancas.filter(fianca => {
    const matchesSearch = 
      fianca.inquilino_nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fianca.inquilino_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fianca.imovel_tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fianca.status_fianca === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Layout title="Gestão de Pagamentos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Gestão de Pagamentos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Pagamentos">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <Card className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Gestão de Pagamentos</h2>
                <p className="opacity-90 text-sm sm:text-base">
                  Visualize e gerencie as fianças e seus status de pagamento.
                </p>
              </div>
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 opacity-80 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por inquilino, e-mail ou imóvel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="enviada_ao_financeiro">Aguardando Link</SelectItem>
                <SelectItem value="pagamento_disponivel">Link Disponível</SelectItem>
                <SelectItem value="comprovante_enviado">Comprovante Enviado</SelectItem>
                <SelectItem value="pagamento_confirmado">Pagamento Confirmado</SelectItem>
                <SelectItem value="assinatura_imobiliaria">Aguardando Assinatura</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Fianças */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Fianças do Departamento Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFiancas.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {fiancas.length === 0 
                      ? "Nenhuma fiança encontrada para o departamento financeiro."
                      : "Nenhuma fiança encontrada com os filtros aplicados."
                    }
                  </p>
                </div>
              ) : (
                filteredFiancas.map((fianca) => (
                  <Card key={fianca.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{fianca.inquilino_nome_completo}</h4>
                          <p className="text-sm text-gray-600">{fianca.inquilino_email}</p>
                          <p className="text-sm text-gray-600">CPF: {fianca.inquilino_cpf}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">{formatImovelTipo(fianca.imovel_tipo)}</p>
                          <p className="text-sm text-gray-600">
                            {fianca.imovel_endereco}, {fianca.imovel_numero} - {fianca.imovel_bairro}
                          </p>
                          <p className="text-sm text-gray-600">
                            {fianca.imovel_cidade}/{fianca.imovel_estado}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            R$ {Number(fianca.valor_fianca || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Criado em:</strong> {new Date(fianca.data_criacao).toLocaleDateString()}
                          </p>
                          <Badge className={`${getStatusColor(fianca.status_fianca)} text-white mt-1`}>
                            {getStatusText(fianca.status_fianca)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/detalhe-fianca/${fianca.id}`)}
                          className="flex items-center"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PagamentosFinanceiro;

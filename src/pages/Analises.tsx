
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  FileText, 
  Eye, 
  Download,
  Calendar,
  TrendingUp,
  User,
  DollarSign,
  MapPin
} from 'lucide-react';

const Analises = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: fiancas = [], isLoading } = useQuery({
    queryKey: ['analises-fiancas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          inquilino_cpf,
          imovel_valor_aluguel,
          imovel_tempo_locacao,
          imovel_endereco,
          imovel_cidade,
          imovel_estado,
          status_fianca,
          score_credito,
          taxa_aplicada,
          data_analise,
          data_criacao,
          valor_fianca
        `)
        .neq('status_fianca', 'em_analise')
        .order('data_analise', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const filteredAnalises = fiancas.filter(fianca =>
    fianca.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fianca.inquilino_cpf.includes(searchTerm) ||
    fianca.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'aprovada':
        return 'bg-blue-100 text-blue-800';
      case 'enviada_ao_financeiro':
        return 'bg-purple-100 text-purple-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      case 'vencida':
        return 'bg-gray-100 text-gray-800';
      case 'cancelada':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'Ativa';
      case 'aprovada':
        return 'Aprovada';
      case 'enviada_ao_financeiro':
        return 'Enviada ao Financeiro';
      case 'rejeitada':
        return 'Rejeitada';
      case 'vencida':
        return 'Vencida';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleViewDetails = (fiancaId: string) => {
    navigate(`/detalhe-fianca/${fiancaId}`);
  };

  return (
    <Layout title="Análises de Crédito">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análises de Crédito</h1>
            <p className="text-gray-600">Histórico de todas as análises realizadas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar análises por cliente, CPF ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAnalises.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma análise encontrada
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente ajustar sua busca.'
                    : 'As análises realizadas aparecerão aqui.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAnalises.map((fianca) => (
              <Card key={fianca.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">#{fianca.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(fianca.status_fianca)}>
                          {getStatusLabel(fianca.status_fianca)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Valor Total da Fiança</p>
                      <p className="text-xl font-bold text-primary">
                        {fianca.valor_fianca 
                          ? `R$ ${fianca.valor_fianca.toLocaleString('pt-BR')}` 
                          : 'N/A'
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        Referente a {fianca.imovel_tempo_locacao} meses de aluguel de: R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Cliente</p>
                        <p className="font-medium">{fianca.inquilino_nome_completo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">CPF</p>
                        <p className="font-medium">{fianca.inquilino_cpf}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="font-medium">
                          {fianca.score_credito ? `${fianca.score_credito} pontos` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Taxa</p>
                        <p className="font-medium">
                          {fianca.taxa_aplicada ? `${fianca.taxa_aplicada}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {fianca.imovel_endereco}, {fianca.imovel_cidade} - {fianca.imovel_estado}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Análise realizada em {fianca.data_analise 
                          ? new Date(fianca.data_analise).toLocaleDateString('pt-BR')
                          : new Date(fianca.data_criacao).toLocaleDateString('pt-BR')
                        }
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(fianca.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Relatório
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analises;

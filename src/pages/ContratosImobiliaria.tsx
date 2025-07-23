import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, Download, MapPin, User, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContratoFianca {
  id: string;
  fianca_id: string;
  status_contrato: string;
  created_at: string;
  url_assinatura_inquilino: string | null;
  fiancas_locaticias: {
    inquilino_nome_completo: string;
    inquilino_email: string;
    imovel_endereco: string;
    imovel_numero: string;
    imovel_bairro: string;
    imovel_cidade: string;
    imovel_valor_aluguel: number;
    imovel_tempo_locacao: number;
    imovel_tipo: string;
    valor_fianca: number;
    data_criacao: string;
  };
}

const ContratosImobiliaria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: contratos = [], isLoading, error } = useQuery({
    queryKey: ['contratos-fianca-imobiliaria', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('contratos_fianca')
        .select(`
          id,
          fianca_id,
          status_contrato,
          created_at,
          url_assinatura_inquilino,
          fiancas_locaticias!inner (
            id_imobiliaria,
            inquilino_nome_completo,
            inquilino_email,
            imovel_endereco,
            imovel_numero,
            imovel_bairro,
            imovel_cidade,
            imovel_valor_aluguel,
            imovel_tempo_locacao,
            imovel_tipo,
            valor_fianca,
            data_criacao
          )
        `)
        .eq('imobiliaria_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contratos:', error);
        throw error;
      }

      return data as ContratoFianca[];
    },
    enabled: !!user?.id && user.cargo === 'imobiliaria'
  });

  const filteredContratos = contratos.filter(contrato =>
    contrato.fiancas_locaticias.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.fiancas_locaticias.inquilino_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'gerando_link':
        return 'Gerando Link';
      case 'assinatura_inquilino':
        return 'Aguardando Assinatura';
      case 'assinado':
        return 'Assinado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assinado':
        return 'bg-green-100 text-green-800';
      case 'gerando_link':
        return 'bg-yellow-100 text-yellow-800';
      case 'assinatura_inquilino':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'residencial':
        return 'Residencial';
      case 'comercial':
        return 'Comercial';
      default:
        return tipo;
    }
  };

  const handleVisualizarContrato = (contrato: ContratoFianca) => {
    if (contrato.url_assinatura_inquilino) {
      window.open(contrato.url_assinatura_inquilino, '_blank');
    } else {
      toast({
        title: "Link não disponível",
        description: "O link de assinatura ainda não foi gerado para este contrato.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadContrato = (contrato: ContratoFianca) => {
    if (contrato.url_assinatura_inquilino) {
      window.open(contrato.url_assinatura_inquilino, '_blank');
    } else {
      toast({
        title: "Download não disponível",
        description: "O contrato ainda não está disponível para download.",
        variant: "destructive"
      });
    }
  };

  const calcularDataFim = (dataInicio: string, meses: number) => {
    const data = new Date(dataInicio);
    data.setMonth(data.getMonth() + meses);
    return data.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Layout title="Contratos">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Contratos">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Erro ao carregar contratos. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Contratos">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os contratos de fiança da sua imobiliária
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por inquilino, e-mail ou ID do contrato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredContratos.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  {searchTerm ? 'Nenhum contrato encontrado com os filtros aplicados.' : 'Nenhum contrato encontrado.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContratos.map((contrato) => (
              <Card key={contrato.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Contrato #{contrato.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(contrato.status_contrato)}>
                          {getStatusLabel(contrato.status_contrato)}
                        </Badge>
                        <Badge variant="outline">
                          {getTipoLabel(contrato.fiancas_locaticias.imovel_tipo)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {contrato.fiancas_locaticias.imovel_valor_aluguel.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                      <p className="text-sm text-gray-500">Aluguel mensal</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{contrato.fiancas_locaticias.inquilino_nome_completo}</p>
                          <p className="text-sm text-gray-500">{contrato.fiancas_locaticias.inquilino_email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {contrato.fiancas_locaticias.imovel_endereco}, {contrato.fiancas_locaticias.imovel_numero}
                          </p>
                          <p className="text-sm text-gray-500">
                            {contrato.fiancas_locaticias.imovel_bairro}, {contrato.fiancas_locaticias.imovel_cidade}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Período do Contrato</p>
                          <p className="text-sm text-gray-500">
                            {contrato.fiancas_locaticias.imovel_tempo_locacao} meses
                          </p>
                          <p className="text-sm text-gray-500">
                            Fim: {calcularDataFim(contrato.fiancas_locaticias.data_criacao, contrato.fiancas_locaticias.imovel_tempo_locacao)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Valor Total da Fiança</p>
                          <p className="text-lg font-semibold text-green-600">
                            R$ {contrato.fiancas_locaticias.valor_fianca.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisualizarContrato(contrato)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadContrato(contrato)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
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

export default ContratosImobiliaria;
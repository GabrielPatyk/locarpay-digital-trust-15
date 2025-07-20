
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  Users,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FiancaAnalise {
  id: string;
  inquilino_nome_completo: string;
  score_credito: number | null;
  imovel_valor_aluguel: number;
  valor_fianca: number | null;
  status_fianca: string;
  data_criacao: string;
  taxa_aplicada: number | null;
}

interface DashboardStats {
  fiancasAprovadas: number;
  scoreMedia: number;
  valorMedioAluguel: number;
  totalFiancas: number;
  taxaMedia: number;
}

const RelatoriosAnalista = () => {
  const { user } = useAuth();
  const [fiancas, setFiancas] = useState<FiancaAnalise[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    fiancasAprovadas: 0,
    scoreMedia: 0,
    valorMedioAluguel: 0,
    totalFiancas: 0,
    taxaMedia: 0
  });

  const buscarFiancas = async () => {
    if (!user || user.type !== 'analista') return;

    setLoading(true);
    try {
      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          score_credito,
          imovel_valor_aluguel,
          valor_fianca,
          status_fianca,
          data_criacao,
          taxa_aplicada
        `)
        .eq('id_analista', user.id)
        .in('status_fianca', ['aprovada', 'rejeitada']);

      // Aplicar filtros de data
      if (dataInicio) {
        query = query.gte('data_criacao', dataInicio);
      }
      if (dataFim) {
        query = query.lte('data_criacao', dataFim + 'T23:59:59');
      }

      // Aplicar filtro de status
      if (statusFiltro) {
        const statusMap: { [key: string]: string } = {
          'Aprovado': 'aprovada',
          'Reprovado': 'rejeitada'
        };
        if (statusMap[statusFiltro]) {
          query = query.eq('status_fianca', statusMap[statusFiltro]);
        }
      }

      const { data, error } = await query.order('data_criacao', { ascending: false });

      if (error) {
        throw error;
      }

      setFiancas(data || []);
      calcularEstatisticas(data || []);
      
    } catch (error) {
      console.error('Erro ao buscar fianças:', error);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (dados: FiancaAnalise[]) => {
    const aprovadas = dados.filter(f => f.status_fianca === 'aprovada');
    
    const newStats: DashboardStats = {
      fiancasAprovadas: aprovadas.length,
      scoreMedia: aprovadas.length > 0 ? 
        Math.round(aprovadas.reduce((acc, f) => acc + (f.score_credito || 0), 0) / aprovadas.length) : 0,
      valorMedioAluguel: dados.length > 0 ? 
        Math.round(dados.reduce((acc, f) => acc + f.imovel_valor_aluguel, 0) / dados.length) : 0,
      totalFiancas: aprovadas.reduce((acc, f) => acc + (f.valor_fianca || 0), 0),
      taxaMedia: aprovadas.length > 0 ? 
        Math.round((aprovadas.reduce((acc, f) => acc + (f.taxa_aplicada || 0), 0) / aprovadas.length) * 100) / 100 : 0
    };

    setStats(newStats);
  };

  const formatarStatus = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'Aprovado';
      case 'rejeitada':
        return 'Reprovado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'text-green-600';
      case 'rejeitada':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    if (user?.type === 'analista') {
      buscarFiancas();
    }
  }, [user, dataInicio, dataFim, statusFiltro]);

  return (
    <Layout title="Relatórios do Analista">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios do Analista</h1>
            <p className="text-gray-600">Acompanhe suas análises e estatísticas de aprovação</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.fiancasAprovadas}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Médio</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.scoreMedia}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio Aluguel</p>
                  <p className="text-2xl font-bold text-purple-600">R$ {stats.valorMedioAluguel.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total em Fianças</p>
                  <p className="text-2xl font-bold text-orange-600">R$ {stats.totalFiancas.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Média (%)</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.taxaMedia}%</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription>
              Filtre os dados por período e status para análises mais detalhadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Reprovado">Reprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Fianças */}
        <Card>
          <CardHeader>
            <CardTitle>Fianças Analisadas</CardTitle>
            <CardDescription>
              {fiancas.length} fiança{fiancas.length !== 1 ? 's' : ''} encontrada{fiancas.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando dados...</p>
              </div>
            ) : fiancas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhuma fiança encontrada neste período.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID da Fiança</TableHead>
                    <TableHead>Nome do Inquilino</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Valor do Aluguel</TableHead>
                    <TableHead>Valor da Fiança</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiancas.map((fianca) => (
                    <TableRow key={fianca.id}>
                      <TableCell className="font-mono text-sm">
                        {fianca.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {fianca.inquilino_nome_completo}
                      </TableCell>
                      <TableCell>
                        {fianca.score_credito || 'N/A'}
                      </TableCell>
                      <TableCell>
                        R$ {fianca.imovel_valor_aluguel.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        R$ {(fianca.valor_fianca || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(fianca.status_fianca)}`}>
                          {formatarStatus(fianca.status_fianca)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosAnalista;

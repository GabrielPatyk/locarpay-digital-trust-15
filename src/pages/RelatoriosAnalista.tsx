import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Filter
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const RelatoriosAnalista = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const { toast } = useToast();

  // Query para buscar dados das fianças com filtro de data
  const { data: fiancasData = [], isLoading: isLoadingFiancas } = useQuery({
    queryKey: ['relatorios-analista-fiancas', dataInicio, dataFim, filtroAplicado],
    queryFn: async () => {
      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          *,
          imobiliaria:usuarios!id_imobiliaria(nome),
          analista:usuarios!id_analista(nome)
        `)
        .order('data_criacao', { ascending: false });

      if (filtroAplicado && dataInicio && dataFim) {
        query = query
          .gte('data_criacao', dataInicio)
          .lte('data_criacao', dataFim + 'T23:59:59.999Z');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Calcular estatísticas baseadas nos dados filtrados
  const estatisticas = React.useMemo(() => {
    const totalAnalises = fiancasData.length;
    const aprovacoes = fiancasData.filter(f => f.status_fianca === 'aprovada').length;
    const reprovacoes = fiancasData.filter(f => f.status_fianca === 'rejeitada').length;
    const pendentes = fiancasData.filter(f => f.status_fianca === 'em_analise').length;
    const taxaAprovacao = totalAnalises > 0 ? ((aprovacoes / totalAnalises) * 100).toFixed(1) : '0';
    
    const scoresValidos = fiancasData.filter(f => f.score_credito).map(f => f.score_credito);
    const scoreMedia = scoresValidos.length > 0 
      ? Math.round(scoresValidos.reduce((a, b) => a + b, 0) / scoresValidos.length)
      : 0;
    
    const valoresValidos = fiancasData.filter(f => f.imovel_valor_aluguel).map(f => f.imovel_valor_aluguel);
    const valorMedio = valoresValidos.length > 0
      ? Math.round(valoresValidos.reduce((a, b) => a + b, 0) / valoresValidos.length)
      : 0;

    return {
      totalAnalises,
      aprovacoes,
      reprovacoes,
      pendentes,
      taxaAprovacao: parseFloat(taxaAprovacao),
      scoreMedia,
      valorMedio
    };
  }, [fiancasData]);

  const handleGerarRelatorio = () => {
    if (!dataInicio || !dataFim) {
      toast({
        title: "Erro",
        description: "Por favor, selecione as datas de início e fim.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
      toast({
        title: "Erro",
        description: "A data de início deve ser anterior à data de fim.",
        variant: "destructive"
      });
      return;
    }

    setFiltroAplicado(true);
    toast({
      title: "Relatório Gerado",
      description: "Dados filtrados com sucesso para o período selecionado."
    });
  };

  const exportarParaExcel = () => {
    if (!filtroAplicado || fiancasData.length === 0) {
      toast({
        title: "Aviso",
        description: "Gere um relatório primeiro ou certifique-se de que há dados para exportar.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Criar XML compatível com Excel
      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
                xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:x="urn:schemas-microsoft-com:office:excel"
                xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
                xmlns:html="http://www.w3.org/TR/REC-html40">
        <Worksheet ss:Name="Relatório Analista">
          <Table>
            <Row>
              <Cell><Data ss:Type="String">ID Fiança</Data></Cell>
              <Cell><Data ss:Type="String">Data Criação</Data></Cell>
              <Cell><Data ss:Type="String">Status</Data></Cell>
              <Cell><Data ss:Type="String">Inquilino</Data></Cell>
              <Cell><Data ss:Type="String">CPF Inquilino</Data></Cell>
              <Cell><Data ss:Type="String">Imobiliária</Data></Cell>
              <Cell><Data ss:Type="String">Analista</Data></Cell>
              <Cell><Data ss:Type="String">Score Crédito</Data></Cell>
              <Cell><Data ss:Type="String">Taxa Aplicada</Data></Cell>
              <Cell><Data ss:Type="String">Valor Aluguel</Data></Cell>
              <Cell><Data ss:Type="String">Valor Fiança</Data></Cell>
              <Cell><Data ss:Type="String">Tipo Imóvel</Data></Cell>
              <Cell><Data ss:Type="String">Endereço Imóvel</Data></Cell>
            </Row>`;

      fiancasData.forEach(fianca => {
        xmlContent += `
            <Row>
              <Cell><Data ss:Type="String">${fianca.id}</Data></Cell>
              <Cell><Data ss:Type="String">${format(new Date(fianca.data_criacao), 'dd/MM/yyyy HH:mm')}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.status_fianca}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.inquilino_nome_completo}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.inquilino_cpf}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.imobiliaria?.nome || 'N/A'}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.id_analista ? 'Analisado' : 'Pendente'}</Data></Cell>
              <Cell><Data ss:Type="Number">${fianca.score_credito || 0}</Data></Cell>
              <Cell><Data ss:Type="Number">${fianca.taxa_aplicada || 0}</Data></Cell>
              <Cell><Data ss:Type="Number">${fianca.imovel_valor_aluguel}</Data></Cell>
              <Cell><Data ss:Type="Number">${fianca.valor_fianca || 0}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.imovel_tipo}</Data></Cell>
              <Cell><Data ss:Type="String">${fianca.imovel_endereco}, ${fianca.imovel_numero} - ${fianca.imovel_bairro}, ${fianca.imovel_cidade}/${fianca.imovel_estado}</Data></Cell>
            </Row>`;
      });

      xmlContent += `
          </Table>
        </Worksheet>
      </Workbook>`;

      // Criar blob e download
      const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const dataInicioFormatada = format(new Date(dataInicio), 'yyyy-MM-dd');
      const dataFimFormatada = format(new Date(dataFim), 'yyyy-MM-dd');
      link.download = `relatorio-analista-${dataInicioFormatada}-${dataFimFormatada}.xml`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação Concluída",
        description: "Relatório exportado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na Exportação",
        description: "Ocorreu um erro ao exportar o relatório.",
        variant: "destructive"
      });
    }
  };

  const relatoriosDisponiveis = [
    {
      id: 1,
      titulo: 'Relatório Mensal de Análises',
      descricao: 'Resumo completo das análises realizadas no mês',
      periodo: 'Janeiro 2024',
      tipo: 'PDF',
      tamanho: '2.3 MB',
      dataGeracao: '2024-02-01'
    },
    {
      id: 2,
      titulo: 'Relatório de Performance',
      descricao: 'Indicadores de performance e produtividade',
      periodo: 'Janeiro 2024',
      tipo: 'Excel',
      tamanho: '1.8 MB',
      dataGeracao: '2024-02-01'
    },
    {
      id: 3,
      titulo: 'Análise de Scores',
      descricao: 'Distribuição e análise dos scores de crédito',
      periodo: 'Janeiro 2024',
      tipo: 'PDF',
      tamanho: '3.1 MB',
      dataGeracao: '2024-02-01'
    }
  ];

  return (
    <Layout title="Relatórios">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Acompanhe métricas e gere relatórios detalhados</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={exportarParaExcel}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!filtroAplicado || fiancasData.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              📤 Exportar Relatório
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Gerar Novo Relatório
            </Button>
          </div>
        </div>

        {/* Filtro por Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Data
            </CardTitle>
            <CardDescription>
              Selecione o período para gerar relatórios personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="data-inicio">Data de Início</Label>
                <Input
                  id="data-inicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="data-fim">Data de Fim</Label>
                <Input
                  id="data-fim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleGerarRelatorio}
                className="bg-primary hover:bg-primary/90"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
            {filtroAplicado && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  📊 Relatório gerado para o período de {format(new Date(dataInicio), 'dd/MM/yyyy')} até {format(new Date(dataFim), 'dd/MM/yyyy')}
                  {fiancasData.length === 0 && " - Nenhum dado encontrado para este período."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Análises</p>
                  <p className="text-2xl font-bold text-primary">{estatisticas.totalAnalises}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                  <p className="text-2xl font-bold text-success">{estatisticas.taxaAprovacao}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Médio</p>
                  <p className="text-2xl font-bold text-warning">{estatisticas.scoreMedia}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                  <p className="text-2xl font-bold" style={{ color: '#BC942C' }}>R$ {estatisticas.valorMedio.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8" style={{ color: '#BC942C' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento das Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-success">Aprovações</h3>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{estatisticas.aprovacoes}</p>
              <p className="text-sm text-gray-600">análises aprovadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-600">Reprovações</h3>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{estatisticas.reprovacoes}</p>
              <p className="text-sm text-gray-600">análises reprovadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-warning">Pendentes</h3>
                <Users className="h-5 w-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{estatisticas.pendentes}</p>
              <p className="text-sm text-gray-600">aguardando análise</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Faça download dos relatórios gerados anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosDisponiveis.map((relatorio) => (
                <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{relatorio.titulo}</h4>
                      <p className="text-sm text-gray-600">{relatorio.descricao}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">Período: {relatorio.periodo}</span>
                        <Badge variant="outline">{relatorio.tipo}</Badge>
                        <span className="text-xs text-gray-500">{relatorio.tamanho}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Gerado em</p>
                      <p className="text-sm font-medium">
                        {new Date(relatorio.dataGeracao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosAnalista;

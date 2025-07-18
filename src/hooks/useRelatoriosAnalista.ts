
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FiancaAnalise {
  id: string;
  data_criacao: string;
  data_analise: string | null;
  data_aprovacao: string | null;
  status_fianca: string;
  inquilino_nome_completo: string;
  inquilino_cpf: string;
  score_credito: number | null;
  taxa_aplicada: number | null;
  imovel_valor_aluguel: number;
  valor_fianca: number | null;
  imovel_tipo: string;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_estado: string;
  imobiliaria: {
    nome: string;
  };
}

interface RelatorioDisponivel {
  id: string;
  nome_arquivo: string;
  data_geracao: string;
  periodo_inicio: string;
  periodo_fim: string;
  url_download: string;
}

export const useRelatoriosAnalista = () => {
  const { user } = useAuth();
  const [fiancas, setFiancas] = useState<FiancaAnalise[]>([]);
  const [relatoriosDisponiveis, setRelatoriosDisponiveis] = useState<RelatorioDisponivel[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());

  const buscarAnalises = async () => {
    if (!user || user.type !== 'analista') return;

    setLoading(true);
    try {
      console.log('Buscando análises do analista:', user.id);
      console.log('Período:', dataInicio.toISOString().split('T')[0], 'a', dataFim.toISOString().split('T')[0]);

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          data_criacao,
          data_analise,
          data_aprovacao,
          status_fianca,
          inquilino_nome_completo,
          inquilino_cpf,
          score_credito,
          taxa_aplicada,
          imovel_valor_aluguel,
          valor_fianca,
          imovel_tipo,
          imovel_endereco,
          imovel_numero,
          imovel_bairro,
          imovel_cidade,
          imovel_estado,
          imobiliaria:usuarios!fiancas_locaticias_id_imobiliaria_fkey(nome)
        `)
        .eq('id_analista', user.id)
        .eq('status_fianca', 'aprovada')
        .gte('data_aprovacao', dataInicio.toISOString().split('T')[0])
        .lte('data_aprovacao', dataFim.toISOString().split('T')[0] + 'T23:59:59')
        .not('data_aprovacao', 'is', null)
        .order('data_aprovacao', { ascending: false });

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      console.log('Dados retornados:', data);
      setFiancas(data || []);
      
      if (!data || data.length === 0) {
        toast.info('Nenhuma análise aprovada encontrada para o período selecionado');
      } else {
        toast.success(`${data.length} análise(s) aprovada(s) encontrada(s)`);
      }
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
      toast.error('Erro ao carregar análises aprovadas');
    } finally {
      setLoading(false);
    }
  };

  const buscarRelatoriosDisponiveis = async () => {
    if (!user || user.type !== 'analista') return;

    try {
      const { data, error } = await supabase.storage
        .from('relatorios')
        .list(`analista-${user.id}/`, {
          limit: 50,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Erro ao buscar relatórios:', error);
        return;
      }

      const relatorios = data?.map(file => ({
        id: file.name,
        nome_arquivo: file.name,
        data_geracao: file.created_at || '',
        periodo_inicio: file.name.includes('_') ? file.name.split('_')[1] : '',
        periodo_fim: file.name.includes('_') ? file.name.split('_')[2]?.replace('.xml', '') : '',
        url_download: ''
      })) || [];

      setRelatoriosDisponiveis(relatorios);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    }
  };

  const gerarRelatorioXML = async () => {
    if (!user || fiancas.length === 0) {
      toast.error('Não há dados para gerar o relatório');
      return;
    }

    try {
      const dataInicioStr = dataInicio.toISOString().split('T')[0];
      const dataFimStr = dataFim.toISOString().split('T')[0];
      
      // Criar XML com os dados das análises aprovadas
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel">
 <Worksheet ss:Name="Relatório de Fianças Aprovadas">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">ID da Fiança</Data></Cell>
    <Cell><Data ss:Type="String">Data Criação</Data></Cell>
    <Cell><Data ss:Type="String">Data Análise</Data></Cell>
    <Cell><Data ss:Type="String">Data Aprovação</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
    <Cell><Data ss:Type="String">Inquilino</Data></Cell>
    <Cell><Data ss:Type="String">CPF</Data></Cell>
    <Cell><Data ss:Type="String">Score de Crédito</Data></Cell>
    <Cell><Data ss:Type="String">Taxa Aplicada (%)</Data></Cell>
    <Cell><Data ss:Type="String">Valor Aluguel (R$)</Data></Cell>
    <Cell><Data ss:Type="String">Valor Fiança (R$)</Data></Cell>
    <Cell><Data ss:Type="String">Tipo Imóvel</Data></Cell>
    <Cell><Data ss:Type="String">Endereço Completo</Data></Cell>
    <Cell><Data ss:Type="String">Imobiliária</Data></Cell>
   </Row>
   ${fiancas.map(fianca => `
   <Row>
    <Cell><Data ss:Type="String">${fianca.id}</Data></Cell>
    <Cell><Data ss:Type="String">${new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.data_analise ? new Date(fianca.data_analise).toLocaleDateString('pt-BR') : 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.data_aprovacao ? new Date(fianca.data_aprovacao).toLocaleDateString('pt-BR') : 'N/A'}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.status_fianca}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.inquilino_nome_completo}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.inquilino_cpf}</Data></Cell>
    <Cell><Data ss:Type="Number">${fianca.score_credito || 0}</Data></Cell>
    <Cell><Data ss:Type="Number">${fianca.taxa_aplicada || 0}</Data></Cell>
    <Cell><Data ss:Type="Number">${fianca.imovel_valor_aluguel}</Data></Cell>
    <Cell><Data ss:Type="Number">${fianca.valor_fianca || 0}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.imovel_tipo}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.imovel_endereco}, ${fianca.imovel_numero} - ${fianca.imovel_bairro}, ${fianca.imovel_cidade}/${fianca.imovel_estado}</Data></Cell>
    <Cell><Data ss:Type="String">${fianca.imobiliaria?.nome || 'N/A'}</Data></Cell>
   </Row>
   `).join('')}
  </Table>
 </Worksheet>
</Workbook>`;

      const nomeArquivo = `relatorio-fiancas-aprovadas_${dataInicioStr}_${dataFimStr}.xml`;
      
      // Criar bucket se não existir
      const { error: bucketError } = await supabase.storage
        .from('relatorios')
        .list('', { limit: 1 });

      if (bucketError && bucketError.message.includes('The resource was not found')) {
        // Tentar criar o bucket
        await supabase.storage.createBucket('relatorios', { public: false });
      }

      // Salvar no Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('relatorios')
        .upload(`analista-${user.id}/${nomeArquivo}`, new Blob([xmlContent], { type: 'application/xml' }), {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Download do arquivo
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Relatório de fianças aprovadas gerado com sucesso!');
      buscarRelatoriosDisponiveis();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  const downloadRelatorio = async (nomeArquivo: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('relatorios')
        .download(`analista-${user.id}/${nomeArquivo}`);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download do relatório');
    }
  };

  useEffect(() => {
    if (user?.type === 'analista') {
      buscarAnalises();
      buscarRelatoriosDisponiveis();
    }
  }, [user, dataInicio, dataFim]);

  return {
    fiancas,
    relatoriosDisponiveis,
    loading,
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    buscarAnalises,
    gerarRelatorioXML,
    downloadRelatorio
  };
};

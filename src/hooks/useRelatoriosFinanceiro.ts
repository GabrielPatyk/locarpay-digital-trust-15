import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface RelatorioData {
  fiancas: any[];
  estatisticas: {
    totalRecebido: number;
    totalPendente: number;
    ticketMedio: number;
    inadimplencia: number;
    totalFiancas: number;
  };
  dadosRecebimentos: { mes: string; valor: number }[];
  dadosStatus: { name: string; value: number; color: string }[];
}

export const useRelatoriosFinanceiro = (dataInicio?: Date, dataFim?: Date) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['relatorios-financeiro', user?.id, dataInicio, dataFim],
    queryFn: async (): Promise<RelatorioData> => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Definir período padrão se não especificado
      const inicio = dataInicio || startOfMonth(new Date());
      const fim = dataFim || endOfMonth(new Date());

      // Buscar fianças do financeiro no período
      const { data: fiancas, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          *,
          usuarios!fiancas_locaticias_criado_por_fkey(nome)
        `)
        .eq('financeiro_id', user.id)
        .gte('data_criacao', inicio.toISOString())
        .lte('data_criacao', fim.toISOString())
        .order('data_criacao', { ascending: false });

      if (error) throw error;

      // Calcular estatísticas
      const totalFiancas = fiancas?.length || 0;
      const fiancasPagas = fiancas?.filter(f => 
        ['pagamento_confirmado', 'ativa'].includes(f.status_fianca)
      ) || [];
      const fiancasPendentes = fiancas?.filter(f => 
        ['enviada_ao_financeiro', 'pagamento_disponivel', 'comprovante_enviado'].includes(f.status_fianca)
      ) || [];

      const totalRecebido = fiancasPagas.reduce((acc, f) => acc + (f.valor_fianca || 0), 0);
      const totalPendente = fiancasPendentes.reduce((acc, f) => acc + (f.valor_fianca || 0), 0);
      const ticketMedio = totalFiancas > 0 ? totalRecebido / totalFiancas : 0;
      const inadimplencia = totalFiancas > 0 ? (fiancasPendentes.length / totalFiancas) * 100 : 0;

      // Dados para gráfico de recebimentos (últimos 6 meses)
      const dadosRecebimentos = [];
      for (let i = 5; i >= 0; i--) {
        const mesData = subMonths(new Date(), i);
        const inicioMes = startOfMonth(mesData);
        const fimMes = endOfMonth(mesData);
        
        const fiancasMes = fiancas?.filter(f => {
          const dataFianca = new Date(f.data_criacao);
          return dataFianca >= inicioMes && dataFianca <= fimMes && 
                 ['pagamento_confirmado', 'ativa'].includes(f.status_fianca);
        }) || [];
        
        const valorMes = fiancasMes.reduce((acc, f) => acc + (f.valor_fianca || 0), 0);
        
        dadosRecebimentos.push({
          mes: format(mesData, 'MMM', { locale: ptBR }),
          valor: valorMes
        });
      }

      // Dados para gráfico de status
      const dadosStatus = [
        { 
          name: 'Pagos', 
          value: fiancasPagas.length, 
          color: '#22c55e' 
        },
        { 
          name: 'Pendentes', 
          value: fiancasPendentes.length, 
          color: '#eab308' 
        },
        { 
          name: 'Vencidos', 
          value: Math.max(0, totalFiancas - fiancasPagas.length - fiancasPendentes.length), 
          color: '#ef4444' 
        }
      ];

      return {
        fiancas: fiancas || [],
        estatisticas: {
          totalRecebido,
          totalPendente,
          ticketMedio,
          inadimplencia,
          totalFiancas
        },
        dadosRecebimentos,
        dadosStatus
      };
    },
    enabled: !!user?.id
  });
};

export const gerarRelatorioExcel = async (dados: RelatorioData, tipo: string) => {
  try {
    // Criar dados para o Excel
    const dadosExcel = dados.fiancas.map(fianca => ({
      'ID': fianca.id,
      'Data Criação': format(new Date(fianca.data_criacao), 'dd/MM/yyyy HH:mm'),
      'Inquilino': fianca.inquilino_nome_completo,
      'CPF': fianca.inquilino_cpf,
      'Email': fianca.inquilino_email,
      'Valor Aluguel': fianca.imovel_valor_aluguel,
      'Valor Fiança': fianca.valor_fianca,
      'Status': fianca.status_fianca,
      'Método Pagamento': fianca.metodo_pagamento || 'N/A',
      'Situação Pagamento': fianca.situacao_pagamento || 'N/A',
      'Cidade Imóvel': fianca.imovel_cidade,
      'Estado Imóvel': fianca.imovel_estado
    }));

    // Converter para CSV (formato compatível com Excel)
    const headers = Object.keys(dadosExcel[0] || {});
    const csvContent = [
      headers.join(','),
      ...dadosExcel.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-financeiro-${tipo}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Erro ao gerar relatório Excel:', error);
    throw error;
  }
};

export const gerarRelatorioAutomaticoMensal = async (financeiroId: string) => {
  try {
    const mesPassado = subMonths(new Date(), 1);
    const inicioMes = startOfMonth(mesPassado);
    const fimMes = endOfMonth(mesPassado);

    const { data: fiancas, error } = await supabase
      .from('fiancas_locaticias')
      .select('*')
      .eq('financeiro_id', financeiroId)
      .gte('data_criacao', inicioMes.toISOString())
      .lte('data_criacao', fimMes.toISOString());

    if (error) throw error;

    const dadosRelatorio: RelatorioData = {
      fiancas: fiancas || [],
      estatisticas: {
        totalRecebido: 0,
        totalPendente: 0,
        ticketMedio: 0,
        inadimplencia: 0,
        totalFiancas: fiancas?.length || 0
      },
      dadosRecebimentos: [],
      dadosStatus: []
    };

    await gerarRelatorioExcel(dadosRelatorio, `mensal-${format(mesPassado, 'MM-yyyy')}`);
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar relatório automático:', error);
    throw error;
  }
};

import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRelatoriosAutomaticos = () => {
  
  // Query para listar relatórios automáticos salvos
  const { 
    data: relatoriosAutomaticos = [], 
    isLoading 
  } = useQuery({
    queryKey: ['relatorios-automaticos'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('comprovantes')
        .list('relatorios-automaticos', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;
      return data || [];
    }
  });

  // Mutation para gerar relatório manual
  const gerarRelatorioManual = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('relatorio-mensal-automatico');
      if (error) throw error;
      return data;
    }
  });

  // Função para fazer download de relatório automático
  const downloadRelatorioAutomatico = async (nomeArquivo: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('comprovantes')
        .download(`relatorios-automaticos/${nomeArquivo}`);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      throw error;
    }
  };

  return {
    relatoriosAutomaticos,
    isLoading,
    gerarRelatorioManual,
    downloadRelatorioAutomatico,
    isGenerating: gerarRelatorioManual.isPending
  };
};

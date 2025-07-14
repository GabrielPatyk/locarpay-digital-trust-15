import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ImovelImobiliaria {
  id: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  tipo: string;
  area_metros?: number;
  valor_aluguel: number;
  descricao?: string;
  status: 'disponivel' | 'ocupado' | 'manutencao';
  inquilino_nome?: string;
  data_criacao: string;
  data_atualizacao: string;
}

export interface CreateImovelData {
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: string;
  area_metros?: number;
  valor_aluguel: number;
  descricao?: string;
}

export const useImoveisImobiliariaReal = (searchTerm: string = '', statusFilter: string = '') => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: imoveis = [], isLoading, error, refetch } = useQuery({
    queryKey: ['imoveis-imobiliaria-real', user?.id, searchTerm, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];

      // Definir o ID do usuário atual para o RLS
      await supabase.rpc('set_claim', { 
        claim: 'email', 
        value: user.email 
      }).then(() => {
        console.log('User email set for RLS:', user.email);
      }).catch((error) => {
        console.warn('Could not set email claim, using direct query:', error);
      });

      let query = supabase
        .from('imoveis_imobiliaria')
        .select('*')
        .eq('id_imobiliaria', user.id);

      const { data, error } = await query.order('data_criacao', { ascending: false });

      if (error) {
        console.error('Error fetching imoveis:', error);
        throw error;
      }

      let imoveisList = data || [];

      // Aplicar filtro de busca
      if (searchTerm) {
        imoveisList = imoveisList.filter(imovel =>
          imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.cidade.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de status
      if (statusFilter && statusFilter !== 'todos') {
        imoveisList = imoveisList.filter(imovel => imovel.status === statusFilter);
      }

      return imoveisList;
    },
    enabled: !!user?.id
  });

  const createImovelMutation = useMutation({
    mutationFn: async (data: CreateImovelData) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      console.log('Creating imovel for user:', user.id);
      console.log('Imovel data:', data);

      // Tentar definir o contexto do usuário antes da inserção
      try {
        await supabase.rpc('set_claim', { 
          claim: 'email', 
          value: user.email 
        });
        console.log('User context set for insertion');
      } catch (error) {
        console.warn('Could not set user context:', error);
      }

      const insertData = {
        ...data,
        id_imobiliaria: user.id,
        pais: 'Brasil',
        status: 'disponivel'
      };

      console.log('Final insert data:', insertData);

      const { data: novoImovel, error } = await supabase
        .from('imoveis_imobiliaria')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating imovel:', error);
        throw error;
      }
      
      console.log('Imovel created successfully:', novoImovel);
      return novoImovel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis-imobiliaria-real'] });
      toast({
        title: "Imóvel criado com sucesso!",
        description: "O imóvel foi adicionado à sua lista.",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erro ao criar imóvel",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const updateImovelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ImovelImobiliaria> }) => {
      const { error } = await supabase
        .from('imoveis_imobiliaria')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis-imobiliaria-real'] });
      toast({
        title: "Imóvel atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar imóvel",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const deleteImovelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('imoveis_imobiliaria')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis-imobiliaria-real'] });
      toast({
        title: "Imóvel excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir imóvel",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'disponivel', label: 'Disponível' },
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'manutencao', label: 'Manutenção' }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'disponivel': 'bg-success/10 text-success border-success/20',
      'ocupado': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'manutencao': 'bg-warning/10 text-warning border-warning/20'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'disponivel': 'Disponível',
      'ocupado': 'Ocupado',
      'manutencao': 'Manutenção'
    };
    return labels[status] || status;
  };

  const getTipoOptions = () => [
    { value: 'casa', label: 'Casa' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'galpao', label: 'Galpão' },
    { value: 'outros', label: 'Outros' }
  ];

  // Calcular estatísticas
  const stats = {
    total: imoveis.length,
    disponiveis: imoveis.filter(i => i.status === 'disponivel').length,
    ocupados: imoveis.filter(i => i.status === 'ocupado').length,
    manutencao: imoveis.filter(i => i.status === 'manutencao').length
  };

  return {
    imoveis,
    isLoading,
    error,
    refetch,
    createImovel: createImovelMutation.mutate,
    updateImovel: updateImovelMutation.mutate,
    deleteImovel: deleteImovelMutation.mutate,
    isCreating: createImovelMutation.isPending,
    isUpdating: updateImovelMutation.isPending,
    isDeleting: deleteImovelMutation.isPending,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    getTipoOptions,
    stats
  };
};

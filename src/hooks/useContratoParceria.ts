
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContratoParceria {
  id: string;
  imobiliaria_id: string;
  status_assinatura: 'pendente' | 'assinado';
  link_assinatura?: string;
  documento_assinado_url?: string;
  created_at: string;
  updated_at: string;
}

export const useContratoParceria = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contrato, isLoading, error } = useQuery({
    queryKey: ['contrato-parceria', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as ContratoParceria | null;
    },
    enabled: !!user?.id && user.type === 'imobiliaria',
  });

  const criarContrato = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não encontrado');

      // Criar contrato na base de dados
      const { data: novoContrato, error } = await supabase
        .from('contratos_parceria')
        .insert({
          imobiliaria_id: user.id,
          status_assinatura: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;

      // Buscar dados completos da imobiliária para o webhook
      const { data: imobiliaria, error: imobiliariaError } = await supabase
        .from('usuarios')
        .select(`
          *,
          perfil_usuario(*)
        `)
        .eq('id', user.id)
        .single();

      if (imobiliariaError) throw imobiliariaError;

      // Disparar webhook
      const webhookData = {
        imobiliaria_id: user.id,
        contrato_status: 'pendente',
        evento: 'primeiro_acesso_plataforma',
        imobiliaria: {
          id: imobiliaria.id,
          nome: imobiliaria.nome,
          email: imobiliaria.email,
          telefone: imobiliaria.telefone,
          cnpj: imobiliaria.perfil_usuario?.cnpj || '',
          nome_empresa: imobiliaria.perfil_usuario?.nome_empresa || '',
          endereco: imobiliaria.perfil_usuario?.endereco || '',
          numero: imobiliaria.perfil_usuario?.numero || '',
          complemento: imobiliaria.perfil_usuario?.complemento || '',
          bairro: imobiliaria.perfil_usuario?.bairro || '',
          cidade: imobiliaria.perfil_usuario?.cidade || '',
          estado: imobiliaria.perfil_usuario?.estado || '',
          pais: imobiliaria.perfil_usuario?.pais || 'Brasil',
          cargo: imobiliaria.cargo,
          ativo: imobiliaria.ativo,
          verificado: imobiliaria.verificado,
          criado_em: imobiliaria.criado_em
        }
      };

      try {
        await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });
      } catch (webhookError) {
        console.error('Erro ao disparar webhook:', webhookError);
        // Não falha a operação se o webhook falhar
      }

      return novoContrato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contrato-parceria'] });
    }
  });

  return {
    contrato,
    isLoading,
    error,
    criarContrato: criarContrato.mutate,
    isCreating: criarContrato.isPending
  };
};

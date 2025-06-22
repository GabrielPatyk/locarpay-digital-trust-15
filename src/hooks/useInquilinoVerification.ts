
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InquilinoData {
  nome_completo: string;
  cpf: string;
  email: string;
  whatsapp: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  renda_mensal: number;
}

interface UsuarioExistente {
  id: string;
  email: string;
  nome: string;
  cpf?: string;
}

export const useInquilinoVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioExistente, setUsuarioExistente] = useState<UsuarioExistente | null>(null);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const { toast } = useToast();

  const verificarUsuarioExistente = async (dadosInquilino: InquilinoData) => {
    setIsLoading(true);
    try {
      console.log('Verificando se inquilino já existe...');
      
      const { data: usuarioEncontrado, error } = await supabase
        .from('usuarios')
        .select('id, email, nome, cpf')
        .or(`email.eq.${dadosInquilino.email},cpf.eq.${dadosInquilino.cpf}`)
        .eq('cargo', 'inquilino')
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar usuário existente:', error);
        throw new Error('Erro ao verificar dados do inquilino');
      }

      setUsuarioExistente(usuarioEncontrado);
      setIsVerificationComplete(true);
      
      return usuarioEncontrado;
    } catch (error: any) {
      console.error('Erro na verificação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao verificar dados do inquilino.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const vincularFiancaAContaExistente = async (fiancaId: string, usuarioId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ inquilino_usuario_id: usuarioId })
        .eq('id', fiancaId);

      if (error) throw error;

      toast({
        title: "Fiança vinculada!",
        description: "A fiança foi vinculada à conta existente do inquilino.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao vincular fiança:', error);
      toast({
        title: "Erro",
        description: "Erro ao vincular fiança à conta existente.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const criarContaComDadosFianca = async (dadosInquilino: InquilinoData, fiancaId: string) => {
    setIsLoading(true);
    try {
      console.log('Criando nova conta para inquilino...');
      
      // Gerar senha a partir do CPF (remover pontos e traços)
      const senhaLimpa = dadosInquilino.cpf.replace(/[.-]/g, '');
      
      // Hash da senha
      const { data: hashedPassword, error: hashError } = await supabase.rpc(
        'hash_password',
        { password: senhaLimpa }
      );

      if (hashError) {
        throw new Error('Erro ao processar senha');
      }

      // Criar usuário inquilino
      const { data: novoUsuario, error: createError } = await supabase
        .from('usuarios')
        .insert({
          nome: dadosInquilino.nome_completo,
          email: dadosInquilino.email,
          senha: hashedPassword,
          cargo: 'inquilino',
          telefone: dadosInquilino.whatsapp,
          verificado: false,
          cpf: dadosInquilino.cpf,
        })
        .select()
        .single();

      if (createError) {
        if (createError.code === '23505') {
          throw new Error('E-mail já cadastrado no sistema');
        }
        throw new Error('Erro ao criar conta do inquilino');
      }

      // Vincular fiança ao novo usuário
      const { error: linkError } = await supabase
        .from('fiancas_locaticias')
        .update({ inquilino_usuario_id: novoUsuario.id })
        .eq('id', fiancaId);

      if (linkError) {
        console.error('Erro ao vincular fiança ao novo usuário:', linkError);
      }

      console.log('Nova conta criada e fiança vinculada:', novoUsuario);
      toast({
        title: "Conta criada!",
        description: `Nova conta criada para ${dadosInquilino.nome_completo} e fiança vinculada. Senha: CPF sem pontos.`,
      });

      return { success: true, usuario: novoUsuario };
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta do inquilino.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetVerification = () => {
    setUsuarioExistente(null);
    setIsVerificationComplete(false);
  };

  return {
    verificarUsuarioExistente,
    vincularFiancaAContaExistente,
    criarContaComDadosFianca,
    resetVerification,
    usuarioExistente,
    isVerificationComplete,
    isLoading,
  };
};


import { useState } from 'react';
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

export const useInquilinoCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verificarOuCriarInquilino = async (dadosInquilino: InquilinoData) => {
    setIsLoading(true);
    try {
      console.log('Verificando se inquilino já existe...');
      
      // Verificar se já existe um usuário com email ou CPF
      const { data: usuarioExistente, error: errorVerificacao } = await supabase
        .from('usuarios')
        .select('id, email, nome')
        .or(`email.eq.${dadosInquilino.email},cpf.eq.${dadosInquilino.cpf}`)
        .eq('cargo', 'inquilino')
        .maybeSingle();

      if (errorVerificacao) {
        console.error('Erro ao verificar usuário existente:', errorVerificacao);
        throw new Error('Erro ao verificar dados do inquilino');
      }

      if (usuarioExistente) {
        console.log('Inquilino já existe:', usuarioExistente);
        toast({
          title: "Inquilino encontrado",
          description: `Conta existente encontrada para ${usuarioExistente.nome}`,
        });
        return { success: true, usuario: usuarioExistente, isNew: false };
      }

      // Se não existe, criar novo inquilino
      console.log('Criando novo inquilino...');
      
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
        })
        .select()
        .single();

      if (createError) {
        if (createError.code === '23505') {
          throw new Error('E-mail já cadastrado no sistema');
        }
        throw new Error('Erro ao criar conta do inquilino');
      }

      console.log('Novo inquilino criado:', novoUsuario);
      toast({
        title: "Conta criada!",
        description: `Nova conta criada para ${dadosInquilino.nome_completo}. Senha: CPF sem pontos.`,
      });

      return { success: true, usuario: novoUsuario, isNew: true };
    } catch (error: any) {
      console.error('Erro ao verificar/criar inquilino:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar dados do inquilino.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verificarOuCriarInquilino,
    isLoading,
  };
};

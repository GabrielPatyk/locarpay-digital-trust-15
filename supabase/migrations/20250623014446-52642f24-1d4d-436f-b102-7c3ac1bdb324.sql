
-- Criar tabela para tokens de redefinição de senha
CREATE TABLE public.tokens_redefinicao_senha (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  usado BOOLEAN NOT NULL DEFAULT false
);

-- Criar índice para melhorar performance nas consultas por token
CREATE INDEX idx_tokens_redefinicao_token ON public.tokens_redefinicao_senha(token);

-- Criar índice para melhorar performance nas consultas por usuario_id
CREATE INDEX idx_tokens_redefinicao_usuario_id ON public.tokens_redefinicao_senha(usuario_id);

-- Adicionar RLS para segurança
ALTER TABLE public.tokens_redefinicao_senha ENABLE ROW LEVEL SECURITY;

-- Política para permitir que apenas o sistema gerencie tokens
CREATE POLICY "Apenas sistema pode gerenciar tokens" 
  ON public.tokens_redefinicao_senha 
  FOR ALL 
  USING (false);

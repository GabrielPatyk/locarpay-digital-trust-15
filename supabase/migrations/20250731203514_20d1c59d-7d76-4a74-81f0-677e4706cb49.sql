-- Criar política RLS para permitir acesso anônimo aos tokens válidos de redefinição de senha
CREATE POLICY "Anonymous users can view valid password reset tokens"
ON public.tokens_redefinicao_senha
FOR SELECT
TO anon
USING (
  usado = false 
  AND criado_em >= (now() - interval '30 minutes')
);
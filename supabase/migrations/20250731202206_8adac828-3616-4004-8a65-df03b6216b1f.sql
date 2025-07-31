-- Create RLS policy to allow anonymous access to valid password reset tokens
CREATE POLICY "Anonymous users can view valid password reset tokens"
ON public.tokens_redefinicao_senha
FOR SELECT
TO anon
USING (
  usado = false 
  AND criado_em >= (now() - interval '30 minutes')
);
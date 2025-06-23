
-- Remover a política restritiva atual
DROP POLICY IF EXISTS "Apenas sistema pode gerenciar tokens" ON public.tokens_redefinicao_senha;

-- Criar política que permite inserção de tokens (para redefinição de senha)
CREATE POLICY "Permitir inserção de tokens de redefinição" 
  ON public.tokens_redefinicao_senha 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política que permite leitura de tokens próprios (para validação)
CREATE POLICY "Permitir leitura de tokens válidos" 
  ON public.tokens_redefinicao_senha 
  FOR SELECT 
  USING (true);

-- Criar política que permite atualização de tokens (para marcar como usado)
CREATE POLICY "Permitir atualização de tokens" 
  ON public.tokens_redefinicao_senha 
  FOR UPDATE 
  USING (true);

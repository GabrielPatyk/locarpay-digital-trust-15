-- Remover políticas antigas de notificações
DROP POLICY IF EXISTS "Todos podem ver notificacoes temporariamente" ON public.notificacoes;
DROP POLICY IF EXISTS "Todos podem atualizar notificacoes temporariamente" ON public.notificacoes;
DROP POLICY IF EXISTS "Sistema pode inserir notificações" ON public.notificacoes;

-- Criar novas políticas corretas para notificações
CREATE POLICY "Usuários podem ver suas próprias notificações" 
ON public.notificacoes 
FOR SELECT 
USING (usuario_id IN (
  SELECT id FROM public.usuarios 
  WHERE email = get_current_user_email()
));

CREATE POLICY "Usuários podem atualizar suas próprias notificações" 
ON public.notificacoes 
FOR UPDATE 
USING (usuario_id IN (
  SELECT id FROM public.usuarios 
  WHERE email = get_current_user_email()
));

CREATE POLICY "Sistema pode inserir notificações" 
ON public.notificacoes 
FOR INSERT 
WITH CHECK (true);
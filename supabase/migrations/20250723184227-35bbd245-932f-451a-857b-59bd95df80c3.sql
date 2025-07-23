-- Criar função auxiliar para buscar ID do usuário pelo email
CREATE OR REPLACE FUNCTION public.get_user_id_from_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    usuario_id uuid;
BEGIN
    SELECT id INTO usuario_id
    FROM public.usuarios
    WHERE email = user_email;
    
    RETURN usuario_id;
END;
$$;

-- Atualizar política de notificações para usar função mais robusta
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON public.notificacoes;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias notificações" ON public.notificacoes;

CREATE POLICY "Usuários podem ver suas próprias notificações" 
ON public.notificacoes 
FOR SELECT 
USING (
  usuario_id = get_user_id_from_email(get_current_user_email()) OR
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = usuario_id 
    AND email = get_current_user_email()
  )
);

CREATE POLICY "Usuários podem atualizar suas próprias notificações" 
ON public.notificacoes 
FOR UPDATE 
USING (
  usuario_id = get_user_id_from_email(get_current_user_email()) OR
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = usuario_id 
    AND email = get_current_user_email()
  )
);
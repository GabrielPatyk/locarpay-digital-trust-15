-- Corrigir políticas RLS para permitir que admins vejam e modifiquem todos os perfis
-- Adicionar políticas específicas para admins na tabela perfil_usuario

-- Política para admins verem todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
ON public.perfil_usuario
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = get_current_user_email()
    AND cargo = 'admin'
    AND ativo = true
  )
);

-- Política para admins atualizarem todos os perfis (necessária para aprovar/rejeitar documentos)
CREATE POLICY "Admins podem atualizar todos os perfis"
ON public.perfil_usuario
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = get_current_user_email()
    AND cargo = 'admin'
    AND ativo = true
  )
);
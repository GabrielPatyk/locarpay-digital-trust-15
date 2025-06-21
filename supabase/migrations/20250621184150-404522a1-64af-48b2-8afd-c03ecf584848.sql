
-- Primeiro, vamos remover as políticas existentes que estão causando recursão
DROP POLICY IF EXISTS "Usuarios podem ver seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem ver todos os usuarios" ON public.usuarios;

-- Criar função de segurança para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) 
    AND cargo = 'admin' 
    AND ativo = true
  );
END;
$$;

-- Função para obter o ID do usuário atual baseado no email
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_email TEXT;
  user_id UUID;
BEGIN
  -- Obter o email do usuário autenticado
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Buscar o ID do usuário na tabela usuarios
  SELECT id INTO user_id FROM public.usuarios WHERE email = user_email AND ativo = true;
  
  RETURN user_id;
END;
$$;

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Usuarios podem ver seus próprios dados"
  ON public.usuarios
  FOR SELECT
  USING (id = public.get_current_user_id());

-- Política para admins verem todos os usuários
CREATE POLICY "Admins podem ver todos os usuarios"
  ON public.usuarios
  FOR SELECT
  USING (public.is_admin());

-- Política para admins criarem usuários
CREATE POLICY "Admins podem criar usuarios"
  ON public.usuarios
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Política para admins atualizarem usuários
CREATE POLICY "Admins podem atualizar usuarios"
  ON public.usuarios
  FOR UPDATE
  USING (public.is_admin());

-- Política para admins excluírem usuários
CREATE POLICY "Admins podem excluir usuarios"
  ON public.usuarios
  FOR DELETE
  USING (public.is_admin());

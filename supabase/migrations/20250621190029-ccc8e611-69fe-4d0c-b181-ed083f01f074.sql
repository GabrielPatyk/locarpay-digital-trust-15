
-- Remover todas as políticas existentes para recriar corretamente
DROP POLICY IF EXISTS "Usuarios podem ver seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem ver todos os usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem criar usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem atualizar usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem excluir usuarios" ON public.usuarios;

-- Recriar as funções de segurança com melhor lógica
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_email TEXT;
  is_admin_user BOOLEAN := FALSE;
BEGIN
  -- Obter o email do usuário autenticado
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Verificar se é admin
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = user_email 
    AND cargo = 'admin' 
    AND ativo = true
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$$;

-- Função para obter dados do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS TABLE(user_id UUID, user_email TEXT, user_cargo TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  auth_email TEXT;
BEGIN
  -- Obter o email do usuário autenticado
  SELECT email INTO auth_email FROM auth.users WHERE id = auth.uid();
  
  -- Retornar dados do usuário
  RETURN QUERY
  SELECT id, email, cargo
  FROM public.usuarios 
  WHERE email = auth_email AND ativo = true;
END;
$$;

-- Política para visualização: usuários podem ver seus dados OU admins podem ver tudo
CREATE POLICY "Usuarios podem visualizar dados"
  ON public.usuarios
  FOR SELECT
  USING (
    -- Usuário pode ver seus próprios dados
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR 
    -- OU é um admin (que pode ver tudo)
    public.is_admin()
  );

-- Política para inserção: apenas admins podem criar usuários
CREATE POLICY "Admins podem criar usuarios"
  ON public.usuarios
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Política para atualização: usuários podem atualizar seus dados OU admins podem atualizar qualquer um
CREATE POLICY "Usuarios podem atualizar dados"
  ON public.usuarios
  FOR UPDATE
  USING (
    -- Usuário pode atualizar seus próprios dados
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR 
    -- OU é um admin
    public.is_admin()
  );

-- Política para exclusão: apenas admins podem excluir
CREATE POLICY "Admins podem excluir usuarios"
  ON public.usuarios
  FOR DELETE
  USING (public.is_admin());

-- Adicionar função para hash de senha (será usada no código)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para gerar hash de senha
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$$;

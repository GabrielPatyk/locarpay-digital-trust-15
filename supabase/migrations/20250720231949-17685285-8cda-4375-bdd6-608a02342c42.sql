-- Corrigir função para obter ID do usuário do JWT
-- A função atual não está funcionando corretamente

-- Remover função problemática
DROP FUNCTION IF EXISTS public.get_current_user_id_from_jwt();

-- Criar função melhorada que usa auth.uid() diretamente
CREATE OR REPLACE FUNCTION public.get_current_user_id_from_jwt()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid();
$$;

-- Remover políticas existentes que podem estar causando problemas
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem ver seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem deletar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os imoveis" ON public.imoveis_imobiliaria;

-- Criar função de segurança para verificar se usuário é imobiliária
CREATE OR REPLACE FUNCTION public.is_current_user_imobiliaria()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  );
$$;

-- Criar função de segurança para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin'
    AND ativo = true
  );
$$;

-- Criar políticas RLS usando as funções de segurança
CREATE POLICY "Imobiliarias podem inserir seus imoveis"
ON public.imoveis_imobiliaria
FOR INSERT
TO authenticated
WITH CHECK (
  id_imobiliaria = auth.uid() AND 
  public.is_current_user_imobiliaria()
);

CREATE POLICY "Imobiliarias podem ver seus imoveis"
ON public.imoveis_imobiliaria
FOR SELECT
TO authenticated
USING (
  id_imobiliaria = auth.uid() AND 
  public.is_current_user_imobiliaria()
);

CREATE POLICY "Imobiliarias podem atualizar seus imoveis"
ON public.imoveis_imobiliaria
FOR UPDATE
TO authenticated
USING (
  id_imobiliaria = auth.uid() AND 
  public.is_current_user_imobiliaria()
);

CREATE POLICY "Imobiliarias podem deletar seus imoveis"
ON public.imoveis_imobiliaria
FOR DELETE
TO authenticated
USING (
  id_imobiliaria = auth.uid() AND 
  public.is_current_user_imobiliaria()
);

-- Política para admins
CREATE POLICY "Admins podem gerenciar todos os imoveis"
ON public.imoveis_imobiliaria
FOR ALL
TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());
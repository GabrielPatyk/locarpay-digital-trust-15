
-- Primeiro, vamos dropar as políticas existentes que estão causando problemas
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem ver seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem deletar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os imoveis" ON public.imoveis_imobiliaria;

-- Criar uma função mais robusta para obter o ID do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'email')::text,
    ''
  );
$$;

-- Função para obter o ID do usuário baseado no email do JWT
CREATE OR REPLACE FUNCTION public.get_user_id_by_email()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT id FROM public.usuarios 
  WHERE email = get_current_user_email() 
  AND ativo = true;
$$;

-- Criar políticas mais simples e funcionais
CREATE POLICY "Imobiliarias podem inserir seus imoveis"
ON public.imoveis_imobiliaria
FOR INSERT
TO public
WITH CHECK (
  id_imobiliaria = get_user_id_by_email() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_user_id_by_email() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem ver seus imoveis"
ON public.imoveis_imobiliaria
FOR SELECT
TO public
USING (
  id_imobiliaria = get_user_id_by_email() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_user_id_by_email() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem atualizar seus imoveis"
ON public.imoveis_imobiliaria
FOR UPDATE
TO public
USING (
  id_imobiliaria = get_user_id_by_email() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_user_id_by_email() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem deletar seus imoveis"
ON public.imoveis_imobiliaria
FOR DELETE
TO public
USING (
  id_imobiliaria = get_user_id_by_email() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_user_id_by_email() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

-- Política para admins verem todos os imóveis
CREATE POLICY "Admins podem ver todos os imoveis"
ON public.imoveis_imobiliaria
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_user_id_by_email() 
    AND cargo = 'admin'
    AND ativo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_user_id_by_email() 
    AND cargo = 'admin'
    AND ativo = true
  )
);

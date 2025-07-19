
-- Corrigir problema de autenticação para criação de imóveis
-- O erro 401 indica que a política RLS não está funcionando corretamente

-- Primeiro, vamos verificar se existe uma função para obter o usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_from_jwt()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM public.usuarios 
  WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email');
$$;

-- Remover todas as políticas antigas da tabela imoveis_imobiliaria
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem ver seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem deletar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem ver todos os imoveis" ON public.imoveis_imobiliaria;

-- Criar políticas mais simples e funcionais
CREATE POLICY "Imobiliarias podem gerenciar seus imoveis"
ON public.imoveis_imobiliaria
FOR ALL
USING (
  id_imobiliaria = public.get_current_user_from_jwt()
  OR
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = public.get_current_user_from_jwt() 
    AND cargo = 'admin'
  )
)
WITH CHECK (
  id_imobiliaria = public.get_current_user_from_jwt()
  OR
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = public.get_current_user_from_jwt() 
    AND cargo = 'admin'
  )
);

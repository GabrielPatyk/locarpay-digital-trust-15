
-- Verificar e corrigir as políticas RLS para a tabela imoveis_imobiliaria
-- Vamos garantir que as políticas estejam funcionando corretamente para imobiliárias

-- Primeiro, vamos dropar as políticas existentes e recriar
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem ver seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem deletar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem ver todos os imoveis" ON public.imoveis_imobiliaria;

-- Criar uma função auxiliar para obter o ID do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_id_from_jwt()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT id FROM public.usuarios 
  WHERE email = (current_setting('request.jwt.claims', true)::json->>'email');
$$;

-- Recriar as políticas com melhor controle
CREATE POLICY "Imobiliarias podem inserir seus imoveis" 
ON public.imoveis_imobiliaria 
FOR INSERT 
TO authenticated
WITH CHECK (
  id_imobiliaria = get_current_user_id_from_jwt() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id_from_jwt() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem ver seus imoveis" 
ON public.imoveis_imobiliaria 
FOR SELECT 
TO authenticated
USING (
  id_imobiliaria = get_current_user_id_from_jwt() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id_from_jwt() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem atualizar seus imoveis" 
ON public.imoveis_imobiliaria 
FOR UPDATE 
TO authenticated
USING (
  id_imobiliaria = get_current_user_id_from_jwt() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id_from_jwt() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem deletar seus imoveis" 
ON public.imoveis_imobiliaria 
FOR DELETE 
TO authenticated
USING (
  id_imobiliaria = get_current_user_id_from_jwt() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id_from_jwt() 
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Admins podem ver todos os imoveis" 
ON public.imoveis_imobiliaria 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id_from_jwt() 
    AND cargo = 'admin'
    AND ativo = true
  )
);

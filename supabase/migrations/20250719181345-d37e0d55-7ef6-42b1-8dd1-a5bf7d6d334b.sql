
-- Corrigir as políticas RLS para a tabela imoveis_imobiliaria
-- O erro 401 (Unauthorized) indica que as políticas estão impedindo o INSERT

-- Remover política atual que pode estar causando conflito
DROP POLICY IF EXISTS "Imobiliarias podem gerenciar seus imoveis" ON public.imoveis_imobiliaria;

-- Criar políticas específicas para cada operação
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

-- Política para admins verem todos os imóveis
CREATE POLICY "Admins podem gerenciar todos os imoveis"
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
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id_from_jwt() 
    AND cargo = 'admin'
    AND ativo = true
  )
);

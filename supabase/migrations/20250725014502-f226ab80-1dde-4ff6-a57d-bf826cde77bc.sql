-- Criar função para obter o ID do usuário atual baseado no email do JWT
-- Esta função será usada nas políticas RLS para compatibilidade com o sistema de auth atual
CREATE OR REPLACE FUNCTION public.get_current_user_id_from_jwt()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT id FROM public.usuarios 
  WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email')
  AND ativo = true;
$$;

-- Atualizar políticas RLS para contratos_parceria usando a nova função
DROP POLICY IF EXISTS "Imobiliárias podem ver seus contratos de parceria" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Admins podem ver todos os contratos" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Admins podem atualizar contratos" ON public.contratos_parceria;

CREATE POLICY "Imobiliárias podem ver seus contratos de parceria" ON public.contratos_parceria
  FOR SELECT 
  USING (
    imobiliaria_id = get_current_user_id_from_jwt() AND 
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = get_current_user_id_from_jwt() 
      AND cargo = 'imobiliaria' 
      AND ativo = true
    )
  );

CREATE POLICY "Admins podem ver todos os contratos" ON public.contratos_parceria
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = get_current_user_id_from_jwt() 
      AND cargo = 'admin' 
      AND ativo = true
    )
  );

CREATE POLICY "Admins podem atualizar contratos" ON public.contratos_parceria
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = get_current_user_id_from_jwt() 
      AND cargo = 'admin' 
      AND ativo = true
    )
  );
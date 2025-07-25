-- Corrigir política RLS para contratos_parceria
-- O erro 406 está acontecendo porque a política atual usa get_current_user_email() 
-- mas deveria usar auth.uid() para verificação de identidade

DROP POLICY IF EXISTS "Imobiliárias podem ver seus contratos de parceria" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Admins podem ver todos os contratos" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Admins podem atualizar contratos" ON public.contratos_parceria;

-- Recriar políticas com auth.uid() ao invés de get_current_user_email()
CREATE POLICY "Imobiliárias podem ver seus contratos de parceria" ON public.contratos_parceria
  FOR SELECT 
  USING (
    imobiliaria_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() 
      AND cargo = 'imobiliaria' 
      AND ativo = true
    )
  );

CREATE POLICY "Admins podem ver todos os contratos" ON public.contratos_parceria
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() 
      AND cargo = 'admin' 
      AND ativo = true
    )
  );

CREATE POLICY "Admins podem atualizar contratos" ON public.contratos_parceria
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() 
      AND cargo = 'admin' 
      AND ativo = true
    )
  );

-- Corrigir também política RLS para fiancas_locaticias que pode estar causando problema na visualização
DROP POLICY IF EXISTS "Debug allow all select" ON public.fiancas_locaticias;

-- Garantir que imobiliárias vejam suas fianças corretamente
CREATE POLICY "Imobiliárias podem ver suas fianças" ON public.fiancas_locaticias
  FOR SELECT 
  USING (
    id_imobiliaria = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() 
      AND cargo = 'imobiliaria' 
      AND ativo = true
    )
  );
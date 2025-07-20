-- Corrigir políticas RLS para contratos_parceria para funcionar com sistema de autenticação customizado

-- Remover políticas antigas
DROP POLICY IF EXISTS "Imobiliarias podem ver seus contratos" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Usuarios podem inserir contratos" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Admins podem atualizar contratos" ON public.contratos_parceria;

-- Criar políticas que funcionam com o sistema de autenticação customizado
CREATE POLICY "Imobiliarias podem ver seus contratos"
ON public.contratos_parceria
FOR SELECT
USING (
  imobiliaria_id IN (
    SELECT id FROM public.usuarios 
    WHERE email = get_current_user_email()
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Imobiliarias podem inserir contratos"
ON public.contratos_parceria
FOR INSERT
WITH CHECK (
  imobiliaria_id IN (
    SELECT id FROM public.usuarios 
    WHERE email = get_current_user_email()
    AND cargo = 'imobiliaria'
    AND ativo = true
  )
);

CREATE POLICY "Admins podem atualizar contratos"
ON public.contratos_parceria
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = get_current_user_email()
    AND cargo = 'admin'
    AND ativo = true
  )
);

CREATE POLICY "Admins podem ver todos os contratos"
ON public.contratos_parceria
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = get_current_user_email()
    AND cargo = 'admin'
    AND ativo = true
  )
);
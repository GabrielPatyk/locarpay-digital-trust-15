-- Criar RLS policies para contratos_fianca baseado nos novos campos
DROP POLICY IF EXISTS "Superadmins e assinantes podem ver contratos" ON public.contratos_fianca;
DROP POLICY IF EXISTS "Apenas superadmins podem atualizar contratos" ON public.contratos_fianca;
DROP POLICY IF EXISTS "Apenas superadmins podem deletar contratos" ON public.contratos_fianca;
DROP POLICY IF EXISTS "Apenas superadmins podem inserir contratos" ON public.contratos_fianca;

-- Políticas para inquilinos verem seus próprios contratos
CREATE POLICY "Inquilinos podem ver seus próprios contratos"
ON public.contratos_fianca
FOR SELECT
USING (
  id_inquilino IN (
    SELECT id FROM public.usuarios WHERE email = get_current_user_email()
  )
);

-- Políticas para imobiliárias verem seus contratos
CREATE POLICY "Imobiliárias podem ver seus contratos"
ON public.contratos_fianca
FOR SELECT
USING (
  imobiliaria_id IN (
    SELECT id FROM public.usuarios WHERE email = get_current_user_email()
  )
);

-- Políticas para executivos verem contratos que criaram
CREATE POLICY "Executivos podem ver contratos que criaram"
ON public.contratos_fianca
FOR SELECT
USING (
  id_executivo IN (
    SELECT id FROM public.usuarios WHERE email = get_current_user_email()
  )
);

-- Políticas para analistas verem contratos que analisaram
CREATE POLICY "Analistas podem ver contratos que analisaram"
ON public.contratos_fianca
FOR SELECT
USING (
  id_analista IN (
    SELECT id FROM public.usuarios WHERE email = get_current_user_email()
  )
);

-- Políticas para financeiro verem contratos que processaram
CREATE POLICY "Financeiro pode ver contratos que processaram"
ON public.contratos_fianca
FOR SELECT
USING (
  id_financeiro IN (
    SELECT id FROM public.usuarios WHERE email = get_current_user_email()
  )
);

-- Políticas para admins verem todos os contratos
CREATE POLICY "Admins podem ver todos os contratos"
ON public.contratos_fianca
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = get_current_user_email() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);

-- Política para sistema inserir contratos
CREATE POLICY "Sistema pode inserir contratos"
ON public.contratos_fianca
FOR INSERT
WITH CHECK (true);

-- Política para admins atualizarem contratos
CREATE POLICY "Admins podem atualizar contratos"
ON public.contratos_fianca
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = get_current_user_email() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);
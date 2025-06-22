
-- Remover políticas RLS existentes da tabela fiancas_locaticias
DROP POLICY IF EXISTS "Imobiliarias podem ver suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem inserir suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Admins podem ver todas as fiancas" ON public.fiancas_locaticias;

-- Criar função para obter o ID do usuário atual do sistema customizado
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM public.usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email';
$$;

-- Criar novas políticas RLS usando o sistema de usuários customizado
CREATE POLICY "Imobiliarias podem ver suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR SELECT
  USING (id_imobiliaria = public.get_current_user_id());

CREATE POLICY "Imobiliarias podem inserir suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR INSERT
  WITH CHECK (id_imobiliaria = public.get_current_user_id());

CREATE POLICY "Imobiliarias podem atualizar suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR UPDATE
  USING (id_imobiliaria = public.get_current_user_id());

-- Política para admins verem todas as fianças
CREATE POLICY "Admins podem ver todas as fiancas"
  ON public.fiancas_locaticias
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.usuarios WHERE id = public.get_current_user_id() AND cargo = 'admin'
  ));

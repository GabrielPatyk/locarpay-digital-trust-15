
-- Corrigir as políticas RLS para fiancas_locaticias
-- Remover políticas existentes
DROP POLICY IF EXISTS "Imobiliarias podem ver suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem inserir suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Admins podem ver todas as fiancas" ON public.fiancas_locaticias;

-- Criar políticas RLS corretas usando id do usuário diretamente
CREATE POLICY "Usuarios podem ver suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR SELECT
  USING (
    id_imobiliaria IN (
      SELECT id FROM public.usuarios WHERE id = id_imobiliaria
    )
  );

CREATE POLICY "Usuarios podem inserir suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuarios podem atualizar suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR UPDATE
  USING (
    id_imobiliaria IN (
      SELECT id FROM public.usuarios WHERE id = id_imobiliaria
    )
  );

-- Política específica para admins
CREATE POLICY "Admins podem gerenciar todas as fiancas"
  ON public.fiancas_locaticias
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = id_imobiliaria AND cargo IN ('admin', 'analista', 'juridico')
    )
  );

-- Corrigir as políticas RLS para perfil_usuario também
DROP POLICY IF EXISTS "Users can view their own profile" ON public.perfil_usuario;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.perfil_usuario;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.perfil_usuario;

-- Criar políticas RLS corretas para perfil_usuario
CREATE POLICY "Usuarios podem ver seu proprio perfil"
  ON public.perfil_usuario
  FOR SELECT
  USING (
    usuario_id IN (
      SELECT id FROM public.usuarios WHERE id = usuario_id
    )
  );

CREATE POLICY "Usuarios podem inserir seu proprio perfil"
  ON public.perfil_usuario
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuarios podem atualizar seu proprio perfil"
  ON public.perfil_usuario
  FOR UPDATE
  USING (
    usuario_id IN (
      SELECT id FROM public.usuarios WHERE id = usuario_id
    )
  );

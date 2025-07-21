-- Corrigir políticas RLS da tabela fiancas_locaticias
-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Admins podem gerenciar todas as fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Allow authenticated access to fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem inserir suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem ver suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Usuarios podem atualizar suas proprias fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Usuarios podem inserir suas proprias fiancas" ON public.fiancas_locaticias;

-- Criar nova política simples que permite acesso baseado no sistema de autenticação customizado
-- Permite que usuários autenticados acessem fiancas baseado no email atual
CREATE POLICY "Acesso permitido para usuarios autenticados"
ON public.fiancas_locaticias
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.email = get_current_user_email() 
    AND u.ativo = true
    AND (
      -- Admin, analista, juridico e financeiro podem ver todas
      u.cargo IN ('admin', 'analista', 'juridico', 'financeiro') 
      OR 
      -- Imobiliaria pode ver suas próprias fiancas
      (u.cargo = 'imobiliaria' AND u.id = fiancas_locaticias.id_imobiliaria)
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.email = get_current_user_email() 
    AND u.ativo = true
    AND (
      -- Admin, analista, juridico e financeiro podem inserir/atualizar
      u.cargo IN ('admin', 'analista', 'juridico', 'financeiro') 
      OR 
      -- Imobiliaria pode inserir/atualizar suas próprias fiancas
      (u.cargo = 'imobiliaria' AND u.id = fiancas_locaticias.id_imobiliaria)
    )
  )
);
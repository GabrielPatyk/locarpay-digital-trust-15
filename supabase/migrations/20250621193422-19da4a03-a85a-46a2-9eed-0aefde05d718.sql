
-- Primeiro, vamos remover todas as políticas RLS existentes que dependem do Supabase Auth
DROP POLICY IF EXISTS "Usuarios podem visualizar dados" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios podem ver seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem ver todos os usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem criar usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios podem atualizar dados" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem atualizar usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem excluir usuarios" ON public.usuarios;

-- Remover as funções antigas que dependem do Supabase Auth
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_current_user_id();
DROP FUNCTION IF EXISTS public.get_current_user();

-- Desabilitar RLS temporariamente para permitir acesso total via API
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- Criar uma política simples que permite acesso total para usuários autenticados via API
-- Isso funcionará com nossa autenticação customizada
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política que permite acesso total via API (usando a chave anon do Supabase)
CREATE POLICY "Permitir acesso via API" ON public.usuarios
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Alternativa: Se quisermos manter alguma segurança, podemos criar políticas baseadas no contexto da aplicação
-- Mas por enquanto, vamos usar a política permissiva acima para resolver o problema imediato

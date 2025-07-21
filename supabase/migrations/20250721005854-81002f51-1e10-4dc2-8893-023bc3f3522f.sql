-- Teste e correção da política RLS para fiancas_locaticias

-- Primeiro, vamos verificar se a função get_current_user_email() está funcionando
-- Se não estiver, vamos criar uma política mais direta

-- Remover a política atual
DROP POLICY IF EXISTS "Acesso permitido para usuarios autenticados" ON public.fiancas_locaticias;

-- Criar uma política temporária mais permissiva para diagnóstico
CREATE POLICY "Política temporária permissiva"
ON public.fiancas_locaticias
FOR ALL
USING (true)
WITH CHECK (true);

-- Comentário: Esta política temporária permite todos os acessos para verificar se o problema é com RLS ou com a autenticação
-- Depois que confirmarmos que funciona, vamos refinar as permissões
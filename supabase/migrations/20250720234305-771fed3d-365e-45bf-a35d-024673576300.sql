-- Debug: vamos verificar se há problemas com as políticas
-- Primeiro, vamos temporariamente permitir tudo para debug
DROP POLICY IF EXISTS "Allow inserts for authenticated users" ON public.imoveis_imobiliaria;

-- Criar uma política temporária mais permissiva para debug
CREATE POLICY "Debug: allow all inserts temporarily"
ON public.imoveis_imobiliaria
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Verificar se as funções estão funcionando
SELECT auth.uid() as current_user_id;

-- Verificar se existe o usuário na tabela usuarios
SELECT id, email, cargo, ativo FROM public.usuarios WHERE id = 'e44916ed-1887-4c65-bef7-8bff8541c380';
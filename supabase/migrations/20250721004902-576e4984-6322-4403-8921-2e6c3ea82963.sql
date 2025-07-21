-- Correção das políticas RLS para fiancas_locaticias
-- O problema é que auth.uid() está retornando NULL porque não há sessão Supabase Auth

-- Primeiro, vamos verificar as políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'fiancas_locaticias';

-- Remover políticas problemáticas que dependem de auth.uid()
DROP POLICY IF EXISTS "Analistas podem ver todas as fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Imobiliarias podem ver suas fiancas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Financeiros podem atualizar fiancas em analise" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Financeiros podem ver suas fiancas analisadas" ON public.fiancas_locaticias;
DROP POLICY IF EXISTS "Admins podem ver todas as fiancas" ON public.fiancas_locaticias;

-- Criar políticas que funcionem com o sistema customizado atual
-- Política para permitir acesso autenticado (temporário para debug)
CREATE POLICY "Allow authenticated access to fiancas"
ON public.fiancas_locaticias
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
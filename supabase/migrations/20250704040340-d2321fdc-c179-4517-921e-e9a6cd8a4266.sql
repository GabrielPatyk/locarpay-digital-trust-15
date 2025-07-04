
-- Atualizar as políticas RLS da tabela contratos_locarpay para funcionar com o sistema de auth customizado

-- Remover políticas existentes
DROP POLICY IF EXISTS "Imobiliarias podem ver seus contratos" ON public.contratos_locarpay;
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus contratos" ON public.contratos_locarpay;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus contratos" ON public.contratos_locarpay;
DROP POLICY IF EXISTS "Admins podem ver todos os contratos" ON public.contratos_locarpay;

-- Criar políticas que funcionem com o sistema atual (sem depender de JWT claims)
CREATE POLICY "Permitir acesso total para contratos_locarpay"
ON public.contratos_locarpay
FOR ALL
USING (true)
WITH CHECK (true);

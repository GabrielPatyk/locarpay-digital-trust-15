
-- Corrigir as políticas RLS para a tabela imoveis_imobiliaria
-- O erro 401 (Unauthorized) indica que as políticas estão muito restritivas

-- Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Imobiliarias podem gerenciar seus imoveis" ON imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os imoveis" ON imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem ver todos os imoveis" ON imoveis_imobiliaria;

-- Criar nova política simplificada para imobiliárias
CREATE POLICY "Imobiliarias podem inserir seus imoveis"
ON imoveis_imobiliaria
FOR INSERT
WITH CHECK (
  id_imobiliaria IN (
    SELECT id FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

CREATE POLICY "Imobiliarias podem ver seus imoveis"
ON imoveis_imobiliaria
FOR SELECT
USING (
  id_imobiliaria IN (
    SELECT id FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

CREATE POLICY "Imobiliarias podem atualizar seus imoveis"
ON imoveis_imobiliaria
FOR UPDATE
USING (
  id_imobiliaria IN (
    SELECT id FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

CREATE POLICY "Imobiliarias podem deletar seus imoveis"
ON imoveis_imobiliaria
FOR DELETE
USING (
  id_imobiliaria IN (
    SELECT id FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

-- Política para admins verem todos os imóveis
CREATE POLICY "Admins podem ver todos os imoveis"
ON imoveis_imobiliaria
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'admin'
  )
);

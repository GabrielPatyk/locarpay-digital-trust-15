-- Corrigir políticas RLS para contratos_fianca
-- Primeiro, vamos remover as políticas atuais que podem estar conflitando
DROP POLICY IF EXISTS "Admins podem ver todos os contratos" ON contratos_fianca;
DROP POLICY IF EXISTS "Analistas podem ver contratos que analisaram" ON contratos_fianca;
DROP POLICY IF EXISTS "Executivos podem ver contratos que criaram" ON contratos_fianca;
DROP POLICY IF EXISTS "Financeiro pode ver contratos que processaram" ON contratos_fianca;
DROP POLICY IF EXISTS "Imobiliárias podem ver seus contratos" ON contratos_fianca;
DROP POLICY IF EXISTS "Inquilinos podem ver seus próprios contratos" ON contratos_fianca;

-- Criar políticas RLS mais robustas e claras
CREATE POLICY "Admins podem ver todos os contratos"
ON contratos_fianca
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'admin' 
    AND usuarios.ativo = true
  )
);

CREATE POLICY "Analistas podem ver contratos que analisaram"
ON contratos_fianca
FOR SELECT 
USING (
  id_analista = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'analista' 
    AND usuarios.ativo = true
  )
);

CREATE POLICY "Executivos podem ver contratos que criaram"
ON contratos_fianca
FOR SELECT 
USING (
  id_executivo = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'executivo' 
    AND usuarios.ativo = true
  )
);

CREATE POLICY "Financeiro pode ver contratos que processaram"
ON contratos_fianca
FOR SELECT 
USING (
  id_financeiro = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'financeiro' 
    AND usuarios.ativo = true
  )
);

CREATE POLICY "Imobiliárias podem ver seus contratos"
ON contratos_fianca
FOR SELECT 
USING (
  imobiliaria_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'imobiliaria' 
    AND usuarios.ativo = true
  )
);

CREATE POLICY "Inquilinos podem ver seus próprios contratos"
ON contratos_fianca
FOR SELECT 
USING (
  id_inquilino = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.cargo = 'inquilino' 
    AND usuarios.ativo = true
  )
);

-- Política adicional: usuários podem ver contratos onde são mencionados por email
CREATE POLICY "Usuários podem ver contratos pelo email"
ON contratos_fianca
FOR SELECT 
USING (
  inquilino_email IN (
    SELECT email FROM usuarios 
    WHERE usuarios.id = auth.uid() 
    AND usuarios.ativo = true
  )
);
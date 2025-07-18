
-- Corrigir as políticas RLS para a tabela imoveis_imobiliaria
-- O erro 401 (Unauthorized) indica que as políticas estão muito restritivas

-- Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem ver seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem deletar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Admins podem ver todos os imoveis" ON public.imoveis_imobiliaria;

-- Criar nova política simplificada para imobiliárias
CREATE POLICY "Imobiliarias podem inserir seus imoveis"
ON public.imoveis_imobiliaria
FOR INSERT
WITH CHECK (
  id_imobiliaria IN (
    SELECT id FROM public.usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

CREATE POLICY "Imobiliarias podem ver seus imoveis"
ON public.imoveis_imobiliaria
FOR SELECT
USING (
  id_imobiliaria IN (
    SELECT id FROM public.usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

CREATE POLICY "Imobiliarias podem atualizar seus imoveis"
ON public.imoveis_imobiliaria
FOR UPDATE
USING (
  id_imobiliaria IN (
    SELECT id FROM public.usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

CREATE POLICY "Imobiliarias podem deletar seus imoveis"
ON public.imoveis_imobiliaria
FOR DELETE
USING (
  id_imobiliaria IN (
    SELECT id FROM public.usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'imobiliaria'
  )
);

-- Política para admins verem todos os imóveis
CREATE POLICY "Admins podem ver todos os imoveis"
ON public.imoveis_imobiliaria
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'admin'
  )
);

-- Adicionar campo data_aprovacao na tabela fiancas_locaticias se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fiancas_locaticias' AND column_name = 'data_aprovacao') THEN
    ALTER TABLE public.fiancas_locaticias ADD COLUMN data_aprovacao timestamp with time zone;
  END IF;
END $$;

-- Criar trigger para atualizar data_aprovacao quando status mudar para 'aprovada'
CREATE OR REPLACE FUNCTION public.atualizar_data_aprovacao()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se o status mudou para 'aprovada', definir data_aprovacao
  IF NEW.status_fianca = 'aprovada' AND (OLD.status_fianca IS NULL OR OLD.status_fianca != 'aprovada') THEN
    NEW.data_aprovacao = now();
  END IF;
  
  -- Se o status mudou de 'aprovada' para outro, limpar data_aprovacao
  IF OLD.status_fianca = 'aprovada' AND NEW.status_fianca != 'aprovada' THEN
    NEW.data_aprovacao = NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_atualizar_data_aprovacao ON public.fiancas_locaticias;
CREATE TRIGGER trigger_atualizar_data_aprovacao
  BEFORE UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_data_aprovacao();

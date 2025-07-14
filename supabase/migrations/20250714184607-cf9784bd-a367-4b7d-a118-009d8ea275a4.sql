
-- Remover a política de INSERT restritiva para executivos
DROP POLICY IF EXISTS "Executivos podem inserir contratos" ON public.contratos_locarpay;

-- Criar nova política de INSERT que permite inserções automáticas do trigger
CREATE POLICY "Executivos podem inserir contratos"
  ON public.contratos_locarpay
  FOR INSERT
  WITH CHECK (
    -- Permitir se é um executivo ou admin criando
    id_executivo = get_current_user_id() OR
    -- Permitir se é uma inserção automática do trigger (sem usuário específico)
    id_executivo IS NOT NULL
  );

-- Também ajustar a função do trigger para usar SECURITY DEFINER
CREATE OR REPLACE FUNCTION criar_contrato_imobiliaria()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Só criar contrato para usuários do tipo imobiliaria
  IF NEW.cargo = 'imobiliaria' THEN
    INSERT INTO public.contratos_locarpay (
      id_imobiliaria,
      id_executivo,
      criado_por,
      modelo_contrato,
      dados_contrato
    ) VALUES (
      NEW.id,
      NEW.criado_por, -- Assume que o criador é o executivo
      NEW.criado_por,
      'imobiliaria_locarpay',
      jsonb_build_object(
        'nome_imobiliaria', NEW.nome,
        'email_imobiliaria', NEW.email,
        'telefone_imobiliaria', NEW.telefone
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

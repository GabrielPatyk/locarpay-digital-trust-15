
-- Criar função para gerar contrato automaticamente após pagamento confirmado
CREATE OR REPLACE FUNCTION public.criar_contrato_apos_pagamento()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o status mudou para 'pagamento_confirmado'
  IF NEW.status_fianca = 'pagamento_confirmado' AND 
     (OLD.status_fianca IS NULL OR OLD.status_fianca != 'pagamento_confirmado') THEN
    
    -- Verificar se já existe um contrato para esta fiança
    IF NOT EXISTS (
      SELECT 1 FROM public.contratos_fianca 
      WHERE fianca_id = NEW.id
    ) THEN
      -- Criar novo contrato
      INSERT INTO public.contratos_fianca (
        fianca_id,
        status_contrato,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        'gerando_link',
        now(),
        now()
      );
      
      -- Log da criação do contrato
      INSERT INTO public.historico_fiancas (
        fianca_id,
        acao,
        usuario_nome,
        usuario_id,
        detalhes
      ) VALUES (
        NEW.id,
        'Contrato criado automaticamente',
        'Sistema',
        NULL,
        'Contrato gerado após confirmação de pagamento'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para executar a função após update na tabela fiancas_locaticias
CREATE TRIGGER trigger_criar_contrato_apos_pagamento
  AFTER UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_contrato_apos_pagamento();

-- Criar tipo ENUM para status_contrato igual ao status_fianca
CREATE TYPE public.status_contrato AS ENUM (
  'gerando_link',
  'assinatura_locarpay', 
  'assinatura_inquilino',
  'assinatura_imobiliaria',
  'assinado'
);

-- Alterar tabela contratos_fianca para usar o novo tipo e adicionar colunas do inquilino
ALTER TABLE public.contratos_fianca 
ADD COLUMN IF NOT EXISTS inquilino_nome text,
ADD COLUMN IF NOT EXISTS inquilino_email text,
ADD COLUMN IF NOT EXISTS inquilino_cpf text,
ADD COLUMN IF NOT EXISTS inquilino_whatsapp text,
ADD COLUMN IF NOT EXISTS valor_fianca numeric,
ADD COLUMN IF NOT EXISTS valor_aluguel numeric;

-- Alterar coluna status_contrato para usar o novo tipo
ALTER TABLE public.contratos_fianca 
ALTER COLUMN status_contrato TYPE public.status_contrato 
USING status_contrato::public.status_contrato;

-- Recriar função para incluir informações do inquilino
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
      -- Criar novo contrato com informações completas
      INSERT INTO public.contratos_fianca (
        fianca_id,
        status_contrato,
        inquilino_nome,
        inquilino_email, 
        inquilino_cpf,
        inquilino_whatsapp,
        valor_fianca,
        valor_aluguel,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        'gerando_link'::public.status_contrato,
        NEW.inquilino_nome_completo,
        NEW.inquilino_email,
        NEW.inquilino_cpf,
        NEW.inquilino_whatsapp,
        NEW.valor_fianca,
        NEW.imovel_valor_aluguel,
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
        'Contrato gerado após confirmação de pagamento com dados do inquilino'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;
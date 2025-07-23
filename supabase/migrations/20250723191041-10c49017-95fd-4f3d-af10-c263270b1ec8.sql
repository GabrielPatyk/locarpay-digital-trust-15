-- Adicionar novas colunas à tabela contratos_fianca
ALTER TABLE public.contratos_fianca 
ADD COLUMN IF NOT EXISTS id_inquilino UUID,
ADD COLUMN IF NOT EXISTS id_executivo UUID,
ADD COLUMN IF NOT EXISTS id_analista UUID,
ADD COLUMN IF NOT EXISTS id_financeiro UUID;

-- Adicionar campos de motivo de rejeição na tabela perfil_usuario
ALTER TABLE public.perfil_usuario
ADD COLUMN IF NOT EXISTS motivo_rejeicao_cartao_cnpj TEXT,
ADD COLUMN IF NOT EXISTS motivo_rejeicao_comprovante_endereco TEXT,
ADD COLUMN IF NOT EXISTS motivo_rejeicao_cartao_creci TEXT;

-- Atualizar a função criar_contrato_apos_pagamento para incluir os novos campos
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
        imobiliaria_id,
        id_inquilino,
        id_executivo,
        id_analista,
        id_financeiro,
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
        NEW.id_imobiliaria,
        NEW.inquilino_usuario_id,
        NEW.criado_por, -- Assumindo que criado_por é o executivo
        NEW.id_analista,
        NEW.financeiro_id,
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
        'Contrato gerado após confirmação de pagamento com dados completos'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;
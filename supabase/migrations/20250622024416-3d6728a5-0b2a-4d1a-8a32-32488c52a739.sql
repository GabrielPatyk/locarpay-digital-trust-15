
-- Adicionar novos status para o enum
ALTER TYPE status_fianca ADD VALUE IF NOT EXISTS 'enviada_ao_financeiro';
ALTER TYPE status_fianca ADD VALUE IF NOT EXISTS 'aguardando_geracao_pagamento';

-- Adicionar colunas para rastrear melhor quem fez as ações
ALTER TABLE public.historico_fiancas 
ADD COLUMN IF NOT EXISTS analisado_por UUID REFERENCES public.usuarios(id);

-- Adicionar coluna para observações da aprovação
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN IF NOT EXISTS observacoes_aprovacao TEXT;

-- Atualizar a função de histórico para capturar o usuário correto
CREATE OR REPLACE FUNCTION public.inserir_historico_atualizacao_fianca()
RETURNS TRIGGER AS $$
DECLARE
  usuario_nome_var TEXT DEFAULT 'Sistema';
  usuario_id_var UUID;
BEGIN
  -- Se o status mudou
  IF OLD.status_fianca != NEW.status_fianca THEN
    -- Para ações do analista, usar o ID do analista (assumindo que será passado via contexto)
    -- Por enquanto, vamos usar o criado_por como fallback
    usuario_id_var := NEW.criado_por;
    
    -- Buscar nome do usuário
    IF usuario_id_var IS NOT NULL THEN
      SELECT nome INTO usuario_nome_var 
      FROM public.usuarios 
      WHERE id = usuario_id_var;
    END IF;
    
    INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, usuario_id, analisado_por, detalhes)
    VALUES (NEW.id, 
            CASE 
              WHEN NEW.status_fianca = 'aprovada' THEN 'Fiança aprovada'
              WHEN NEW.status_fianca = 'rejeitada' THEN 'Fiança rejeitada'
              WHEN NEW.status_fianca = 'em_analise' THEN 'Enviado para análise'
              WHEN NEW.status_fianca = 'enviada_ao_financeiro' THEN 'Enviada ao financeiro'
              WHEN NEW.status_fianca = 'aguardando_geracao_pagamento' THEN 'Aguardando geração de pagamento'
              ELSE 'Status alterado para ' || NEW.status_fianca
            END,
            COALESCE(usuario_nome_var, 'Sistema'),
            usuario_id_var,
            usuario_id_var,
            CASE 
              WHEN NEW.status_fianca = 'rejeitada' AND NEW.motivo_reprovacao IS NOT NULL 
              THEN NEW.motivo_reprovacao
              WHEN NEW.status_fianca = 'aprovada' AND NEW.observacoes_aprovacao IS NOT NULL
              THEN NEW.observacoes_aprovacao
              ELSE NULL
            END
           );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

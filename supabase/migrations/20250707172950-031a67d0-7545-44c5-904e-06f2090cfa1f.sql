
-- Adicionar coluna id_analista na tabela fiancas_locaticias
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN id_analista UUID REFERENCES public.usuarios(id);

-- Criar índice para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_fiancas_locaticias_id_analista 
ON public.fiancas_locaticias(id_analista);

-- Atualizar a função de trigger para incluir o id_analista quando houver aprovação/reprovação
CREATE OR REPLACE FUNCTION public.inserir_historico_atualizacao_fianca()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
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
    
    -- Se foi aprovada ou rejeitada, definir o id_analista
    IF NEW.status_fianca IN ('aprovada', 'rejeitada') AND NEW.id_analista IS NOT NULL THEN
      -- O id_analista já foi definido na aplicação
      NULL;
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
            COALESCE(NEW.id_analista, usuario_id_var),
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
$function$;

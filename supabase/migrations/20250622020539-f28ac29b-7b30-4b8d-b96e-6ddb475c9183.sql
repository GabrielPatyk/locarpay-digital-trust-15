
-- Adicionar coluna para rastrear quem criou a fiança
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN criado_por UUID REFERENCES public.usuarios(id);

-- Atualizar a função de histórico para capturar o usuário que criou
CREATE OR REPLACE FUNCTION public.inserir_historico_criacao_fianca()
RETURNS TRIGGER AS $$
DECLARE
  usuario_nome_var TEXT;
BEGIN
  -- Buscar o nome do usuário que criou a fiança
  IF NEW.criado_por IS NOT NULL THEN
    SELECT nome INTO usuario_nome_var 
    FROM public.usuarios 
    WHERE id = NEW.criado_por;
  END IF;
  
  INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, usuario_id, detalhes)
  VALUES (NEW.id, 'Fiança criada', 
          COALESCE(usuario_nome_var, 'Sistema'), 
          NEW.criado_por, 
          'Nova solicitação de fiança');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Atualizar a função de histórico de atualizações para incluir melhor rastreamento
CREATE OR REPLACE FUNCTION public.inserir_historico_atualizacao_fianca()
RETURNS TRIGGER AS $$
DECLARE
  usuario_nome_var TEXT DEFAULT 'Analista';
BEGIN
  -- Se o status mudou
  IF OLD.status_fianca != NEW.status_fianca THEN
    -- Tentar buscar nome do usuário se tiver ID
    IF NEW.criado_por IS NOT NULL THEN
      SELECT nome INTO usuario_nome_var 
      FROM public.usuarios 
      WHERE id = NEW.criado_por;
    END IF;
    
    INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, usuario_id, detalhes)
    VALUES (NEW.id, 
            CASE 
              WHEN NEW.status_fianca = 'aprovada' THEN 'Fiança aprovada'
              WHEN NEW.status_fianca = 'rejeitada' THEN 'Fiança rejeitada'
              WHEN NEW.status_fianca = 'em_analise' THEN 'Enviado para análise'
              ELSE 'Status alterado para ' || NEW.status_fianca
            END,
            COALESCE(usuario_nome_var, 'Analista'),
            NEW.criado_por,
            CASE 
              WHEN NEW.status_fianca = 'rejeitada' AND NEW.motivo_reprovacao IS NOT NULL 
              THEN NEW.motivo_reprovacao
              ELSE NULL
            END
           );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

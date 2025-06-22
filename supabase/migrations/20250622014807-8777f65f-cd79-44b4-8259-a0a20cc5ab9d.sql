
-- Criar tabela para histórico de atividades das fianças
CREATE TABLE public.historico_fiancas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fianca_id UUID NOT NULL REFERENCES public.fiancas_locaticias(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  usuario_nome TEXT NOT NULL,
  usuario_id UUID,
  detalhes TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índice para melhor performance
CREATE INDEX idx_historico_fiancas_fianca_id ON public.historico_fiancas(fianca_id);
CREATE INDEX idx_historico_fiancas_data ON public.historico_fiancas(data_criacao DESC);

-- Habilitar RLS
ALTER TABLE public.historico_fiancas ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos os usuários autenticados
CREATE POLICY "Users can view historico" 
  ON public.historico_fiancas 
  FOR SELECT 
  USING (true);

-- Política para permitir inserção para todos os usuários autenticados
CREATE POLICY "Users can insert historico" 
  ON public.historico_fiancas 
  FOR INSERT 
  WITH CHECK (true);

-- Função para inserir automaticamente no histórico quando uma fiança é criada
CREATE OR REPLACE FUNCTION public.inserir_historico_criacao_fianca()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, detalhes)
  VALUES (NEW.id, 'Fiança criada', 'Sistema', 'Nova solicitação de fiança');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar histórico quando fiança é criada
CREATE TRIGGER trigger_historico_criacao_fianca
  AFTER INSERT ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.inserir_historico_criacao_fianca();

-- Função para inserir automaticamente no histórico quando uma fiança é atualizada
CREATE OR REPLACE FUNCTION public.inserir_historico_atualizacao_fianca()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou
  IF OLD.status_fianca != NEW.status_fianca THEN
    INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, detalhes)
    VALUES (NEW.id, 
            CASE 
              WHEN NEW.status_fianca = 'aprovada' THEN 'Fiança aprovada'
              WHEN NEW.status_fianca = 'rejeitada' THEN 'Fiança rejeitada'
              WHEN NEW.status_fianca = 'em_analise' THEN 'Enviado para análise'
              ELSE 'Status alterado para ' || NEW.status_fianca
            END,
            'Analista',
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

-- Trigger para criar histórico quando fiança é atualizada
CREATE TRIGGER trigger_historico_atualizacao_fianca
  AFTER UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.inserir_historico_atualizacao_fianca();

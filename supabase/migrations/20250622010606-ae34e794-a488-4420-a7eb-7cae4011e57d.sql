
-- Adicionar campos necessários na tabela fiancas_locaticias
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN IF NOT EXISTS score_credito INTEGER,
ADD COLUMN IF NOT EXISTS taxa_aplicada DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS data_analise TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS motivo_reprovacao TEXT;

-- Criar índice para consultas de análise
CREATE INDEX IF NOT EXISTS idx_fiancas_status_analise ON public.fiancas_locaticias(status_fianca) 
WHERE status_fianca = 'em_analise';

-- Criar view para dados consolidados do analista
CREATE OR REPLACE VIEW public.fiancas_para_analise AS
SELECT 
    f.*,
    pu.nome_empresa as imobiliaria_nome,
    u.nome as imobiliaria_responsavel
FROM public.fiancas_locaticias f
LEFT JOIN public.usuarios u ON f.id_imobiliaria = u.id
LEFT JOIN public.perfil_usuario pu ON f.id_imobiliaria = pu.usuario_id;

-- Habilitar RLS na tabela fiancas_locaticias se ainda não estiver habilitado
ALTER TABLE public.fiancas_locaticias ENABLE ROW LEVEL SECURITY;

-- Remover política existente se ela existir
DROP POLICY IF EXISTS "Analistas podem ver todas as fiancas" ON public.fiancas_locaticias;

-- Criar política para analistas verem todas as fianças
CREATE POLICY "Analistas podem ver todas as fiancas"
  ON public.fiancas_locaticias
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.usuarios WHERE id = auth.uid()::uuid AND cargo = 'analista'
  ));

-- Política para imobiliárias verem apenas suas próprias fianças
DROP POLICY IF EXISTS "Imobiliarias podem ver suas fiancas" ON public.fiancas_locaticias;
CREATE POLICY "Imobiliarias podem ver suas fiancas"
  ON public.fiancas_locaticias
  FOR ALL
  TO authenticated
  USING (id_imobiliaria = auth.uid()::uuid);

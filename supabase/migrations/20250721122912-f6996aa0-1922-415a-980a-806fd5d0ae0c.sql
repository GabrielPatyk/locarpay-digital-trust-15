-- Adicionar campo motivo_manutencao na tabela configuracoes_sistema
ALTER TABLE public.configuracoes_sistema 
ADD COLUMN IF NOT EXISTS motivo_manutencao TEXT DEFAULT 'Sistema em manutenção programada';

-- Atualizar registro existente
UPDATE public.configuracoes_sistema 
SET motivo_manutencao = 'Sistema em manutenção programada' 
WHERE motivo_manutencao IS NULL;
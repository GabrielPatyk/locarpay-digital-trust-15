
-- Adicionar campos para valor total e valor da fiança na tabela fiancas_locaticias
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN valor_total_locacao numeric,
ADD COLUMN valor_fianca numeric;

-- Comentários para documentar os novos campos
COMMENT ON COLUMN public.fiancas_locaticias.valor_total_locacao IS 'Valor total da locação (valor do aluguel x tempo de locação em meses)';
COMMENT ON COLUMN public.fiancas_locaticias.valor_fianca IS 'Valor da fiança calculado com base na taxa aplicada sobre o valor total';

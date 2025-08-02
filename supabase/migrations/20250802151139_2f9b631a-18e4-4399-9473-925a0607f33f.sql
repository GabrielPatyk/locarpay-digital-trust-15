-- Adicionar campos de CEP para inquilino e imóvel nas fianças
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN inquilino_cep TEXT,
ADD COLUMN imovel_cep TEXT;
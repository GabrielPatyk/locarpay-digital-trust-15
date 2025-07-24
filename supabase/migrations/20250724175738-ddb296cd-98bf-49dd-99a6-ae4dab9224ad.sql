-- Alterar a coluna documentos de jsonb para text na tabela contratos_fianca
ALTER TABLE public.contratos_fianca 
ALTER COLUMN documentos TYPE text;
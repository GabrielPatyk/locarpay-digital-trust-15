-- Adicionar campo imobiliaria_id na tabela contratos_fianca para corrigir listagem
ALTER TABLE public.contratos_fianca 
ADD COLUMN IF NOT EXISTS imobiliaria_id UUID REFERENCES public.usuarios(id);

-- Atualizar registros existentes baseado na fianca_id
UPDATE public.contratos_fianca 
SET imobiliaria_id = (
  SELECT fl.id_imobiliaria 
  FROM public.fiancas_locaticias fl 
  WHERE fl.id = contratos_fianca.fianca_id
)
WHERE imobiliaria_id IS NULL;
-- Adicionar coluna financeiro_id à tabela fiancas_locaticias
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN financeiro_id uuid REFERENCES public.usuarios(id);

-- Comentário: Esta coluna será usada para rastrear qual usuário do financeiro está lidando com cada fiança
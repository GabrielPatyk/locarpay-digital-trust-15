-- Adicionar coluna primeiro_acesso na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN primeiro_acesso BOOLEAN DEFAULT FALSE;

-- Comentário: Esta coluna indica se o usuário ainda não fez o primeiro login e mudança de senha obrigatória

-- Atualizar a tabela perfil_usuario para incluir os novos campos de endereço
ALTER TABLE public.perfil_usuario 
DROP COLUMN IF EXISTS endereco_completo;

ALTER TABLE public.perfil_usuario 
ADD COLUMN IF NOT EXISTS endereco TEXT,
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS complemento TEXT,
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT,
ADD COLUMN IF NOT EXISTS pais TEXT DEFAULT 'Brasil';

-- Função para atualizar imagem de perfil do usuário
CREATE OR REPLACE FUNCTION public.atualizar_imagem_perfil(p_usuario_id uuid, p_imagem_url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.usuarios 
  SET imagem_perfil = p_imagem_url
  WHERE id = p_usuario_id;
  
  RETURN FOUND;
END;
$$;

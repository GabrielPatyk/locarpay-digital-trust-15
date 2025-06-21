
-- Atualizar a tabela perfil_usuario para incluir campos de endereço separados
ALTER TABLE public.perfil_usuario 
DROP COLUMN IF EXISTS endereco_completo;

ALTER TABLE public.perfil_usuario 
ADD COLUMN endereco TEXT,
ADD COLUMN numero TEXT,
ADD COLUMN complemento TEXT,
ADD COLUMN bairro TEXT,
ADD COLUMN cidade TEXT,
ADD COLUMN estado TEXT,
ADD COLUMN pais TEXT DEFAULT 'Brasil';

-- Função para atualizar imagem de perfil do usuário
CREATE OR REPLACE FUNCTION atualizar_imagem_perfil(p_usuario_id UUID, p_imagem_url TEXT)
RETURNS BOOLEAN
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

-- Habilitar a extensão pgcrypto se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recriar a função verify_password com a extensão habilitada
CREATE OR REPLACE FUNCTION public.verify_password(email_input text, password_input text)
RETURNS TABLE(id uuid, email text, nome text, verificado boolean, ativo boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, extensions'
AS $$
BEGIN
  -- Verificar se a extensão pgcrypto está disponível
  RETURN QUERY
  SELECT u.id, u.email, u.nome, u.verificado, u.ativo
  FROM public.usuarios u
  WHERE u.email = email_input
    AND u.ativo = true
    AND crypt(password_input, u.senha) = u.senha;
END;
$$;
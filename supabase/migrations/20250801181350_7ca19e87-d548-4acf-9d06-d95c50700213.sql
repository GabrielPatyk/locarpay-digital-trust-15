-- Atualizar função para usar crypt com schema completo
CREATE OR REPLACE FUNCTION public.verify_password(email_input text, password_input text)
RETURNS TABLE(id uuid, email text, nome text, verificado boolean, ativo boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, pgcrypto'
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.nome, u.verificado, u.ativo
  FROM public.usuarios u
  WHERE u.email = email_input
    AND u.ativo = true
    AND public.crypt(password_input, u.senha) = u.senha;
END;
$$;
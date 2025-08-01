-- Corrigir a função verify_password para usar pgcrypto corretamente
CREATE OR REPLACE FUNCTION public.verify_password(email_input text, password_input text)
RETURNS TABLE(id uuid, email text, nome text, verificado boolean, ativo boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.nome, u.verificado, u.ativo
  FROM public.usuarios u
  WHERE u.email = email_input
    AND u.ativo = true
    AND extensions.crypt(password_input, u.senha) = u.senha;
END;
$$;
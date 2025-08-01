-- Criar função para validar login com bcrypt
CREATE OR REPLACE FUNCTION public.verify_password(email_input text, password_input text)
RETURNS TABLE(id uuid, email text, nome text, verificado boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.nome, u.verificado
  FROM public.usuarios u
  WHERE u.email = email_input
    AND u.ativo = true
    AND crypt(password_input, u.senha) = u.senha;
END;
$$;
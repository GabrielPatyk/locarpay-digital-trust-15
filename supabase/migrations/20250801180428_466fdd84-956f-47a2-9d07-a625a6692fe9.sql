-- Primeiro, dropar a função existente com assinatura incorreta
DROP FUNCTION IF EXISTS public.verify_password(text, text);

-- Criar nova função para validar login com bcrypt usando a função crypt
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
    AND crypt(password_input, u.senha) = u.senha;
END;
$$;
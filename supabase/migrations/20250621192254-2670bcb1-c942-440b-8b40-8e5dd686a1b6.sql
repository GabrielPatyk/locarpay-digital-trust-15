
-- Atualizar a função validar_login para usar verificação de senha com hash
CREATE OR REPLACE FUNCTION public.validar_login(email_input text, senha_input text)
RETURNS TABLE(id uuid, email text, nome text, telefone text, cargo text, ativo boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.nome,
    u.telefone,
    u.cargo,
    u.ativo
  FROM public.usuarios u
  WHERE u.email = email_input 
    AND public.verify_password(senha_input, u.senha) = true
    AND u.ativo = true;
END;
$$;

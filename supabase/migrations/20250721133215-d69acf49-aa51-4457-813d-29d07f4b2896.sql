-- Garantir que a função hash_password existe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recriar função para hash de senha se não existir
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$;
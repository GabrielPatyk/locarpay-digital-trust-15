-- Garantir que a extensão pgcrypto está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Testar se a função gen_salt funciona
DO $$
BEGIN
  PERFORM gen_salt('bf'::text, 12::integer);
  RAISE NOTICE 'pgcrypto extension is working correctly';
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'pgcrypto extension is not working: %', SQLERRM;
END $$;

-- Recriar a função hash_password simplificada
DROP FUNCTION IF EXISTS public.hash_password(text);

CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Usar crypt diretamente com salt fixo para teste
  RETURN crypt(password, '$2a$12$' || substring(md5(random()::text), 1, 22));
END;
$function$;
-- Recriar a função hash_password com tipos explícitos
DROP FUNCTION IF EXISTS public.hash_password(text);

CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Usar tipos explícitos para gen_salt
  RETURN crypt(password, gen_salt('bf'::text, 12::integer));
END;
$function$;
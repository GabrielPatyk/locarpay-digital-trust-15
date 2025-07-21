-- Recriar a função gerar_token_verificacao
CREATE OR REPLACE FUNCTION public.gerar_token_verificacao(usuario_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  novo_token text;
BEGIN
  novo_token := encode(gen_random_bytes(16), 'hex');
  
  UPDATE public.usuarios 
  SET token_verificacao = novo_token::uuid,
      token_expira_em = now() + interval '30 minutes'
  WHERE id = usuario_id;
  
  RETURN novo_token;
END;
$$;
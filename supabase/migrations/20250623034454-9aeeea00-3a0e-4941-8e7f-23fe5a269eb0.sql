
-- Criar função para gerar token de verificação
CREATE OR REPLACE FUNCTION public.gerar_token_verificacao(usuario_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  novo_token uuid;
BEGIN
  novo_token := gen_random_uuid();
  
  UPDATE public.usuarios 
  SET token_verificacao = novo_token,
      token_expira_em = now() + interval '30 minutes'
  WHERE id = usuario_id;
  
  RETURN novo_token;
END;
$$;

-- Criar função para verificar e-mail
CREATE OR REPLACE FUNCTION public.verificar_email(token_input uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usuario_record record;
BEGIN
  -- Buscar usuário pelo token
  SELECT id, email, nome, token_expira_em
  INTO usuario_record
  FROM public.usuarios
  WHERE token_verificacao = token_input
    AND verificado = false
    AND token_expira_em > now();
  
  -- Se não encontrou usuário ou token expirado
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Token inválido ou expirado'
    );
  END IF;
  
  -- Atualizar usuário como verificado
  UPDATE public.usuarios 
  SET verificado = true,
      token_verificacao = NULL,
      token_expira_em = NULL
  WHERE id = usuario_record.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'E-mail verificado com sucesso!',
    'user_email', usuario_record.email,
    'user_name', usuario_record.nome
  );
END;
$$;


-- Primeiro, remover a função existente para poder recriar com novo tipo de retorno
DROP FUNCTION IF EXISTS public.validar_login(text, text);

-- Adicionar campos necessários para verificação de e-mail na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS verificado boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS token_verificacao uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS token_expira_em timestamp with time zone DEFAULT (now() + interval '24 hours');

-- Criar função para gerar novo token de verificação
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
      token_expira_em = now() + interval '24 hours'
  WHERE id = usuario_id;
  
  RETURN novo_token;
END;
$$;

-- Criar função para verificar e-mail com token
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

-- Recriar função de login com campo verificado incluído
CREATE OR REPLACE FUNCTION public.validar_login(email_input text, senha_input text)
RETURNS TABLE(id uuid, email text, nome text, telefone text, cargo text, ativo boolean, verificado boolean)
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
    u.ativo,
    u.verificado
  FROM public.usuarios u
  WHERE u.email = email_input 
    AND public.verify_password(senha_input, u.senha) = true
    AND u.ativo = true;
END;
$$;

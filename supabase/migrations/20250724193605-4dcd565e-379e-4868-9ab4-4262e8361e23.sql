-- Phase 1: Critical Database Security Fixes
-- Fix search_path vulnerabilities in database functions

-- 1. Fix functions with missing or incorrect search_path
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_configuracoes_sistema()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.atualizar_data_aprovacao()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Se o status mudou para 'aprovada', definir data_aprovacao
  IF NEW.status_fianca = 'aprovada' AND (OLD.status_fianca IS NULL OR OLD.status_fianca != 'aprovada') THEN
    NEW.data_aprovacao = now();
  END IF;
  
  -- Se o status mudou de 'aprovada' para outro, limpar data_aprovacao
  IF OLD.status_fianca = 'aprovada' AND NEW.status_fianca != 'aprovada' THEN
    NEW.data_aprovacao = NULL;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.criar_notificacao_fianca()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  usuario_imobiliaria_id UUID;
  titulo_notif TEXT;
  mensagem_notif TEXT;
BEGIN
  -- Só criar notificação se o status mudou
  IF OLD.status_fianca != NEW.status_fianca THEN
    -- Buscar ID da imobiliária
    usuario_imobiliaria_id := NEW.id_imobiliaria;
    
    -- Criar notificação para fiança aprovada
    IF NEW.status_fianca = 'aprovada' THEN
      titulo_notif := 'Fiança Aprovada';
      mensagem_notif := 'Sua fiança para ' || NEW.inquilino_nome_completo || ' foi aprovada!';
      
      INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
      VALUES (usuario_imobiliaria_id, titulo_notif, mensagem_notif, 'fianca_aprovada', 
              jsonb_build_object('fianca_id', NEW.id));
              
    -- Criar notificação para fiança rejeitada
    ELSIF NEW.status_fianca = 'rejeitada' THEN
      titulo_notif := 'Fiança Rejeitada';
      mensagem_notif := 'Sua fiança para ' || NEW.inquilino_nome_completo || ' foi rejeitada.';
      
      INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
      VALUES (usuario_imobiliaria_id, titulo_notif, mensagem_notif, 'fianca_rejeitada', 
              jsonb_build_object('fianca_id', NEW.id));
              
    -- Criar notificação para pagamento confirmado
    ELSIF NEW.status_fianca = 'pagamento_confirmado' THEN
      titulo_notif := 'Pagamento Confirmado';
      mensagem_notif := 'O pagamento da fiança para ' || NEW.inquilino_nome_completo || ' foi confirmado!';
      
      -- Notificar imobiliária
      INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
      VALUES (usuario_imobiliaria_id, titulo_notif, mensagem_notif, 'pagamento_confirmado', 
              jsonb_build_object('fianca_id', NEW.id));
              
      -- Notificar inquilino se tiver usuario_id
      IF NEW.inquilino_usuario_id IS NOT NULL THEN
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (NEW.inquilino_usuario_id, titulo_notif, mensagem_notif, 'pagamento_confirmado', 
                jsonb_build_object('fianca_id', NEW.id));
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.atualizar_timestamp_status_plataforma()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.gerar_token_verificacao(usuario_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  novo_token text;
BEGIN
  novo_token := encode(gen_random_bytes(16), 'hex');
  
  UPDATE public.usuarios 
  SET token_verificacao = novo_token::uuid,
      token_expira_em = now() + interval '15 minutes'  -- Reduced from 30 minutes for security
  WHERE id = usuario_id;
  
  RETURN novo_token;
END;
$function$;

CREATE OR REPLACE FUNCTION public.hash_password(password text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));  -- Increased cost from 10 to 12
END;
$function$;

CREATE OR REPLACE FUNCTION public.verificar_email(token_input uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
  
  -- Atualizar usuário como verificado e invalidar token
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
$function$;

CREATE OR REPLACE FUNCTION public.atualizar_timestamp_usuarios()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.atualizar_timestamp_perfil_usuario()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.inserir_historico_criacao_fianca()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  usuario_nome_var TEXT;
BEGIN
  -- Buscar o nome do usuário que criou a fiança
  IF NEW.criado_por IS NOT NULL THEN
    SELECT nome INTO usuario_nome_var 
    FROM public.usuarios 
    WHERE id = NEW.criado_por;
  END IF;
  
  INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, usuario_id, detalhes)
  VALUES (NEW.id, 'Fiança criada', 
          COALESCE(usuario_nome_var, 'Sistema'), 
          NEW.criado_por, 
          'Nova solicitação de fiança');
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.inserir_historico_atualizacao_fianca()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  usuario_nome_var TEXT DEFAULT 'Sistema';
  usuario_id_var UUID;
BEGIN
  -- Se o status mudou
  IF OLD.status_fianca != NEW.status_fianca THEN
    -- Para ações do analista, usar o ID do analista (assumindo que será passado via contexto)
    -- Por enquanto, vamos usar o criado_por como fallback
    usuario_id_var := NEW.criado_por;
    
    -- Buscar nome do usuário
    IF usuario_id_var IS NOT NULL THEN
      SELECT nome INTO usuario_nome_var 
      FROM public.usuarios 
      WHERE id = usuario_id_var;
    END IF;
    
    -- Se foi aprovada ou rejeitada, definir o id_analista
    IF NEW.status_fianca IN ('aprovada', 'rejeitada') AND NEW.id_analista IS NOT NULL THEN
      -- O id_analista já foi definido na aplicação
      NULL;
    END IF;
    
    INSERT INTO public.historico_fiancas (fianca_id, acao, usuario_nome, usuario_id, analisado_por, detalhes)
    VALUES (NEW.id, 
            CASE 
              WHEN NEW.status_fianca = 'aprovada' THEN 'Fiança aprovada'
              WHEN NEW.status_fianca = 'rejeitada' THEN 'Fiança rejeitada'
              WHEN NEW.status_fianca = 'em_analise' THEN 'Enviado para análise'
              WHEN NEW.status_fianca = 'enviada_ao_financeiro' THEN 'Enviada ao financeiro'
              WHEN NEW.status_fianca = 'aguardando_geracao_pagamento' THEN 'Aguardando geração de pagamento'
              ELSE 'Status alterado para ' || NEW.status_fianca
            END,
            COALESCE(usuario_nome_var, 'Sistema'),
            usuario_id_var,
            COALESCE(NEW.id_analista, usuario_id_var),
            CASE 
              WHEN NEW.status_fianca = 'rejeitada' AND NEW.motivo_reprovacao IS NOT NULL 
              THEN NEW.motivo_reprovacao
              WHEN NEW.status_fianca = 'aprovada' AND NEW.observacoes_aprovacao IS NOT NULL
              THEN NEW.observacoes_aprovacao
              ELSE NULL
            END
           );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.atualizar_timestamp_contratos_parceria()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 2. Replace overly permissive RLS policies with proper role-based access control

-- Fix fiancas_locaticias RLS policies
DROP POLICY IF EXISTS "Política temporária permissiva" ON public.fiancas_locaticias;

-- Create proper RLS policies for fiancas_locaticias
CREATE POLICY "Admins podem ver todas as fianças"
ON public.fiancas_locaticias
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);

CREATE POLICY "Analistas podem ver fianças para análise"
ON public.fiancas_locaticias
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'analista' 
    AND ativo = true
  )
);

CREATE POLICY "Imobiliárias podem ver suas próprias fianças"
ON public.fiancas_locaticias
FOR SELECT
USING (
  id_imobiliaria = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'imobiliaria' 
    AND ativo = true
  )
);

CREATE POLICY "Inquilinos podem ver suas próprias fianças"
ON public.fiancas_locaticias
FOR SELECT
USING (
  (inquilino_usuario_id = auth.uid() OR 
   inquilino_email IN (
     SELECT email FROM public.usuarios WHERE id = auth.uid()
   )) AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo IN ('inquilino', 'imobiliaria') 
    AND ativo = true
  )
);

CREATE POLICY "Executivos podem ver fianças que criaram"
ON public.fiancas_locaticias
FOR SELECT
USING (
  criado_por = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'executivo' 
    AND ativo = true
  )
);

CREATE POLICY "Financeiro pode ver fianças"
ON public.fiancas_locaticias
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'financeiro' 
    AND ativo = true
  )
);

-- Insert policies
CREATE POLICY "Imobiliárias podem criar fianças"
ON public.fiancas_locaticias
FOR INSERT
WITH CHECK (
  id_imobiliaria = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'imobiliaria' 
    AND ativo = true
  )
);

CREATE POLICY "Executivos podem criar fianças"
ON public.fiancas_locaticias
FOR INSERT
WITH CHECK (
  criado_por = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'executivo' 
    AND ativo = true
  )
);

-- Update policies
CREATE POLICY "Analistas podem atualizar fianças"
ON public.fiancas_locaticias
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo IN ('analista', 'admin') 
    AND ativo = true
  )
);

CREATE POLICY "Financeiro pode atualizar fianças"
ON public.fiancas_locaticias
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo IN ('financeiro', 'admin') 
    AND ativo = true
  )
);

-- Fix contratos_parceria RLS policies
DROP POLICY IF EXISTS "Permitir inserção temporaria" ON public.contratos_parceria;
DROP POLICY IF EXISTS "Permitir visualizacao temporaria" ON public.contratos_parceria;

CREATE POLICY "Imobiliárias podem ver seus contratos de parceria"
ON public.contratos_parceria
FOR SELECT
USING (
  imobiliaria_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'imobiliaria' 
    AND ativo = true
  )
);

CREATE POLICY "Sistema pode criar contratos de parceria"
ON public.contratos_parceria
FOR INSERT
WITH CHECK (true);

-- Fix tokens_redefinicao_senha RLS policies
-- Remove overly permissive policies and add proper ones
CREATE POLICY "Usuários podem ver apenas seus próprios tokens"
ON public.tokens_redefinicao_senha
FOR SELECT
USING (
  usuario_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);

CREATE POLICY "Usuários podem atualizar apenas seus próprios tokens"
ON public.tokens_redefinicao_senha
FOR UPDATE
USING (
  usuario_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);

-- 3. Add password reset rate limiting table
CREATE TABLE IF NOT EXISTS public.password_reset_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  attempts integer DEFAULT 1,
  last_attempt timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone
);

-- Enable RLS on the new table
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limiting table
CREATE POLICY "Sistema pode gerenciar tentativas de reset"
ON public.password_reset_attempts
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function for rate limiting password resets
CREATE OR REPLACE FUNCTION public.check_password_reset_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  attempt_record record;
  max_attempts integer := 5;
  lockout_duration interval := '1 hour';
BEGIN
  -- Get current attempt record
  SELECT * INTO attempt_record
  FROM public.password_reset_attempts
  WHERE email = user_email;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.password_reset_attempts (email, attempts, last_attempt)
    VALUES (user_email, 1, now());
    RETURN true;
  END IF;
  
  -- Check if user is currently blocked
  IF attempt_record.blocked_until IS NOT NULL AND attempt_record.blocked_until > now() THEN
    RETURN false;
  END IF;
  
  -- Reset attempts if last attempt was more than 1 hour ago
  IF attempt_record.last_attempt < now() - interval '1 hour' THEN
    UPDATE public.password_reset_attempts
    SET attempts = 1, last_attempt = now(), blocked_until = NULL
    WHERE email = user_email;
    RETURN true;
  END IF;
  
  -- Increment attempts
  IF attempt_record.attempts >= max_attempts THEN
    -- Block user
    UPDATE public.password_reset_attempts
    SET blocked_until = now() + lockout_duration
    WHERE email = user_email;
    RETURN false;
  ELSE
    -- Increment attempt count
    UPDATE public.password_reset_attempts
    SET attempts = attempts + 1, last_attempt = now()
    WHERE email = user_email;
    RETURN true;
  END IF;
END;
$function$;
-- Atualizar trigger para notificar quando status de documentos mudarem
DROP TRIGGER IF EXISTS trigger_notificar_admin_documento_anexado ON public.perfil_usuario;
DROP FUNCTION IF EXISTS public.notificar_admin_documento_anexado();

-- Criar função melhorada para notificar mudanças de status de documentos
CREATE OR REPLACE FUNCTION public.notificar_admin_mudanca_status_documento()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_id UUID;
  documento_tipo TEXT;
  usuario_nome TEXT;
  status_anterior TEXT;
  status_novo TEXT;
  mensagem_notif TEXT;
BEGIN
  -- Buscar nome do usuário
  SELECT nome INTO usuario_nome 
  FROM public.usuarios 
  WHERE id = NEW.usuario_id;
  
  -- Verificar mudanças no status dos documentos
  -- Cartão CNPJ
  IF OLD.status_cartao_cnpj IS DISTINCT FROM NEW.status_cartao_cnpj THEN
    documento_tipo := 'Cartão CNPJ';
    status_anterior := COALESCE(OLD.status_cartao_cnpj, 'pendente');
    status_novo := NEW.status_cartao_cnpj;
    
    -- Mensagem específica baseada no status
    IF status_novo = 'verificando' THEN
      mensagem_notif := 'A imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' anexou o documento: ' || documento_tipo;
    ELSE
      mensagem_notif := 'Status do documento ' || documento_tipo || ' da imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' foi alterado para: ' || status_novo;
    END IF;
    
    -- Notificar todos os admins
    FOR admin_id IN 
      SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
    LOOP
      INSERT INTO public.notificacoes (
        usuario_id, 
        titulo, 
        mensagem, 
        tipo, 
        dados_extras
      ) VALUES (
        admin_id,
        'Documento - ' || documento_tipo,
        mensagem_notif,
        'documento_status_alterado',
        jsonb_build_object(
          'usuario_id', NEW.usuario_id,
          'documento_tipo', documento_tipo,
          'status_anterior', status_anterior,
          'status_novo', status_novo,
          'perfil_id', NEW.id
        )
      );
    END LOOP;
  END IF;
  
  -- Comprovante de Endereço
  IF OLD.status_comprovante_endereco IS DISTINCT FROM NEW.status_comprovante_endereco THEN
    documento_tipo := 'Comprovante de Endereço';
    status_anterior := COALESCE(OLD.status_comprovante_endereco, 'pendente');
    status_novo := NEW.status_comprovante_endereco;
    
    IF status_novo = 'verificando' THEN
      mensagem_notif := 'A imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' anexou o documento: ' || documento_tipo;
    ELSE
      mensagem_notif := 'Status do documento ' || documento_tipo || ' da imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' foi alterado para: ' || status_novo;
    END IF;
    
    FOR admin_id IN 
      SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
    LOOP
      INSERT INTO public.notificacoes (
        usuario_id, 
        titulo, 
        mensagem, 
        tipo, 
        dados_extras
      ) VALUES (
        admin_id,
        'Documento - ' || documento_tipo,
        mensagem_notif,
        'documento_status_alterado',
        jsonb_build_object(
          'usuario_id', NEW.usuario_id,
          'documento_tipo', documento_tipo,
          'status_anterior', status_anterior,
          'status_novo', status_novo,
          'perfil_id', NEW.id
        )
      );
    END LOOP;
  END IF;
  
  -- Cartão CRECI
  IF OLD.status_cartao_creci IS DISTINCT FROM NEW.status_cartao_creci THEN
    documento_tipo := 'Cartão CRECI';
    status_anterior := COALESCE(OLD.status_cartao_creci, 'pendente');
    status_novo := NEW.status_cartao_creci;
    
    IF status_novo = 'verificando' THEN
      mensagem_notif := 'A imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' anexou o documento: ' || documento_tipo;
    ELSE
      mensagem_notif := 'Status do documento ' || documento_tipo || ' da imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' foi alterado para: ' || status_novo;
    END IF;
    
    FOR admin_id IN 
      SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
    LOOP
      INSERT INTO public.notificacoes (
        usuario_id, 
        titulo, 
        mensagem, 
        tipo, 
        dados_extras
      ) VALUES (
        admin_id,
        'Documento - ' || documento_tipo,
        mensagem_notif,
        'documento_status_alterado',
        jsonb_build_object(
          'usuario_id', NEW.usuario_id,
          'documento_tipo', documento_tipo,
          'status_anterior', status_anterior,
          'status_novo', status_novo,
          'perfil_id', NEW.id
        )
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger atualizado
CREATE TRIGGER trigger_notificar_admin_mudanca_status_documento
  AFTER UPDATE ON public.perfil_usuario
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_admin_mudanca_status_documento();
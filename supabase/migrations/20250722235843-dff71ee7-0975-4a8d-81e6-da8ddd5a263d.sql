-- Criar trigger para notificar admins quando documentos são anexados
CREATE OR REPLACE FUNCTION public.notificar_admin_documento_anexado()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_id UUID;
  documento_tipo TEXT;
  usuario_nome TEXT;
BEGIN
  -- Buscar nome do usuário
  SELECT nome INTO usuario_nome 
  FROM public.usuarios 
  WHERE id = NEW.usuario_id;
  
  -- Verificar quais documentos foram anexados
  IF OLD.cartao_cnpj IS NULL AND NEW.cartao_cnpj IS NOT NULL THEN
    documento_tipo := 'Cartão CNPJ';
  ELSIF OLD.comprovante_endereco IS NULL AND NEW.comprovante_endereco IS NOT NULL THEN
    documento_tipo := 'Comprovante de Endereço';
  ELSIF OLD.cartao_creci IS NULL AND NEW.cartao_creci IS NOT NULL THEN
    documento_tipo := 'Cartão CRECI';
  END IF;
  
  -- Se algum documento foi anexado, notificar todos os admins
  IF documento_tipo IS NOT NULL THEN
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
        'Documento anexado para verificação',
        'A imobiliária ' || COALESCE(usuario_nome, 'Não informado') || ' anexou um documento: ' || documento_tipo,
        'documento_anexado',
        jsonb_build_object(
          'usuario_id', NEW.usuario_id,
          'documento_tipo', documento_tipo,
          'perfil_id', NEW.id
        )
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_notificar_admin_documento_anexado ON public.perfil_usuario;
CREATE TRIGGER trigger_notificar_admin_documento_anexado
  AFTER UPDATE ON public.perfil_usuario
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_admin_documento_anexado();
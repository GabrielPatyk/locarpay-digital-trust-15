-- Melhorar função de notificações para fianças
CREATE OR REPLACE FUNCTION public.criar_notificacao_fianca_melhorada()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usuario_imobiliaria_id UUID;
  titulo_notif TEXT;
  mensagem_notif TEXT;
  admin_id UUID;
  analista_id UUID;
  financeiro_id UUID;
BEGIN
  -- Só criar notificação se o status mudou
  IF OLD.status_fianca IS DISTINCT FROM NEW.status_fianca THEN
    -- Buscar ID da imobiliária
    usuario_imobiliaria_id := NEW.id_imobiliaria;
    
    -- Criar notificação para fiança criada/em análise
    IF NEW.status_fianca = 'em_analise' AND (OLD.status_fianca IS NULL OR OLD.status_fianca != 'em_analise') THEN
      titulo_notif := 'Nova Fiança para Análise';
      mensagem_notif := 'Nova fiança #' || NEW.id || ' para ' || NEW.inquilino_nome_completo || ' aguardando análise';
      
      -- Notificar analistas
      FOR analista_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'analista' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (analista_id, titulo_notif, mensagem_notif, 'fianca_para_analise', 
                jsonb_build_object('fianca_id', NEW.id, 'acao', 'criada'));
      END LOOP;
      
      -- Notificar admins
      FOR admin_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (admin_id, titulo_notif, mensagem_notif, 'fianca_para_analise', 
                jsonb_build_object('fianca_id', NEW.id, 'acao', 'criada'));
      END LOOP;
              
    -- Criar notificação para fiança aprovada
    ELSIF NEW.status_fianca = 'aprovada' THEN
      titulo_notif := 'Fiança Aprovada';
      mensagem_notif := 'Fiança #' || NEW.id || ' para ' || NEW.inquilino_nome_completo || ' foi aprovada pelo analista';
      
      -- Notificar imobiliária
      INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
      VALUES (usuario_imobiliaria_id, titulo_notif, mensagem_notif, 'fianca_aprovada', 
              jsonb_build_object('fianca_id', NEW.id, 'analista_id', NEW.id_analista));
              
      -- Notificar admins
      FOR admin_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (admin_id, 'Fiança Aprovada - Admin', 
                'Fiança #' || NEW.id || ' aprovada pelo analista ID: ' || COALESCE(NEW.id_analista::text, 'N/A'), 
                'fianca_aprovada', 
                jsonb_build_object('fianca_id', NEW.id, 'analista_id', NEW.id_analista, 'imobiliaria_id', usuario_imobiliaria_id));
      END LOOP;
              
    -- Criar notificação para fiança rejeitada
    ELSIF NEW.status_fianca = 'rejeitada' THEN
      titulo_notif := 'Fiança Rejeitada';
      mensagem_notif := 'Fiança #' || NEW.id || ' para ' || NEW.inquilino_nome_completo || ' foi rejeitada';
      
      -- Notificar imobiliária
      INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
      VALUES (usuario_imobiliaria_id, titulo_notif, mensagem_notif, 'fianca_rejeitada', 
              jsonb_build_object('fianca_id', NEW.id, 'motivo', NEW.motivo_reprovacao));
              
      -- Notificar admins
      FOR admin_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (admin_id, 'Fiança Rejeitada - Admin', 
                'Fiança #' || NEW.id || ' rejeitada pelo analista ID: ' || COALESCE(NEW.id_analista::text, 'N/A'), 
                'fianca_rejeitada', 
                jsonb_build_object('fianca_id', NEW.id, 'analista_id', NEW.id_analista, 'imobiliaria_id', usuario_imobiliaria_id));
      END LOOP;
    
    -- Criar notificação para fiança enviada ao financeiro
    ELSIF NEW.status_fianca = 'enviada_ao_financeiro' THEN
      titulo_notif := 'Fiança Aceita pela Imobiliária';
      mensagem_notif := 'Imobiliária aceitou a fiança #' || NEW.id || ' para ' || NEW.inquilino_nome_completo;
      
      -- Notificar financeiro
      FOR financeiro_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'financeiro' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (financeiro_id, titulo_notif, mensagem_notif, 'fianca_aceita_imobiliaria', 
                jsonb_build_object('fianca_id', NEW.id, 'imobiliaria_id', usuario_imobiliaria_id));
      END LOOP;
      
      -- Notificar admins
      FOR admin_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (admin_id, 'Imobiliária Aceitou Fiança - Admin', 
                'Imobiliária ID: ' || usuario_imobiliaria_id || ' aceitou fiança #' || NEW.id, 
                'fianca_aceita_imobiliaria', 
                jsonb_build_object('fianca_id', NEW.id, 'imobiliaria_id', usuario_imobiliaria_id));
      END LOOP;
              
    -- Criar notificação para pagamento confirmado
    ELSIF NEW.status_fianca = 'pagamento_confirmado' THEN
      titulo_notif := 'Pagamento Confirmado';
      mensagem_notif := 'O pagamento da fiança #' || NEW.id || ' para ' || NEW.inquilino_nome_completo || ' foi confirmado!';
      
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
      
      -- Notificar admins
      FOR admin_id IN 
        SELECT id FROM public.usuarios WHERE cargo = 'admin' AND ativo = true
      LOOP
        INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, dados_extras)
        VALUES (admin_id, 'Pagamento Confirmado - Admin', 
                'Pagamento confirmado para fiança #' || NEW.id || ' - Imobiliária ID: ' || usuario_imobiliaria_id, 
                'pagamento_confirmado', 
                jsonb_build_object('fianca_id', NEW.id, 'imobiliaria_id', usuario_imobiliaria_id));
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS trigger_notificacao_fianca ON public.fiancas_locaticias;

-- Criar novo trigger
CREATE TRIGGER trigger_notificacao_fianca_melhorada
  AFTER UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_notificacao_fianca_melhorada();

-- Adicionar campo para endereço do imóvel na tabela contratos_fianca (caso não exista)
ALTER TABLE public.contratos_fianca 
ADD COLUMN IF NOT EXISTS imovel_endereco TEXT,
ADD COLUMN IF NOT EXISTS imovel_tipo TEXT;
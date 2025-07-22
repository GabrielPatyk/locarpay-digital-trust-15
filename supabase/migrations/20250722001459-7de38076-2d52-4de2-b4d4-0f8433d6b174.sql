-- Criar tabela de notificações
CREATE TABLE public.notificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'fianca_aprovada', 'fianca_rejeitada', 'pagamento_confirmado', etc
  lida BOOLEAN NOT NULL DEFAULT false,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dados_extras JSONB
);

-- Enable RLS
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver suas próprias notificações"
ON public.notificacoes FOR SELECT
USING (usuario_id = auth.uid());

CREATE POLICY "Sistema pode inserir notificações"
ON public.notificacoes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias notificações"
ON public.notificacoes FOR UPDATE
USING (usuario_id = auth.uid());

-- Função para criar notificação automática quando fiança for aprovada/rejeitada
CREATE OR REPLACE FUNCTION public.criar_notificacao_fianca()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Trigger para criar notificações automáticas
CREATE TRIGGER trigger_criar_notificacao_fianca
  AFTER UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_notificacao_fianca();
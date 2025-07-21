-- Criar tabela de configurações do sistema
CREATE TABLE public.configuracoes_sistema (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manutencao_ativa BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir registro padrão
INSERT INTO public.configuracoes_sistema (manutencao_ativa) VALUES (FALSE);

-- Habilitar RLS
ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

-- Política para admins poderem ver e atualizar
CREATE POLICY "Apenas admins podem ver configurações" 
ON public.configuracoes_sistema 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);

CREATE POLICY "Apenas admins podem atualizar configurações" 
ON public.configuracoes_sistema 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND cargo = 'admin' 
    AND ativo = true
  )
);

-- Política para todos poderem ver o status de manutenção (para o middleware)
CREATE POLICY "Todos podem ver status de manutenção" 
ON public.configuracoes_sistema 
FOR SELECT 
USING (true);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_configuracoes_sistema()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_timestamp_configuracoes_sistema
BEFORE UPDATE ON public.configuracoes_sistema
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_timestamp_configuracoes_sistema();
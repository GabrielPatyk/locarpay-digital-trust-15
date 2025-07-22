-- Criar tabela para configurações do status da plataforma
CREATE TABLE public.status_plataforma (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  versao_atual text NOT NULL DEFAULT 'v2.1.4',
  data_ultima_atualizacao timestamp with time zone NOT NULL DEFAULT now(),
  changelog jsonb DEFAULT '[]'::jsonb,
  navegadores_compativeis jsonb DEFAULT '[
    {"nome": "Chrome", "versao": "120+"},
    {"nome": "Firefox", "versao": "115+"},
    {"nome": "Safari", "versao": "16+"},
    {"nome": "Edge", "versao": "120+"}
  ]'::jsonb,
  infraestrutura jsonb DEFAULT '{
    "docker": "v24.0.7",
    "nodejs": "v20.11.0",
    "react": "v18.3.1",
    "supabase": "Latest"
  }'::jsonb,
  apis_integracoes jsonb DEFAULT '[
    {"nome": "API REST", "status": "ativa"},
    {"nome": "WebSocket", "status": "ativa"},
    {"nome": "Integração ZapSign", "status": "conectada"}
  ]'::jsonb,
  proximas_atualizacoes jsonb DEFAULT '[
    "Novos relatórios de performance (Agosto 2025)",
    "Interface mobile aprimorada (Setembro 2025)",
    "Integração com mais sistemas (Outubro 2025)"
  ]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Inserir dados iniciais
INSERT INTO public.status_plataforma (id) VALUES (gen_random_uuid());

-- Habilitar RLS
ALTER TABLE public.status_plataforma ENABLE ROW LEVEL SECURITY;

-- Política para admins visualizarem
CREATE POLICY "Admins podem ver status plataforma"
ON public.status_plataforma
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'admin'
    AND ativo = true
  )
);

-- Política para admins atualizarem
CREATE POLICY "Admins podem atualizar status plataforma"
ON public.status_plataforma
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE email = ((current_setting('request.jwt.claims', true))::json ->> 'email') 
    AND cargo = 'admin'
    AND ativo = true
  )
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_status_plataforma()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_atualizar_timestamp_status_plataforma
  BEFORE UPDATE ON public.status_plataforma
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_status_plataforma();
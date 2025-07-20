
-- Criar tabela para contratos de parceria
CREATE TABLE IF NOT EXISTS public.contratos_parceria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imobiliaria_id UUID NOT NULL UNIQUE,
  status_assinatura TEXT NOT NULL DEFAULT 'pendente' CHECK (status_assinatura IN ('pendente', 'assinado')),
  url_contrato TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.contratos_parceria ENABLE ROW LEVEL SECURITY;

-- Política para imobiliárias verem seus próprios contratos
CREATE POLICY "Imobiliarias podem ver seus contratos"
ON public.contratos_parceria
FOR SELECT
USING (imobiliaria_id = auth.uid());

-- Política para inserir contratos
CREATE POLICY "Usuarios podem inserir contratos"
ON public.contratos_parceria
FOR INSERT
WITH CHECK (imobiliaria_id = auth.uid());

-- Política para admins atualizarem contratos
CREATE POLICY "Admins podem atualizar contratos"
ON public.contratos_parceria
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE id = auth.uid() 
  AND cargo = 'admin'
));

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_contratos_parceria()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_atualizar_timestamp_contratos_parceria
  BEFORE UPDATE ON public.contratos_parceria
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_contratos_parceria();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_contratos_parceria_imobiliaria_id ON public.contratos_parceria(imobiliaria_id);
CREATE INDEX IF NOT EXISTS idx_contratos_parceria_status ON public.contratos_parceria(status_assinatura);

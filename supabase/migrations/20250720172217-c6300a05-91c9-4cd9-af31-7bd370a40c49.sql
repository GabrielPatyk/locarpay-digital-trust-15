
-- Criar tabela contratos_parceria
CREATE TABLE IF NOT EXISTS public.contratos_parceria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imobiliaria_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  status_assinatura TEXT NOT NULL DEFAULT 'pendente' CHECK (status_assinatura IN ('pendente', 'assinado')),
  link_assinatura TEXT,
  documento_assinado_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(imobiliaria_id)
);

-- Habilitar RLS
ALTER TABLE public.contratos_parceria ENABLE ROW LEVEL SECURITY;

-- Política para imobiliárias verem apenas seus próprios contratos
CREATE POLICY "Imobiliarias podem ver seus contratos"
ON public.contratos_parceria
FOR SELECT
USING (imobiliaria_id = auth.uid());

-- Política para inserir contratos (permitir para usuários autenticados)
CREATE POLICY "Usuarios podem inserir contratos"
ON public.contratos_parceria
FOR INSERT
WITH CHECK (imobiliaria_id = auth.uid());

-- Política para atualizar contratos (apenas admins podem atualizar)
CREATE POLICY "Admins podem atualizar contratos"
ON public.contratos_parceria
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE id = auth.uid() 
  AND cargo = 'admin'
));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_contratos_parceria()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_atualizar_timestamp_contratos_parceria
  BEFORE UPDATE ON public.contratos_parceria
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_contratos_parceria();

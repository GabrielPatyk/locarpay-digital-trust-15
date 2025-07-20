
-- Verificar se a tabela contratos_parceria existe e criar se necessário
CREATE TABLE IF NOT EXISTS public.contratos_parceria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imobiliaria_id UUID NOT NULL UNIQUE,
  status_assinatura TEXT NOT NULL DEFAULT 'pendente' CHECK (status_assinatura IN ('pendente', 'assinado')),
  link_assinatura TEXT,
  documento_assinado_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_imobiliaria FOREIGN KEY (imobiliaria_id) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.contratos_parceria ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
DROP POLICY IF EXISTS "Imobiliarias podem ver seus contratos" ON public.contratos_parceria;
CREATE POLICY "Imobiliarias podem ver seus contratos"
ON public.contratos_parceria
FOR SELECT
USING (imobiliaria_id = auth.uid());

DROP POLICY IF EXISTS "Usuarios podem inserir contratos" ON public.contratos_parceria;
CREATE POLICY "Usuarios podem inserir contratos"
ON public.contratos_parceria
FOR INSERT
WITH CHECK (imobiliaria_id = auth.uid());

DROP POLICY IF EXISTS "Admins podem atualizar contratos" ON public.contratos_parceria;
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
DROP TRIGGER IF EXISTS trigger_atualizar_timestamp_contratos_parceria ON public.contratos_parceria;
CREATE TRIGGER trigger_atualizar_timestamp_contratos_parceria
  BEFORE UPDATE ON public.contratos_parceria
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_contratos_parceria();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contratos_parceria_imobiliaria_id ON public.contratos_parceria(imobiliaria_id);
CREATE INDEX IF NOT EXISTS idx_contratos_parceria_status ON public.contratos_parceria(status_assinatura);

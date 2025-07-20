
-- Criar a tabela contratos_fianca
CREATE TABLE public.contratos_fianca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fianca_id UUID NOT NULL REFERENCES public.fiancas_locaticias(id) ON DELETE CASCADE,
    status_contrato TEXT NOT NULL DEFAULT 'pendente',
    url_contrato TEXT,
    documentos JSONB,
    selfie_url TEXT,
    data_envio TIMESTAMP WITH TIME ZONE,
    data_assinatura TIMESTAMP WITH TIME ZONE,
    assinantes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar Row Level Security
ALTER TABLE public.contratos_fianca ENABLE ROW LEVEL SECURITY;

-- Criar índices para melhor performance
CREATE INDEX idx_contratos_fianca_fianca_id ON public.contratos_fianca(fianca_id);
CREATE INDEX idx_contratos_fianca_status ON public.contratos_fianca(status_contrato);

-- Criar função para verificar se o usuário é superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id() 
    AND cargo = 'admin'
  );
$$;

-- Criar função para verificar se o usuário está nos assinantes
CREATE OR REPLACE FUNCTION public.user_is_signer(contract_signers JSONB)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = get_current_user_id() 
    AND email = ANY(
      SELECT jsonb_array_elements_text(
        CASE 
          WHEN jsonb_typeof(contract_signers) = 'array' 
          THEN (
            SELECT jsonb_agg(signer->>'email') 
            FROM jsonb_array_elements(contract_signers) AS signer
          )
          ELSE '[]'::jsonb
        END
      )
    )
  );
$$;

-- Criar política RLS para SELECT
CREATE POLICY "Superadmins e assinantes podem ver contratos"
ON public.contratos_fianca
FOR SELECT
TO public
USING (
  is_superadmin() OR 
  user_is_signer(assinantes)
);

-- Criar política RLS para INSERT (apenas superadmins)
CREATE POLICY "Apenas superadmins podem inserir contratos"
ON public.contratos_fianca
FOR INSERT
TO public
WITH CHECK (is_superadmin());

-- Criar política RLS para UPDATE (apenas superadmins)
CREATE POLICY "Apenas superadmins podem atualizar contratos"
ON public.contratos_fianca
FOR UPDATE
TO public
USING (is_superadmin())
WITH CHECK (is_superadmin());

-- Criar política RLS para DELETE (apenas superadmins)
CREATE POLICY "Apenas superadmins podem deletar contratos"
ON public.contratos_fianca
FOR DELETE
TO public
USING (is_superadmin());

-- Adicionar comentários para documentação
COMMENT ON TABLE public.contratos_fianca IS 'Tabela para armazenar contratos de fiança e status de assinatura via ZapSign';
COMMENT ON COLUMN public.contratos_fianca.status_contrato IS 'Status do contrato: pendente, aguardando_assinatura, assinado, recusado';
COMMENT ON COLUMN public.contratos_fianca.documentos IS 'JSONB array com URLs dos documentos anexados (RG, CPF, comprovantes, etc.)';
COMMENT ON COLUMN public.contratos_fianca.assinantes IS 'JSONB array com objetos contendo: tipo, nome, email, status_assinatura, data_assinatura';

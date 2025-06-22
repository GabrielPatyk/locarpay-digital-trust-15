
-- Adicionar campos para link de pagamento e comprovante na tabela fiancas_locaticias
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN IF NOT EXISTS link_pagamento TEXT,
ADD COLUMN IF NOT EXISTS comprovante_pagamento TEXT,
ADD COLUMN IF NOT EXISTS data_envio_link TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_comprovante TIMESTAMP WITH TIME ZONE;

-- Criar bucket para armazenar comprovantes de pagamento
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comprovantes', 'comprovantes', false)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que usuários façam upload de comprovantes
CREATE POLICY "Usuários podem fazer upload de comprovantes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'comprovantes');

-- Política para permitir que usuários vejam seus próprios comprovantes
CREATE POLICY "Usuários podem ver seus comprovantes" ON storage.objects
FOR SELECT USING (bucket_id = 'comprovantes');

-- Política para permitir que o financeiro veja todos os comprovantes
CREATE POLICY "Financeiro pode ver todos os comprovantes" ON storage.objects
FOR SELECT USING (bucket_id = 'comprovantes');

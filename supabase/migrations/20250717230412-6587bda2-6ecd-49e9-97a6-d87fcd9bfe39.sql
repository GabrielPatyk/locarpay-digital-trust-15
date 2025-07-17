
-- Primeiro, vamos verificar e corrigir as políticas RLS para a tabela imoveis_imobiliaria
-- Adicionar as novas colunas solicitadas
ALTER TABLE public.imoveis_imobiliaria 
ADD COLUMN IF NOT EXISTS nome_imovel TEXT,
ADD COLUMN IF NOT EXISTS midias_urls TEXT[], -- Array de URLs das mídias
ADD COLUMN IF NOT EXISTS proprietario_nome TEXT,
ADD COLUMN IF NOT EXISTS proprietario_email TEXT,
ADD COLUMN IF NOT EXISTS proprietario_whatsapp TEXT;

-- Verificar e corrigir a função get_current_user_id() se necessário
-- Recriar as políticas RLS com uma abordagem mais simples
DROP POLICY IF EXISTS "Imobiliarias podem inserir seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem ver seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem atualizar seus imoveis" ON public.imoveis_imobiliaria;
DROP POLICY IF EXISTS "Imobiliarias podem excluir seus imoveis" ON public.imoveis_imobiliaria;

-- Criar políticas mais simples que funcionem com o sistema atual
CREATE POLICY "Imobiliarias podem gerenciar seus imoveis"
ON public.imoveis_imobiliaria
FOR ALL
USING (
  id_imobiliaria IN (
    SELECT id FROM public.usuarios 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    AND cargo = 'imobiliaria'
  )
)
WITH CHECK (
  id_imobiliaria IN (
    SELECT id FROM public.usuarios 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    AND cargo = 'imobiliaria'
  )
);

-- Política para admins
CREATE POLICY "Admins podem gerenciar todos os imoveis"
ON public.imoveis_imobiliaria
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    AND cargo = 'admin'
  )
);

-- Criar bucket para mídias dos imóveis se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('imoveis-midias', 'imoveis-midias', true)
ON CONFLICT (id) DO NOTHING;

-- Política para o bucket de mídias dos imóveis
CREATE POLICY "Imobiliarias podem fazer upload de midias"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'imoveis-midias' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Midias dos imoveis sao publicas"
ON storage.objects
FOR SELECT
USING (bucket_id = 'imoveis-midias');

CREATE POLICY "Imobiliarias podem deletar suas midias"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'imoveis-midias' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

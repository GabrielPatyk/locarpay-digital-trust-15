
-- Corrigir as políticas RLS para o bucket de mídias dos imóveis
-- Remover políticas antigas que usam auth.uid()
DROP POLICY IF EXISTS "Imobiliarias podem fazer upload de midias" ON storage.objects;
DROP POLICY IF EXISTS "Midias dos imoveis sao publicas" ON storage.objects;
DROP POLICY IF EXISTS "Imobiliarias podem deletar suas midias" ON storage.objects;

-- Criar novas políticas mais permissivas que funcionem com o sistema atual
CREATE POLICY "Upload de midias imoveis permitido"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'imoveis-midias');

CREATE POLICY "Visualizacao de midias imoveis publica"
ON storage.objects
FOR SELECT
USING (bucket_id = 'imoveis-midias');

CREATE POLICY "Deletar midias imoveis permitido"
ON storage.objects
FOR DELETE
USING (bucket_id = 'imoveis-midias');

CREATE POLICY "Atualizar midias imoveis permitido"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'imoveis-midias');

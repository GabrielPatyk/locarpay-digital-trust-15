
-- Criar o bucket 'comprovantes' se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comprovantes', 'comprovantes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Política para permitir leitura pública dos comprovantes
CREATE POLICY "Public can view comprovantes" ON storage.objects
FOR SELECT USING (bucket_id = 'comprovantes');

-- Política para permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload comprovantes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'comprovantes' AND auth.role() = 'authenticated');

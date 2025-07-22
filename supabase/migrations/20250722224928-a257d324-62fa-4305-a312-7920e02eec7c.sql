-- Primeiro, vamos inserir um registro inicial na tabela status_plataforma se não existir
INSERT INTO public.status_plataforma (
  versao_atual, 
  data_ultima_atualizacao, 
  changelog, 
  navegadores_compativeis, 
  infraestrutura, 
  apis_integracoes, 
  proximas_atualizacoes
) 
SELECT 
  'v2.1.4',
  NOW(),
  '[]'::jsonb,
  '[{"nome": "Chrome", "versao": "120+"}, {"nome": "Firefox", "versao": "115+"}, {"nome": "Safari", "versao": "16+"}, {"nome": "Edge", "versao": "120+"}]'::jsonb,
  '{"react": "v18.3.1", "docker": "v24.0.7", "nodejs": "v20.11.0", "supabase": "Latest"}'::jsonb,
  '[{"nome": "API REST", "status": "ativa"}, {"nome": "WebSocket", "status": "ativa"}, {"nome": "Integração ZapSign", "status": "conectada"}]'::jsonb,
  '["Novos relatórios de performance (Agosto 2025)", "Interface mobile aprimorada (Setembro 2025)", "Integração com mais sistemas (Outubro 2025)"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.status_plataforma);

-- Adicionar campos para documentos executivos na tabela fiancas_locaticias
ALTER TABLE public.fiancas_locaticias 
ADD COLUMN IF NOT EXISTS documentos_executivo JSONB DEFAULT '{"rg": null, "cpf": null, "comprovante_residencia": null}'::jsonb,
ADD COLUMN IF NOT EXISTS anexado_por_executivo UUID REFERENCES public.usuarios(id),
ADD COLUMN IF NOT EXISTS data_anexo_executivo TIMESTAMP WITH TIME ZONE;

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_fiancas_anexado_executivo ON public.fiancas_locaticias(anexado_por_executivo);

-- Atualizar a trigger function para atualizar timestamp quando documentos executivos são alterados
CREATE OR REPLACE FUNCTION public.atualizar_data_anexo_executivo()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.documentos_executivo IS DISTINCT FROM NEW.documentos_executivo THEN
    NEW.data_anexo_executivo = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para a função
DROP TRIGGER IF EXISTS trigger_atualizar_data_anexo_executivo ON public.fiancas_locaticias;
CREATE TRIGGER trigger_atualizar_data_anexo_executivo
  BEFORE UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_data_anexo_executivo();
-- Remover trigger problemático que referencia tabela inexistente
DROP TRIGGER IF EXISTS trigger_criar_contrato_imobiliaria ON public.usuarios;
DROP FUNCTION IF EXISTS public.criar_contrato_imobiliaria();

-- Adicionar campo CEP ao perfil_usuario
ALTER TABLE public.perfil_usuario 
ADD COLUMN IF NOT EXISTS cep TEXT;

-- Adicionar campos de documentos ao perfil_usuario
ALTER TABLE public.perfil_usuario 
ADD COLUMN IF NOT EXISTS cartao_cnpj TEXT,
ADD COLUMN IF NOT EXISTS comprovante_endereco TEXT,
ADD COLUMN IF NOT EXISTS cartao_creci TEXT;

-- Adicionar campos de status dos documentos
ALTER TABLE public.perfil_usuario 
ADD COLUMN IF NOT EXISTS status_cartao_cnpj TEXT DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS status_comprovante_endereco TEXT DEFAULT 'pendente', 
ADD COLUMN IF NOT EXISTS status_cartao_creci TEXT DEFAULT 'pendente';

-- Adicionar campos de data de verificação
ALTER TABLE public.perfil_usuario 
ADD COLUMN IF NOT EXISTS data_verificacao_cartao_cnpj TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_verificacao_comprovante_endereco TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_verificacao_cartao_creci TIMESTAMP WITH TIME ZONE;

-- Função para atualizar status dos documentos
CREATE OR REPLACE FUNCTION public.atualizar_status_documento_perfil()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando um documento é anexado, mudar status para 'verificando'
  IF OLD.cartao_cnpj IS NULL AND NEW.cartao_cnpj IS NOT NULL THEN
    NEW.status_cartao_cnpj = 'verificando';
  END IF;
  
  IF OLD.comprovante_endereco IS NULL AND NEW.comprovante_endereco IS NOT NULL THEN
    NEW.status_comprovante_endereco = 'verificando';
  END IF;
  
  IF OLD.cartao_creci IS NULL AND NEW.cartao_creci IS NOT NULL THEN
    NEW.status_cartao_creci = 'verificando';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar status automaticamente
CREATE TRIGGER trigger_atualizar_status_documento_perfil
  BEFORE UPDATE ON public.perfil_usuario
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_status_documento_perfil();
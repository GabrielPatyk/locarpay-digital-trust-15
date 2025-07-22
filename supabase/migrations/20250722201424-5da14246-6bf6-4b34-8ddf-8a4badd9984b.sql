-- Corrigir a função com search_path seguro
CREATE OR REPLACE FUNCTION public.atualizar_status_documento_perfil()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;
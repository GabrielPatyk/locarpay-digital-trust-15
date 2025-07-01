-- Criar tabela de imóveis da imobiliária
CREATE TABLE public.imoveis_imobiliaria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_imobiliaria UUID NOT NULL REFERENCES public.usuarios(id),
  endereco TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  pais TEXT NOT NULL DEFAULT 'Brasil',
  tipo TEXT NOT NULL, -- Casa, Apartamento, Comercial, etc.
  area_metros NUMERIC,
  valor_aluguel NUMERIC NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'disponivel', -- disponivel, ocupado, manutencao
  inquilino_nome TEXT, -- Nome do inquilino se estiver ocupado
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE public.imoveis_imobiliaria ENABLE ROW LEVEL SECURITY;

-- Política para imobiliárias verem seus próprios imóveis
CREATE POLICY "Imobiliarias podem ver seus imoveis"
ON public.imoveis_imobiliaria
FOR SELECT
USING (id_imobiliaria = get_current_user_id());

-- Política para imobiliárias inserirem seus próprios imóveis
CREATE POLICY "Imobiliarias podem inserir seus imoveis"
ON public.imoveis_imobiliaria
FOR INSERT
WITH CHECK (id_imobiliaria = get_current_user_id());

-- Política para imobiliárias atualizarem seus próprios imóveis
CREATE POLICY "Imobiliarias podem atualizar seus imoveis"
ON public.imoveis_imobiliaria
FOR UPDATE
USING (id_imobiliaria = get_current_user_id());

-- Política para imobiliárias excluírem seus próprios imóveis
CREATE POLICY "Imobiliarias podem excluir seus imoveis"
ON public.imoveis_imobiliaria
FOR DELETE
USING (id_imobiliaria = get_current_user_id());

-- Políticas para admins verem e gerenciarem todos os imóveis
CREATE POLICY "Admins podem ver todos os imoveis"
ON public.imoveis_imobiliaria
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE id = get_current_user_id() 
  AND cargo = 'admin'
));

-- Criar função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_imoveis()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar timestamp automaticamente
CREATE TRIGGER trigger_atualizar_timestamp_imoveis
  BEFORE UPDATE ON public.imoveis_imobiliaria
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_imoveis();
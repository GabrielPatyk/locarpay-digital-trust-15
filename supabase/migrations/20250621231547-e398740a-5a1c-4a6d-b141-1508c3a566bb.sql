
-- Criar enum para status da fiança
CREATE TYPE public.status_fianca AS ENUM (
  'em_analise',
  'aprovada',
  'rejeitada',
  'ativa',
  'vencida',
  'cancelada'
);

-- Criar tabela de fianças locatícias
CREATE TABLE public.fiancas_locaticias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_imobiliaria UUID NOT NULL REFERENCES public.usuarios(id),
  
  -- Dados do Inquilino
  inquilino_nome_completo TEXT NOT NULL,
  inquilino_cpf TEXT NOT NULL,
  inquilino_email TEXT NOT NULL,
  inquilino_whatsapp TEXT NOT NULL,
  inquilino_renda_mensal DECIMAL(10,2) NOT NULL,
  
  -- Endereço do Inquilino
  inquilino_endereco TEXT NOT NULL,
  inquilino_numero TEXT NOT NULL,
  inquilino_complemento TEXT,
  inquilino_bairro TEXT NOT NULL,
  inquilino_cidade TEXT NOT NULL,
  inquilino_estado TEXT NOT NULL,
  inquilino_pais TEXT NOT NULL DEFAULT 'Brasil',
  
  -- Dados do Imóvel
  imovel_tipo TEXT NOT NULL,
  imovel_tipo_locacao TEXT NOT NULL,
  imovel_valor_aluguel DECIMAL(10,2) NOT NULL,
  imovel_descricao TEXT,
  imovel_area_metros DECIMAL(8,2),
  imovel_tempo_locacao INTEGER NOT NULL,
  
  -- Endereço do Imóvel
  imovel_endereco TEXT NOT NULL,
  imovel_numero TEXT NOT NULL,
  imovel_complemento TEXT,
  imovel_bairro TEXT NOT NULL,
  imovel_cidade TEXT NOT NULL,
  imovel_estado TEXT NOT NULL,
  imovel_pais TEXT NOT NULL DEFAULT 'Brasil',
  
  -- Status e datas
  status_fianca public.status_fianca NOT NULL DEFAULT 'em_analise',
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_vencimento DATE,
  
  -- Índices para otimização
  CONSTRAINT fiancas_locaticias_id_imobiliaria_idx FOREIGN KEY (id_imobiliaria) REFERENCES public.usuarios(id)
);

-- Habilitar RLS
ALTER TABLE public.fiancas_locaticias ENABLE ROW LEVEL SECURITY;

-- Política para que imobiliárias vejam apenas suas próprias fianças
CREATE POLICY "Imobiliarias podem ver suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR SELECT
  USING (id_imobiliaria = auth.uid() OR id_imobiliaria IN (
    SELECT id FROM public.usuarios WHERE id = auth.uid() AND cargo = 'imobiliaria'
  ));

-- Política para que imobiliárias possam inserir suas próprias fianças
CREATE POLICY "Imobiliarias podem inserir suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR INSERT
  WITH CHECK (id_imobiliaria = auth.uid() OR id_imobiliaria IN (
    SELECT id FROM public.usuarios WHERE id = auth.uid() AND cargo = 'imobiliaria'
  ));

-- Política para que imobiliárias possam atualizar suas próprias fianças
CREATE POLICY "Imobiliarias podem atualizar suas proprias fiancas"
  ON public.fiancas_locaticias
  FOR UPDATE
  USING (id_imobiliaria = auth.uid() OR id_imobiliaria IN (
    SELECT id FROM public.usuarios WHERE id = auth.uid() AND cargo = 'imobiliaria'
  ));

-- Políticas para admins verem todas as fianças
CREATE POLICY "Admins podem ver todas as fiancas"
  ON public.fiancas_locaticias
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cargo = 'admin'
  ));

-- Trigger para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_fiancas()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_atualizar_timestamp_fiancas
  BEFORE UPDATE ON public.fiancas_locaticias
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_fiancas();

-- Índices para performance
CREATE INDEX idx_fiancas_locaticias_id_imobiliaria ON public.fiancas_locaticias(id_imobiliaria);
CREATE INDEX idx_fiancas_locaticias_status ON public.fiancas_locaticias(status_fianca);
CREATE INDEX idx_fiancas_locaticias_data_criacao ON public.fiancas_locaticias(data_criacao);

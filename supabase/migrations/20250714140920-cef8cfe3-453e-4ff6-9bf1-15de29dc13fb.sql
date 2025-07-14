
-- Criar tabela contratos_locarpay seguindo o modelo de fiancas_locaticias
CREATE TABLE public.contratos_locarpay (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_imobiliaria UUID NOT NULL REFERENCES public.usuarios(id),
  id_inquilino UUID REFERENCES public.usuarios(id),
  id_analista UUID REFERENCES public.usuarios(id),
  
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
  
  -- Dados do Contrato
  numero_contrato TEXT UNIQUE,
  data_inicio_contrato DATE,
  data_fim_contrato DATE,
  valor_total_contrato DECIMAL(10,2),
  valor_fianca DECIMAL(10,2),
  taxa_aplicada DECIMAL(5,2),
  score_credito INTEGER,
  
  -- Status e datas
  status_contrato TEXT NOT NULL DEFAULT 'ativo',
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_assinatura TIMESTAMP WITH TIME ZONE,
  
  -- Observações
  observacoes TEXT,
  
  -- Dados financeiros
  valor_parcela_mensal DECIMAL(10,2),
  dia_vencimento_parcela INTEGER,
  
  CONSTRAINT contratos_locarpay_id_imobiliaria_fkey FOREIGN KEY (id_imobiliaria) REFERENCES public.usuarios(id),
  CONSTRAINT contratos_locarpay_id_inquilino_fkey FOREIGN KEY (id_inquilino) REFERENCES public.usuarios(id),
  CONSTRAINT contratos_locarpay_id_analista_fkey FOREIGN KEY (id_analista) REFERENCES public.usuarios(id)
);

-- Habilitar RLS
ALTER TABLE public.contratos_locarpay ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contratos_locarpay
CREATE POLICY "Imobiliarias podem ver seus contratos"
  ON public.contratos_locarpay
  FOR SELECT
  USING (id_imobiliaria = auth.uid());

CREATE POLICY "Imobiliarias podem inserir seus contratos"
  ON public.contratos_locarpay
  FOR INSERT
  WITH CHECK (id_imobiliaria = auth.uid());

CREATE POLICY "Imobiliarias podem atualizar seus contratos"
  ON public.contratos_locarpay
  FOR UPDATE
  USING (id_imobiliaria = auth.uid());

CREATE POLICY "Analistas podem ver todos os contratos"
  ON public.contratos_locarpay
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cargo = 'analista'
  ));

CREATE POLICY "Admins podem gerenciar todos os contratos"
  ON public.contratos_locarpay
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cargo = 'admin'
  ));

-- Trigger para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_contratos()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_atualizar_timestamp_contratos
  BEFORE UPDATE ON public.contratos_locarpay
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_contratos();

-- Índices para performance
CREATE INDEX idx_contratos_locarpay_id_imobiliaria ON public.contratos_locarpay(id_imobiliaria);
CREATE INDEX idx_contratos_locarpay_id_inquilino ON public.contratos_locarpay(id_inquilino);
CREATE INDEX idx_contratos_locarpay_id_analista ON public.contratos_locarpay(id_analista);
CREATE INDEX idx_contratos_locarpay_status ON public.contratos_locarpay(status_contrato);
CREATE INDEX idx_contratos_locarpay_data_criacao ON public.contratos_locarpay(data_criacao);

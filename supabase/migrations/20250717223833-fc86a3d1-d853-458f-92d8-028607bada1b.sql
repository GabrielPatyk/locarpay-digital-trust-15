
-- Criar tabela contratos_imobiliaria_locarpay
CREATE TABLE public.contratos_imobiliaria_locarpay (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_imobiliaria UUID NOT NULL REFERENCES public.usuarios(id),
  id_executivo UUID REFERENCES public.usuarios(id),
  criado_por TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modelo_contrato TEXT,
  dados_contrato JSONB,
  assinado BOOLEAN NOT NULL DEFAULT false,
  data_assinatura TIMESTAMP WITH TIME ZONE,
  link_assinatura TEXT,
  contrato_download TEXT,
  observacoes TEXT
);

-- Habilitar RLS
ALTER TABLE public.contratos_imobiliaria_locarpay ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contratos_imobiliaria_locarpay
CREATE POLICY "Imobiliarias podem ver seus contratos"
  ON public.contratos_imobiliaria_locarpay
  FOR SELECT
  USING (id_imobiliaria = get_current_user_id());

CREATE POLICY "Imobiliarias podem atualizar seus contratos"
  ON public.contratos_imobiliaria_locarpay
  FOR UPDATE
  USING (id_imobiliaria = get_current_user_id());

CREATE POLICY "Executivos podem ver contratos de suas imobiliarias"
  ON public.contratos_imobiliaria_locarpay
  FOR SELECT
  USING (id_executivo = get_current_user_id());

CREATE POLICY "Executivos podem inserir contratos"
  ON public.contratos_imobiliaria_locarpay
  FOR INSERT
  WITH CHECK (id_executivo = get_current_user_id());

CREATE POLICY "Executivos podem atualizar contratos"
  ON public.contratos_imobiliaria_locarpay
  FOR UPDATE
  USING (id_executivo = get_current_user_id());

CREATE POLICY "Admins podem gerenciar todos os contratos"
  ON public.contratos_imobiliaria_locarpay
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = get_current_user_id()
    AND cargo = 'admin'
  ));

-- Função para criar contrato automaticamente quando imobiliária é criada
CREATE OR REPLACE FUNCTION criar_contrato_imobiliaria()
RETURNS TRIGGER AS $$
BEGIN
  -- Só criar contrato para usuários do tipo imobiliaria
  IF NEW.cargo = 'imobiliaria' THEN
    INSERT INTO public.contratos_imobiliaria_locarpay (
      id_imobiliaria,
      id_executivo,
      criado_por,
      modelo_contrato,
      dados_contrato
    ) VALUES (
      NEW.id,
      NEW.criado_por, -- Assume que o criador é o executivo
      NEW.criado_por,
      'imobiliaria_locarpay',
      jsonb_build_object(
        'nome_imobiliaria', NEW.nome,
        'email_imobiliaria', NEW.email,
        'telefone_imobiliaria', NEW.telefone
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar contrato automaticamente
CREATE TRIGGER trigger_criar_contrato_imobiliaria
  AFTER INSERT ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION criar_contrato_imobiliaria();

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION atualizar_timestamp_contratos()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_timestamp_contratos
  BEFORE UPDATE ON public.contratos_imobiliaria_locarpay
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp_contratos();

-- Índices para performance
CREATE INDEX idx_contratos_imobiliaria_locarpay_id_imobiliaria ON public.contratos_imobiliaria_locarpay(id_imobiliaria);
CREATE INDEX idx_contratos_imobiliaria_locarpay_id_executivo ON public.contratos_imobiliaria_locarpay(id_executivo);
CREATE INDEX idx_contratos_imobiliaria_locarpay_assinado ON public.contratos_imobiliaria_locarpay(assinado);


-- Criar tabela contratos_locarpay para gerenciar todos os contratos da plataforma
CREATE TABLE public.contratos_locarpay (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_imobiliaria UUID NOT NULL REFERENCES public.usuarios(id),
  id_executivo UUID NOT NULL REFERENCES public.usuarios(id),
  criado_por UUID NOT NULL REFERENCES public.usuarios(id),
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modelo_contrato TEXT NOT NULL, -- Ex: 'imobiliaria_locarpay', 'inquilino_locarpay', etc
  link_assinatura TEXT,
  arquivo_download TEXT,
  assinado BOOLEAN NOT NULL DEFAULT FALSE,
  data_assinatura TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  
  -- Dados específicos do contrato (JSON para flexibilidade)
  dados_contrato JSONB,
  
  -- Audit fields
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT contratos_locarpay_id_imobiliaria_fkey FOREIGN KEY (id_imobiliaria) REFERENCES public.usuarios(id),
  CONSTRAINT contratos_locarpay_id_executivo_fkey FOREIGN KEY (id_executivo) REFERENCES public.usuarios(id),
  CONSTRAINT contratos_locarpay_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.usuarios(id)
);

-- Habilitar RLS
ALTER TABLE public.contratos_locarpay ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contratos_locarpay
CREATE POLICY "Imobiliarias podem ver seus contratos"
  ON public.contratos_locarpay
  FOR SELECT
  USING (id_imobiliaria = auth.uid());

CREATE POLICY "Executivos podem ver contratos criados por eles"
  ON public.contratos_locarpay
  FOR SELECT
  USING (id_executivo = auth.uid() OR criado_por = auth.uid());

CREATE POLICY "Executivos podem inserir contratos"
  ON public.contratos_locarpay
  FOR INSERT
  WITH CHECK (id_executivo = auth.uid() OR criado_por = auth.uid());

CREATE POLICY "Executivos podem atualizar contratos criados por eles"
  ON public.contratos_locarpay
  FOR UPDATE
  USING (id_executivo = auth.uid() OR criado_por = auth.uid());

CREATE POLICY "Imobiliarias podem atualizar status de assinatura de seus contratos"
  ON public.contratos_locarpay
  FOR UPDATE
  USING (id_imobiliaria = auth.uid());

CREATE POLICY "Admins podem gerenciar todos os contratos"
  ON public.contratos_locarpay
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cargo = 'admin'
  ));

-- Trigger para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION public.atualizar_timestamp_contratos_locarpay()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_atualizar_timestamp_contratos_locarpay
  BEFORE UPDATE ON public.contratos_locarpay
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_timestamp_contratos_locarpay();

-- Índices para performance
CREATE INDEX idx_contratos_locarpay_id_imobiliaria ON public.contratos_locarpay(id_imobiliaria);
CREATE INDEX idx_contratos_locarpay_id_executivo ON public.contratos_locarpay(id_executivo);
CREATE INDEX idx_contratos_locarpay_criado_por ON public.contratos_locarpay(criado_por);
CREATE INDEX idx_contratos_locarpay_modelo ON public.contratos_locarpay(modelo_contrato);
CREATE INDEX idx_contratos_locarpay_assinado ON public.contratos_locarpay(assinado);
CREATE INDEX idx_contratos_locarpay_data_criacao ON public.contratos_locarpay(data_criacao);

-- Função para criar contrato automaticamente quando imobiliária é criada
CREATE OR REPLACE FUNCTION public.criar_contrato_imobiliaria()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Só criar contrato se for imobiliária e tiver criado_por (executivo)
  IF NEW.cargo = 'imobiliaria' AND NEW.criado_por IS NOT NULL THEN
    INSERT INTO public.contratos_locarpay (
      id_imobiliaria,
      id_executivo,
      criado_por,
      modelo_contrato,
      assinado,
      dados_contrato
    ) VALUES (
      NEW.id,
      NEW.criado_por,
      NEW.criado_por,
      'imobiliaria_locarpay',
      FALSE,
      jsonb_build_object(
        'nome_imobiliaria', NEW.nome,
        'email_imobiliaria', NEW.email,
        'telefone_imobiliaria', NEW.telefone
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para criar contrato automaticamente
CREATE TRIGGER trigger_criar_contrato_imobiliaria
  AFTER INSERT ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_contrato_imobiliaria();
